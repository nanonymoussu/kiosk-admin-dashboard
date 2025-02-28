'use client'

import { useState } from 'react'
import Image from 'next/image'
import useSWR from 'swr'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { EditMenuItemModal } from '@/components/menu/edit-menu-item-modal'
import { EditOrderOptionModal } from '@/components/menu/edit-order-option-modal'
import { SweetAlert } from '@/components/sweet-alert'
import { useRole } from '@/contexts/RoleContext'
import { MenuItem } from '@/types/menu-item'
import { OrderOption } from '@/types/order-options'
import type { EditItemData } from '@/components/menu/edit-menu-item-modal'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function MenuList({
  onAction,
}: {
  onAction: (type: 'success' | 'error' | 'warning', message: string) => void
}) {
  const { data: menuItems, error, mutate } = useSWR('/api/menu-items', fetcher)

  const [editingItem, setEditingItem] = useState<EditItemData | null>(null)
  const [editingOption, setEditingOption] = useState<{
    menuItem: MenuItem
    option: OrderOption | null
  } | null>(null)
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'warning',
    message: '',
  })
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'item' | 'option'
    itemId: number
    optionId?: number
  } | null>(null)
  const { role } = useRole()
  const [expandedOptions, setExpandedOptions] = useState<
    Record<string, boolean>
  >({})

  if (error) {
    console.error('Error loading menu items:', error)
    return <div>ไม่สามารถโหลดข้อมูลรายการเมนูอาหารได้</div>
  }

  if (!menuItems) {
    return <div>กำลังโหลดข้อมูล...</div>
  }

  if (menuItems.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <p className='text-xl text-muted-foreground mb-2'>
          ไม่พบรายการเมนูอาหาร
        </p>
        <p className='text-sm text-muted-foreground'>กรุณาเพิ่มเมนูอาหารใหม่</p>
      </div>
    )
  }

  const handleEdit = (item: MenuItem) => {
    if (role === 'admin') {
      const transformedOrderOptions =
        item.orderOptions?.map((option) => ({
          id: option.id,
          nameTH: option.nameTH,
          nameEN: option.nameEN,
          type: option.type || 'single',
          choices:
            option.choices?.map((choice) => ({
              nameTH: choice.nameTH || '',
              nameEN: choice.nameEN || '',
            })) || [],
        })) || []

      setEditingItem({
        id: item.id,
        nameTH: item.nameTH || '',
        nameEN: item.nameEN || '',
        category: item.menuCategoryId?.toString() || '',
        price: item.price.toString(),
        image: item.image || '',
        orderOptions: transformedOrderOptions,
        menuCategoryId: item.menuCategoryId,
      } as EditItemData)
    } else {
      onAction('error', 'คุณไม่มีสิทธิ์ในการแก้ไขเมนูอาหาร')
    }
  }

  const handleEditOptions = (item: MenuItem, option?: OrderOption) => {
    if (role === 'admin') {
      setEditingOption({
        menuItem: item,
        option: option || {
          id: 0,
          nameTH: '',
          nameEN: '',
          type: 'single',
          choices: [{ id: 0, orderOptionId: 0, nameTH: '', nameEN: '' }],
          menuItemId: item.id,
        },
      })
    } else {
      onAction('error', 'คุณไม่มีสิทธิ์ในการแก้ไขตัวเลือกเมนู')
    }
  }

  const handleSave = async (editedItem: MenuItem) => {
    const res = await fetch(`/api/menu-items/${editedItem.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedItem),
    })
    if (res.ok) {
      mutate()
      onAction('success', 'แก้ไขเมนูอาหารเรียบร้อยแล้ว')
    } else {
      onAction('error', 'เกิดข้อผิดพลาดในการแก้ไขเมนูอาหาร')
    }
    setEditingItem(null)
  }

  const handleSaveOption = async (editedOption: OrderOption) => {
    if (!editingOption?.menuItem) return

    try {
      const endpoint = editedOption.id
        ? `/api/menu-items/${editingOption.menuItem.id}/order-options/${editedOption.id}`
        : `/api/menu-items/${editingOption.menuItem.id}/order-options`

      const method = editedOption.id ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nameTH: editedOption.nameTH,
          nameEN: editedOption.nameEN,
          type: editedOption.type,
          choices: editedOption.choices.map((choice) => ({
            nameTH: choice.nameTH || '',
            nameEN: choice.nameEN || '',
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save option')
      }

      await mutate()
      onAction(
        'success',
        editedOption.id
          ? 'แก้ไขตัวเลือกเรียบร้อยแล้ว'
          : 'เพิ่มตัวเลือกเรียบร้อยแล้ว'
      )
      setEditingOption(null)
    } catch (error) {
      console.error('Error saving option:', error)
      onAction('error', 'เกิดข้อผิดพลาดในการบันทึกตัวเลือก')
    }
  }

  const handleDelete = async (itemId: number) => {
    if (role !== 'admin') {
      onAction('error', 'คุณไม่มีสิทธิ์ในการลบเมนูอาหาร')
      return
    }

    try {
      const res = await fetch(`/api/menu-items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error('Failed to delete menu item')
      }

      // Refresh the menu items list
      await mutate()
      onAction('success', 'ลบเมนูอาหารเรียบร้อยแล้ว')
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting menu item:', error)
      onAction('error', 'เกิดข้อผิดพลาดในการลบเมนูอาหาร')
    }
  }

  const handleDeleteOption = async (itemId: number, optionId: number) => {
    if (role !== 'admin') {
      onAction('error', 'คุณไม่มีสิทธิ์ในการลบตัวเลือก')
      return
    }

    try {
      const res = await fetch(
        `/api/menu-items/${itemId}/order-options/${optionId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!res.ok) {
        throw new Error('Failed to delete option')
      }

      // Refresh the menu items list
      await mutate()
      onAction('success', 'ลบตัวเลือกเรียบร้อยแล้ว')
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting option:', error)
      onAction('error', 'เกิดข้อผิดพลาดในการลบตัวเลือก')
    }
  }

  const quickAddOption = (item: MenuItem) => {
    if (role !== 'admin') {
      onAction('error', 'คุณไม่มีสิทธิ์ในการเพิ่มตัวเลือก')
      return
    }
    setEditingOption({
      menuItem: item,
      option: {
        id: 0,
        nameTH: '',
        nameEN: '',
        type: 'single',
        choices: [{ id: 0, orderOptionId: 0, nameTH: '', nameEN: '' }],
        menuItemId: item.id,
      },
    })
  }

  const toggleOption = (itemId: number, optionId: number) => {
    const key = `${itemId}-${optionId}`
    setExpandedOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const confirmDelete = async () => {
    try {
      if (deleteConfirm?.type === 'item') {
        await handleDelete(deleteConfirm.itemId)
      } else if (deleteConfirm?.type === 'option' && deleteConfirm.optionId) {
        await handleDeleteOption(deleteConfirm.itemId, deleteConfirm.optionId)
      }
    } catch (error) {
      console.error('Error in delete operation:', error)
    }
  }

  return (
    <>
      <div className='flex flex-col gap-4'>
        {menuItems?.map((item: MenuItem) => (
          <Card key={item.id} className='p-4'>
            <div className='flex justify-between'>
              <div className='flex items-center gap-4'>
                <div className='relative w-32 h-32'>
                  <Image
                    src={item.image || '/placeholder.png'}
                    alt={item.nameTH}
                    fill
                    className='object-cover rounded-md'
                  />
                </div>
                <div className='flex-1'>
                  <h3 className='text-xl font-semibold'>{item.nameTH}</h3>
                  <p className='text-sm text-muted-foreground'>{item.nameEN}</p>
                  <p className='text-lg font-medium mt-1'>{item.price} บาท</p>
                  {item.menuCategory && (
                    <p className='text-sm text-muted-foreground mt-1'>
                      หมวดหมู่: {item.menuCategory.nameTH}
                    </p>
                  )}
                </div>
              </div>

              {/* Move admin actions to the right */}
              {role === 'admin' && (
                <div className='flex gap-2'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => {
                      setDeleteConfirm({
                        type: 'item',
                        itemId: item.id,
                      })
                    }}
                    className='text-destructive'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              )}
            </div>

            {/* Show options in an expandable dropdown */}
            <div className='mt-4 pt-4 border-t'>
              <div className='flex justify-between items-center mb-2'>
                <h4 className='text-sm font-medium'>ตัวเลือกที่มี</h4>
                {role === 'admin' && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => quickAddOption(item)}
                    className='flex items-center gap-1'
                  >
                    <Plus className='h-4 w-4' />
                    เพิ่มตัวเลือก
                  </Button>
                )}
              </div>
              <div className='space-y-2'>
                {item.orderOptions?.map(
                  (option: {
                    id: number
                    nameTH: string
                    nameEN: string
                    type: string
                    choices: Array<{ nameTH: string; nameEN: string }>
                  }) => (
                    <div key={option.id} className='border rounded-lg'>
                      <button
                        className='w-full px-4 py-2 flex justify-between items-center hover:bg-muted/50 rounded-lg'
                        onClick={() => toggleOption(item.id, option.id)}
                      >
                        <span className='font-medium'>
                          {option?.nameTH || option?.nameEN || 'ไม่มีชื่อ'}
                        </span>
                        {expandedOptions[`${item.id}-${option.id}`] ? (
                          <ChevronUp className='h-4 w-4' />
                        ) : (
                          <ChevronDown className='h-4 w-4' />
                        )}
                      </button>
                      {expandedOptions[`${item.id}-${option.id}`] && (
                        <div className='px-4 pb-2 space-y-2'>
                          <div className='flex justify-between items-center text-sm text-muted-foreground'>
                            <span>
                              ประเภท:{' '}
                              {option.type === 'single'
                                ? 'เลือกได้หนึ่งตัวเลือก'
                                : 'เลือกได้หลายตัวเลือก'}
                            </span>
                            {role === 'admin' && (
                              <div className='flex gap-2'>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditOptions(
                                      item,
                                      option as OrderOption
                                    )
                                  }}
                                >
                                  <Pencil className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setDeleteConfirm({
                                      type: 'option',
                                      itemId: item.id,
                                      optionId: option.id,
                                    })
                                  }}
                                  className='text-destructive'
                                >
                                  <Trash2 className='h-4 w-4' />
                                </Button>
                              </div>
                            )}
                          </div>
                          <div className='space-y-1'>
                            {option.choices?.map(
                              (
                                choice: { nameTH: string; nameEN: string },
                                idx: number
                              ) => (
                                <div
                                  key={idx}
                                  className='text-sm pl-4 py-1 border-l-2 border-muted'
                                >
                                  {choice?.nameTH || ''}{' '}
                                  {choice?.nameEN ? `(${choice.nameEN})` : ''}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
                {(!item.orderOptions || item.orderOptions.length === 0) && (
                  <p className='text-sm text-muted-foreground'>ไม่มีตัวเลือก</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      {editingItem && (
        <EditMenuItemModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          item={editingItem}
          onSave={handleSave}
        />
      )}
      {editingOption && (
        <EditOrderOptionModal
          isOpen={!!editingOption}
          onClose={() => setEditingOption(null)}
          option={editingOption.option}
          onSave={handleSaveOption}
        />
      )}
      <SweetAlert
        type={alertState.type}
        message={alertState.message}
        isOpen={alertState.isOpen}
        onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
      />
      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirm?.type === 'item'
                ? 'การดำเนินการนี้จะลบเมนูอาหารและตัวเลือกทั้งหมดอย่างถาวร'
                : 'การดำเนินการนี้จะลบตัวเลือกนี้อย่างถาวร'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className='bg-destructive text-destructive-foreground'
            >
              ลบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
