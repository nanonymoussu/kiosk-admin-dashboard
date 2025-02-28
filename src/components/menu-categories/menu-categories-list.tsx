'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { MenuCategory } from '@/types/menu-category'
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
import { Pencil, Trash2 } from 'lucide-react'
import { EditMenuCategoryModal } from '@/components/menu-categories/edit-menu-category-modal'
import { SweetAlert } from '@/components/sweet-alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function MenuCategoriesList() {
  const {
    data: categories,
    error,
    mutate,
  } = useSWR<MenuCategory[]>('/api/menu-categories', fetcher)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(
    null
  )
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'warning',
    message: '',
  })
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean
    categoryId: number | null
  }>({
    isOpen: false,
    categoryId: null,
  })

  const handleEdit = (category: MenuCategory) => {
    setEditingCategory(category)
  }

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/menu-categories/${id}`, { method: 'DELETE' })
    if (res.ok) {
      mutate(
        (prevCategories) =>
          prevCategories?.filter((category) => category.id !== id) ?? []
      )
      setAlertState({
        isOpen: true,
        type: 'success',
        message: 'ทำการลบหมวดหมู่อาหารสำเร็จ',
      })
    } else {
      setAlertState({
        isOpen: true,
        type: 'error',
        message: 'เกิดข้อผิดพลาดในการลบหมวดหมู่อาหาร',
      })
    }
    setDeleteConfirm({ isOpen: false, categoryId: null })
  }

  const handleSave = async (editedCategory: MenuCategory) => {
    const res = await fetch(`/api/menu-categories/${editedCategory.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedCategory),
    })
    if (res.ok) {
      mutate()
      setAlertState({
        isOpen: true,
        type: 'success',
        message: 'ทำการแก้ไขหมวดหมู่อาหารสำเร็จ',
      })
    } else {
      setAlertState({
        isOpen: true,
        type: 'error',
        message: 'เกิดข้อผิดพลาดในการแก้ไขหมวดหมู่อาหาร',
      })
    }
    setEditingCategory(null)
  }

  if (error) return <div>Failed to load menu categories</div>
  if (!categories) return <div>Loading...</div>

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>หมวดหมู่อาหาร (ภาษาไทย)</TableHead>
              <TableHead>หมวดหมู่อาหาร (ภาษาอังกฤษ)</TableHead>
              <TableHead className='text-right'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className='font-medium'>{category.nameTH}</TableCell>
                <TableCell className='font-medium'>{category.nameEN}</TableCell>
                <TableCell className='text-right'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleEdit(category)}
                  >
                    <Pencil className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() =>
                      setDeleteConfirm({
                        isOpen: true,
                        categoryId: category.id,
                      })
                    }
                  >
                    <Trash2 className='h-4 w-4 text-red-500' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {editingCategory && (
        <EditMenuCategoryModal
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          category={editingCategory}
          onSave={handleSave}
        />
      )}
      <Dialog
        open={deleteConfirm.isOpen}
        onOpenChange={() =>
          setDeleteConfirm({ isOpen: false, categoryId: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบหมวดหมู่อาหาร</DialogTitle>
            <DialogDescription>
              คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่อาหารนี้?
              การกระทำนี้ไม่สามารถยกเลิกได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() =>
                setDeleteConfirm({ isOpen: false, categoryId: null })
              }
            >
              ยกเลิก
            </Button>
            <Button
              variant='destructive'
              onClick={() =>
                deleteConfirm.categoryId &&
                handleDelete(deleteConfirm.categoryId)
              }
            >
              ลบ
            </Button>
          </DialogFooter>
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
