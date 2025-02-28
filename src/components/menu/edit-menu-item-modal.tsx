'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MenuItem } from '@/types/menu-item'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export interface EditItemData {
  id: number
  nameTH: string
  nameEN: string
  category: string
  price: string
  image: string
  menuCategoryId?: number
  orderOptions?: Array<{
    id: number
    nameTH: string
    nameEN: string
    type: string
    choices: Array<{ nameTH: string; nameEN: string }>
  }>
}

export function EditMenuItemModal({
  isOpen,
  onClose,
  item,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  item: EditItemData
  onSave: (editedItem: MenuItem) => void
}) {
  const [editedItem, setEditedItem] = useState<EditItemData>({
    ...item,
  })

  useEffect(() => {
    setEditedItem({
      ...item,
      category: item.menuCategoryId?.toString() || item.category,
    })
  }, [item])

  const { data: categories, error } = useSWR('/api/menu-categories', fetcher)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'nameTH' || name === 'nameEN') {
      setEditedItem((prev) => ({
        ...prev,
        [name]: value,
      }))
    } else {
      setEditedItem((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const transformedItem: MenuItem = {
      id: item.id,
      nameTH: editedItem.nameTH,
      nameEN: editedItem.nameEN,
      menuCategoryId: parseInt(editedItem.category),
      price: parseFloat(editedItem.price),
      image: editedItem.image,
      orderOptions:
        item.orderOptions?.map((option) => ({
          ...option,
          type: option.type as 'single' | 'multiple',
        })) || [],
    }

    onSave(transformedItem)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>แก้ไขรายละเอียดเมนูอาหาร</DialogTitle>
          <DialogDescription>
            กรอกรายละเอียดสำหรับเมนูอาหารที่ต้องการแก้ไข
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='nameTH' className='text-right'>
                ชื่อเมนูอาหาร (ภาษาไทย)
              </Label>
              <Input
                id='nameTH'
                name='nameTH'
                value={editedItem.nameTH}
                onChange={handleInputChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='nameEN' className='text-right'>
                ชื่อเมนูอาหาร (ภาษาอังกฤษ)
              </Label>
              <Input
                id='nameEN'
                name='nameEN'
                value={editedItem.nameEN}
                onChange={handleInputChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='category' className='text-right'>
                หมวดหมู่อาหาร
              </Label>
              <Select
                value={editedItem.category.toString()}
                onValueChange={(value) =>
                  setEditedItem((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='กรุณาเลือกหมวดหมู่อาหาร' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories ? (
                      categories.map(
                        (category: {
                          id: number
                          nameTH: string
                          nameEN: string
                        }) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.nameTH}
                          </SelectItem>
                        )
                      )
                    ) : error ? (
                      <SelectItem value=''>เกิดข้อผิดพลาด</SelectItem>
                    ) : null}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='price' className='text-right'>
                ราคา
              </Label>
              <Input
                id='price'
                name='price'
                value={editedItem.price}
                onChange={handleInputChange}
                className='col-span-3'
                type='number'
                step='1'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='image' className='text-right'>
                รูปภาพ URL
              </Label>
              <div className='col-span-3'>
                <Input
                  type='url'
                  placeholder='https://example.com/image.jpg'
                  value={editedItem.image}
                  onChange={(e) =>
                    setEditedItem((prev) => ({
                      ...prev,
                      image: e.target.value,
                    }))
                  }
                />
                {editedItem.image && (
                  <div className='mt-2 relative w-32 h-32'>
                    <Image
                      src={editedItem.image}
                      alt='Preview'
                      fill
                      className='object-cover rounded'
                    />
                  </div>
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
