'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SweetAlert } from '@/components/sweet-alert'

interface InventoryActionsProps {
  onInventoryUpdate: () => void
}

export function InventoryActions({ onInventoryUpdate }: InventoryActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    unit: '',
    reorderPoint: '',
  })
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: '',
    message: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewItem((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formattedItem = {
        ...newItem,
        quantity: Number(newItem.quantity) || 0,
        reorderPoint: Number(newItem.reorderPoint) || 0,
      }

      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedItem),
      })

      if (!response.ok) {
        throw new Error('Failed to create item')
      }

      setIsDialogOpen(false)
      setNewItem({ name: '', quantity: '', unit: '', reorderPoint: '' })
      await onInventoryUpdate()

      // Add success notification
      setAlertState({
        isOpen: true,
        type: 'success',
        message: 'เพิ่มข้อมูลวัตถุดิบเรียบร้อยแล้ว',
      })
    } catch (error) {
      console.error('Error creating inventory item:', error)
      setAlertState({
        isOpen: true,
        type: 'error',
        message: 'ไม่สามารถเพิ่มข้อมูลวัตถุดิบได้',
      })
    }
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className='mr-2 h-4 w-4' />
            เพิ่มวัตถุดิบ
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>เพิ่มวัตถุดิบใหม่</DialogTitle>
            <DialogDescription>
              กรุณากรอกข้อมูลวัตถุดิบที่ต้องการเพิ่ม
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='name' className='text-right'>
                  ชื่อวัตถุดิบ
                </Label>
                <Input
                  id='name'
                  name='name'
                  value={newItem.name}
                  onChange={handleInputChange}
                  className='col-span-3'
                  placeholder='เช่น แป้งพิซซ่า'
                  required
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='quantity' className='text-right'>
                  จำนวน
                </Label>
                <Input
                  id='quantity'
                  name='quantity'
                  type='number'
                  value={newItem.quantity}
                  onChange={handleInputChange}
                  className='col-span-3'
                  placeholder='เช่น 100'
                  min={0}
                  step='0.01'
                  required
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='unit' className='text-right'>
                  หน่วย
                </Label>
                <Input
                  id='unit'
                  name='unit'
                  value={newItem.unit}
                  onChange={handleInputChange}
                  className='col-span-3'
                  placeholder='เช่น กิโลกรัม, ลิตร'
                  required
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='reorderPoint' className='text-right'>
                  จุดสั่งซื้อ
                </Label>
                <Input
                  id='reorderPoint'
                  name='reorderPoint'
                  type='number'
                  value={newItem.reorderPoint}
                  onChange={handleInputChange}
                  className='col-span-3'
                  placeholder='เช่น 20'
                  min={0}
                  step='0.01'
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type='submit'>เพิ่มวัตถุดิบ</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <SweetAlert
        type={alertState.type as 'success' | 'error' | 'warning'}
        message={alertState.message}
        isOpen={alertState.isOpen}
        onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  )
}
