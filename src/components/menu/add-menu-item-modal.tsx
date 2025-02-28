'use client'

import { useState } from 'react'
import Image from 'next/image' // Add this import
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

export function AddMenuItemModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean
  onClose: () => void
  onAdd: (newItem: MenuItem) => Promise<void>
}) {
  const [name, setName] = useState({ en: '', th: '' })
  const [categoryId, setCategoryId] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')

  const { data: categories, error } = useSWR('/api/menu-categories', fetcher)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.th || !name.en || !categoryId || !price) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    try {
      const formData = {
        nameTH: name.th,
        nameEN: name.en,
        price: parseFloat(price),
        image:
          image ||
          'https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg',
        menuCategoryId: parseInt(categoryId),
      }
      console.log('Submitting new menu item:', formData)
      await onAdd({
        ...formData,
        id: 0,
        orderOptions: [],
      })
      onClose()
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('เกิดข้อผิดพลาดในการเพิ่มเมนูอาหาร')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>เพิ่มเมนูอาหารใหม่</DialogTitle>
          <DialogDescription>
            กรอกรายละเอียดสำหรับเมนูอาหารใหม่
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
                value={name.th}
                onChange={(e) => setName({ ...name, th: e.target.value })}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='nameEN' className='text-right'>
                ชื่อเมนูอาหาร (ภาษาอังกฤษ)
              </Label>
              <Input
                id='nameEN'
                value={name.en}
                onChange={(e) => setName({ ...name, en: e.target.value })}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='category' className='text-right'>
                หมวดหมู่อาหาร
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className='col-span-3'
                type='number'
                step='1'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right'>รูปภาพ URL</Label>
              <div className='col-span-3'>
                <Input
                  type='url'
                  placeholder='https://example.com/image.jpg'
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
                {image && (
                  <div className='mt-2 relative w-32 h-32'>
                    <Image
                      src={image}
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
