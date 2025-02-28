'use client'

import { useState } from 'react'
import useSWR from 'swr'
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
import { SweetAlert } from '@/components/sweet-alert'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function AddCategoryModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [nameTH, setNameTH] = useState('')
  const [nameEN, setNameEN] = useState('')
  const { mutate } = useSWR<MenuCategory[]>('/api/menu-categories', fetcher)
  const [errors, setErrors] = useState({ nameTH: '', nameEN: '' })
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error',
    message: '',
  })

  const validateForm = () => {
    const newErrors = { nameTH: '', nameEN: '' }
    let isValid = true

    if (!nameTH.trim()) {
      newErrors.nameTH = 'กรุณากรอกชื่อหมวดหมู่ภาษาไทย'
      isValid = false
    }
    if (!nameEN.trim()) {
      newErrors.nameEN = 'กรุณากรอกชื่อหมวดหมู่ภาษาอังกฤษ'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const res = await fetch('/api/menu-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nameTH, nameEN }),
    })

    if (res.ok) {
      const newCategory = await res.json()
      mutate((categories = []) => [...categories, newCategory], false)
      mutate()
      setNameTH('')
      setNameEN('')
      setAlertState({
        isOpen: true,
        type: 'success',
        message: 'เพิ่มหมวดหมู่อาหารสำเร็จ',
      })
    } else {
      setAlertState({
        isOpen: true,
        type: 'error',
        message: 'เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่อาหาร',
      })
    }
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มหมวดหมู่อาหาร</DialogTitle>
            <DialogDescription>สร้างหมวดหมู่เมนูใหม่</DialogDescription>
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
                    value={nameTH}
                    onChange={(e) => setNameTH(e.target.value)}
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
                    value={nameEN}
                    onChange={(e) => setNameEN(e.target.value)}
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
      <SweetAlert
        type={alertState.type}
        message={alertState.message}
        isOpen={alertState.isOpen}
        onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  )
}
