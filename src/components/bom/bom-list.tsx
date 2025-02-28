/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { EditBOMModal } from '@/components/bom/edit-bom-modal'
import { SweetAlert } from '@/components/sweet-alert'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

type BOMItem = {
  id: number
  name: string
  menuItem: {
    id: number
    nameTH: string
    nameEN: string
    orderOptions: {
      id: number
      nameTH: string
      nameEN: string
      choices: {
        id: number
        nameTH: string
        nameEN: string
      }[]
    }[]
  }
  ingredients: {
    id: number
    quantity: number
    inventory: {
      id: number
      name: string
      unit: string
    }
  }[]
}

export function BOMList() {
  const [boms, setBoms] = useState<BOMItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedItems, setExpandedItems] = useState<number[]>([])
  const [editingItem, setEditingItem] = useState<BOMItem | null>(null)
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'warning',
    message: '',
  })
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    bomId: number | null
  }>({ isOpen: false, bomId: null })

  const fetchBOMs = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/bom')
      if (!response.ok) throw new Error('Failed to fetch BOMs')
      const data = await response.json()
      setBoms(data)
    } catch (error) {
      console.error('Error fetching BOMs:', error)
      setAlertState({
        isOpen: true,
        type: 'error',
        message: 'ไม่สามารถดึงข้อมูลสูตรอาหารได้',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBOMs()
  }, [])

  const toggleExpand = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleEdit = (item: any) => {
    if (!item) return
    setEditingItem(item)
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/bom/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete BOM')

      await fetchBOMs()
      setAlertState({
        isOpen: true,
        type: 'success',
        message: 'ลบสูตรอาหารเรียบร้อยแล้ว',
      })
    } catch (error) {
      console.error('Error deleting BOM:', error)
      setAlertState({
        isOpen: true,
        type: 'error',
        message: 'ไม่สามารถลบสูตรอาหารได้',
      })
    }
  }

  const confirmDelete = (id: number) => {
    setDeleteConfirmation({
      isOpen: true,
      bomId: id,
    })
  }

  const handleConfirmDelete = () => {
    if (deleteConfirmation.bomId) {
      handleDelete(deleteConfirmation.bomId)
    }
    setDeleteConfirmation({ isOpen: false, bomId: null })
  }

  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, bomId: null })
  }

  const handleSave = async (editedItem: any) => {
    try {
      const response = await fetch(`/api/bom/${editedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedItem),
      })

      if (!response.ok) throw new Error('Failed to update BOM')

      await fetchBOMs()
      setEditingItem(null)
      setAlertState({
        isOpen: true,
        type: 'success',
        message: 'แก้ไขสูตรอาหารเรียบร้อยแล้ว',
      })
    } catch (error) {
      console.error('Error updating BOM:', error)
      setAlertState({
        isOpen: true,
        type: 'error',
        message: 'ไม่สามารถแก้ไขสูตรอาหารได้',
      })
    }
  }

  const groupBomsByMenuItem = (boms: BOMItem[]) => {
    return boms.reduce((acc, bom) => {
      if (bom.menuItem) {
        const menuId = bom.menuItem.id
        if (!acc[menuId]) {
          acc[menuId] = {
            menuItem: bom.menuItem,
            mainBom: null,
            optionBoms: [],
          }
        }
        acc[menuId].mainBom = bom
      } else if (bom.optionChoice?.orderOption?.menuItem) {
        const menuId = bom.optionChoice.orderOption.menuItem.id
        if (!acc[menuId]) {
          acc[menuId] = {
            menuItem: bom.optionChoice.orderOption.menuItem,
            mainBom: null,
            optionBoms: [],
          }
        }
        acc[menuId].optionBoms.push(bom)
      }
      return acc
    }, {} as Record<number, any>)
  }

  const validBomGroups = Object.values(groupBomsByMenuItem(boms)).filter(
    (group) => group.menuItem && (group.mainBom || group.optionBoms.length > 0)
  )

  return (
    <>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {isLoading ? (
          <Card className='p-6'>
            <div className='text-center'>กำลังโหลดข้อมูล...</div>
          </Card>
        ) : validBomGroups.length === 0 ? (
          <Card className='p-6'>
            <div className='text-center'>ไม่พบข้อมูลสูตรอาหาร</div>
          </Card>
        ) : (
          validBomGroups.map((group: any) => (
            <Card key={group.menuItem.id} className='overflow-hidden'>
              <div className='p-4 border-b bg-muted/50'>
                <div className='flex items-center justify-between mb-2'>
                  <h3 className='font-semibold text-lg'>
                    {group.menuItem.nameTH}
                  </h3>
                  <div className='flex gap-2'>
                    {group.mainBom && (
                      <>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleEdit(group.mainBom)}
                          title='แก้ไขสูตรหลัก'
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => confirmDelete(group.mainBom.id)}
                          title='ลบสูตรหลัก'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Accordion type='single' collapsible>
                {/* Main Menu BOM */}
                <AccordionItem value='main'>
                  <AccordionTrigger className='px-4'>
                    วัตถุดิบหลัก ({group.mainBom?.ingredients.length || 0}{' '}
                    รายการ)
                  </AccordionTrigger>
                  <AccordionContent className='px-4'>
                    {group.mainBom?.ingredients.map((ingredient: any) => (
                      <div
                        key={ingredient.id}
                        className='py-2 flex justify-between items-center border-b last:border-0'
                      >
                        <span>{ingredient.inventory.name}</span>
                        <span className='text-muted-foreground'>
                          {ingredient.quantity} {ingredient.inventory.unit}
                        </span>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                {/* Option BOMs */}
                {group.optionBoms.length > 0 && (
                  <AccordionItem value='options'>
                    <AccordionTrigger className='px-4'>
                      ตัวเลือกเพิ่มเติม ({group.optionBoms.length} รายการ)
                    </AccordionTrigger>
                    <AccordionContent>
                      {group.optionBoms.map((optionBom: any) => (
                        <div key={optionBom.id} className='border-t'>
                          <div className='px-4 py-2 bg-muted/30 flex justify-between items-center'>
                            <span className='font-medium'>
                              {optionBom.optionChoice.orderOption.nameTH} -{' '}
                              {optionBom.optionChoice.nameTH}
                            </span>
                            <div className='flex gap-1'>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handleEdit(optionBom)}
                                title='แก้ไข'
                              >
                                <Pencil className='h-3 w-3' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => confirmDelete(optionBom.id)}
                                title='ลบ'
                              >
                                <Trash2 className='h-3 w-3' />
                              </Button>
                            </div>
                          </div>
                          <div className='px-4'>
                            {optionBom.ingredients.map((ingredient: any) => (
                              <div
                                key={ingredient.id}
                                className='py-2 flex justify-between items-center border-b last:border-0'
                              >
                                <span>{ingredient.inventory.name}</span>
                                <span className='text-muted-foreground'>
                                  {ingredient.quantity}{' '}
                                  {ingredient.inventory.unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </Card>
          ))
        )}
      </div>
      {editingItem && (
        <EditBOMModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          bom={editingItem}
          onSave={handleSave}
        />
      )}
      <SweetAlert
        type={alertState.type}
        message={alertState.message}
        isOpen={alertState.isOpen}
        onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
      />
      <SweetAlert
        type='warning'
        message='ต้องการลบสูตรอาหารนี้ใช่หรือไม่?'
        isOpen={deleteConfirmation.isOpen}
        onClose={handleCancelDelete}
        showConfirmButton={true}
        confirmText='ลบสูตร'
        onConfirm={handleConfirmDelete}
        showCancelButton={true}
        cancelText='ยกเลิก'
      />
    </>
  )
}
