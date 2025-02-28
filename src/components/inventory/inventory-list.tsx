'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { EditInventoryItemModal } from '@/components/inventory/edit-inventory-item-modal'
import { SweetAlert } from '@/components/sweet-alert'

export type InventoryItem = {
  id: number
  name: string
  quantity: number
  unit: string
  reorderPoint: number
}

export function InventoryList() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'warning',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchInventory = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/inventory')
      if (!response.ok) throw new Error('Failed to fetch inventory')
      const data = await response.json()
      setInventory(data)
    } catch (error) {
      console.error('Error fetching inventory:', error)
      setAlertState({
        isOpen: true,
        type: 'error',
        message: 'ไม่สามารถดึงข้อมูลวัตถุดิบได้',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item)
  }

  const handleSave = async (editedItem: InventoryItem) => {
    try {
      const response = await fetch(`/api/inventory/${editedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedItem),
      })

      if (!response.ok) throw new Error('Failed to update item')

      await fetchInventory()
      setEditingItem(null)
      setAlertState({
        isOpen: true,
        type: 'success',
        message: 'แก้ไขข้อมูลวัตถุดิบเรียบร้อยแล้ว',
      })
    } catch (error) {
      console.error('Error updating inventory item:', error)
      setAlertState({
        isOpen: true,
        type: 'error',
        message: 'ไม่สามารถแก้ไขข้อมูลวัตถุดิบได้',
      })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete item')

      await fetchInventory()
      setAlertState({
        isOpen: true,
        type: 'success',
        message: 'ลบข้อมูลวัตถุดิบเรียบร้อยแล้ว',
      })
    } catch (error) {
      console.error('Error deleting inventory item:', error)
      setAlertState({
        isOpen: true,
        type: 'error',
        message: 'ไม่สามารถลบข้อมูลวัตถุดิบได้',
      })
    }
  }

  const getStatus = (item: InventoryItem) => {
    const ratio = item.quantity / item.reorderPoint
    if (ratio <= 0.5) {
      return {
        label: 'วัตถุดิบใกล้หมด',
        color: 'text-red-500',
        icon: AlertCircle,
      }
    } else if (ratio <= 1) {
      return {
        label: 'ควรสั่งซื้อเพิ่ม',
        color: 'text-yellow-500',
        icon: AlertTriangle,
      }
    } else {
      return {
        label: 'ปกติ',
        color: 'text-green-500',
        icon: CheckCircle2,
      }
    }
  }

  const getLowStockItems = () => {
    return inventory.filter((item) => item.quantity <= item.reorderPoint)
  }

  return (
    <div className='space-y-6'>
      {/* Add Notifications Section */}
      {getLowStockItems().length > 0 && (
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
          <div className='flex items-center gap-2 mb-3'>
            <AlertTriangle className='h-5 w-5 text-yellow-600' />
            <h3 className='font-semibold text-yellow-600'>
              การแจ้งเตือนวัตถุดิบใกล้หมด
            </h3>
          </div>
          <div className='grid gap-2'>
            {getLowStockItems().map((item) => (
              <div
                key={item.id}
                className='flex items-center justify-between bg-white p-3 rounded-md border border-yellow-100'
              >
                <span className='font-medium'>{item.name}</span>
                <div className='flex items-center gap-4'>
                  <span className='text-yellow-600'>
                    เหลือ {item.quantity} {item.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Inventory Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อวัตถุดิบ</TableHead>
              <TableHead>จำนวน</TableHead>
              <TableHead>หน่วย</TableHead>
              <TableHead>จุดสั่งซื้อ</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className='text-center'>
                  กำลังโหลดข้อมูล...
                </TableCell>
              </TableRow>
            ) : inventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='text-center'>
                  ไม่พบข้อมูลวัตถุดิบ
                </TableCell>
              </TableRow>
            ) : (
              inventory.map((item) => {
                const status = getStatus(item)
                const StatusIcon = status.icon
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.reorderPoint}</TableCell>
                    <TableCell>
                      <span className={`flex items-center ${status.color}`}>
                        <StatusIcon className='w-4 h-4 mr-1' />
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleEdit(item)}
                        title='แก้ไข'
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleDelete(item.id)}
                        title='ลบ'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Existing Modals and Alerts */}
      {editingItem && (
        <EditInventoryItemModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          item={editingItem}
          onSave={handleSave}
        />
      )}
      <SweetAlert
        type={alertState.type}
        message={alertState.message}
        isOpen={alertState.isOpen}
        onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}
