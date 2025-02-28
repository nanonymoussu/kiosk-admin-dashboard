'use client'

import { useState } from 'react'
import { MenuList } from '@/components/menu/menu-list'
import { SweetAlert } from '@/components/sweet-alert'
import { PageContainer } from '@/components/page-container'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useRole } from '@/contexts/RoleContext'
import { AddMenuItemModal } from '@/components/menu/add-menu-item-modal'
import { mutate } from 'swr'
import { MenuItem } from '@/types/menu-item'

export default function MenuPage() {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'warning',
    message: '',
  })
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { role } = useRole()

  const showAlert = (
    type: 'success' | 'error' | 'warning',
    message: string
  ) => {
    setAlertState({ isOpen: true, type, message })
  }

  const handleAddClick = () => {
    if (role !== 'admin') {
      showAlert('error', 'คุณไม่มีสิทธิ์ในการเพิ่มเมนูอาหาร')
      return
    }
    setIsAddModalOpen(true)
  }

  const handleAddMenuItem = async (newItem: MenuItem) => {
    try {
      const response = await fetch('/api/menu-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create menu item')
      }

      showAlert('success', 'เพิ่มเมนูอาหารใหม่เรียบร้อยแล้ว')
      setIsAddModalOpen(false)
      // Refresh the menu list
      await mutate('/api/menu-items')
    } catch (error: unknown) {
      console.error('Error creating menu item:', error)
      showAlert(
        'error',
        error instanceof Error
          ? error.message
          : 'เกิดข้อผิดพลาดในการเพิ่มเมนูอาหาร'
      )
    }
  }

  return (
    <PageContainer>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl md:text-3xl font-bold'>จัดการเมนูอาหาร</h1>
        {role === 'admin' && (
          <Button onClick={handleAddClick}>
            <PlusCircle className='h-4 w-4 mr-2' />
            เพิ่มเมนูใหม่
          </Button>
        )}
      </div>
      <MenuList onAction={showAlert} />
      {isAddModalOpen && (
        <AddMenuItemModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddMenuItem}
        />
      )}
      <SweetAlert
        type={alertState.type}
        message={alertState.message}
        isOpen={alertState.isOpen}
        onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
      />
    </PageContainer>
  )
}
