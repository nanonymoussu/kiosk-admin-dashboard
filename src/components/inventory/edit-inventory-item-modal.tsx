'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EditInventoryItemModalProps {
  isOpen: boolean
  onClose: () => void
  item: {
    id: number
    name: string
    quantity: number
    unit: string
    reorderPoint: number
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (editedItem: any) => void
}

export function EditInventoryItemModal({
  isOpen,
  onClose,
  item,
  onSave,
}: EditInventoryItemModalProps) {
  const [editedItem, setEditedItem] = useState(item)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedItem((prev) => ({
      ...prev,
      [name]:
        name === 'quantity' || name === 'reorderPoint' ? Number(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(editedItem)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>แก้ไขข้อมูลวัตถุดิบ</DialogTitle>
          <DialogDescription>
            แก้ไขข้อมูลวัตถุดิบที่ต้องการเปลี่ยนแปลง
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
                value={editedItem.name}
                onChange={handleInputChange}
                className='col-span-3'
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
                value={editedItem.quantity}
                onChange={handleInputChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='unit' className='text-right'>
                หน่วย
              </Label>
              <Input
                id='unit'
                name='unit'
                value={editedItem.unit}
                onChange={handleInputChange}
                className='col-span-3'
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
                value={editedItem.reorderPoint}
                onChange={handleInputChange}
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>บันทึกการเปลี่ยนแปลง</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
