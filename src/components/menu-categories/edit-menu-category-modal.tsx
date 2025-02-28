'use client'

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
import { MenuCategory } from '@/types/menu-category'

export function EditMenuCategoryModal({
  isOpen,
  onClose,
  category,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  category: {
    id: number
    nameTH: string
    nameEN: string
  }
  onSave: (editedCategory: MenuCategory) => void
}) {
  const [editedCategory, setEditedCategory] = useState(category)
  const [errors, setErrors] = useState({ nameTH: '', nameEN: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedCategory((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const newErrors = { nameTH: '', nameEN: '' }
    let isValid = true

    if (!editedCategory.nameTH.trim()) {
      newErrors.nameTH = 'กรุณากรอกชื่อหมวดหมู่ภาษาไทย'
      isValid = false
    }
    if (!editedCategory.nameEN.trim()) {
      newErrors.nameEN = 'กรุณากรอกชื่อหมวดหมู่ภาษาอังกฤษ'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(editedCategory)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>แก้ไขหมวดหมู่เมนูอาหาร</DialogTitle>
          <DialogDescription>
            ทำการเปลี่ยนแปลงหมวดหมู่เมนูที่นี่
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='nameTH' className='text-right'>
                หมวดหมู่อาหาร (ภาษาไทย)
              </Label>
              <div className='col-span-3'>
                <Input
                  id='nameTH'
                  name='nameTH'
                  value={editedCategory.nameTH}
                  onChange={handleInputChange}
                  className={errors.nameTH ? 'border-red-500' : ''}
                />
                {errors.nameTH && (
                  <p className='text-sm text-red-500 mt-1'>{errors.nameTH}</p>
                )}
              </div>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='nameEN' className='text-right'>
                หมวดหมู่อาหาร (ภาษาอังกฤษ)
              </Label>
              <div className='col-span-3'>
                <Input
                  id='nameEN'
                  name='nameEN'
                  value={editedCategory.nameEN}
                  onChange={handleInputChange}
                  className={errors.nameEN ? 'border-red-500' : ''}
                />
                {errors.nameEN && (
                  <p className='text-sm text-red-500 mt-1'>{errors.nameEN}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>ยืนยัน</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
