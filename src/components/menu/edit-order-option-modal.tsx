'use client'

import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { OrderOption } from '@/types/order-options'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function EditOrderOptionModal({
  isOpen,
  onClose,
  option,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  option: OrderOption | null
  onSave: (editedOption: OrderOption) => void
}) {
  const [editedOption, setEditedOption] = useState<OrderOption>({
    id: option?.id || 0,
    nameTH: option?.nameTH || '',
    nameEN: option?.nameEN || '',
    type: option?.type || 'single',
    menuItemId: option?.menuItemId || 0,
    choices:
      option?.choices?.filter(
        (choice) => choice.nameTH.trim() || choice.nameEN.trim()
      ) || [],
  })

  const [newChoice, setNewChoice] = useState({ nameTH: '', nameEN: '' })

  useEffect(() => {
    if (option) {
      setEditedOption({
        id: option.id || 0,
        nameTH: option.nameTH || '',
        nameEN: option.nameEN || '',
        type: option.type || 'single',
        menuItemId: option.menuItemId || 0,
        choices:
          option.choices?.filter(
            (choice) => choice.nameTH.trim() || choice.nameEN.trim()
          ) || [],
      })
    }
  }, [option])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedOption((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTypeChange = (value: 'single' | 'multiple') => {
    setEditedOption((prev) => ({ ...prev, type: value }))
  }

  const handleAddChoice = () => {
    if (newChoice.nameTH.trim() || newChoice.nameEN.trim()) {
      setEditedOption((prev) => ({
        ...prev,
        choices: [
          ...prev.choices,
          {
            id: Math.random(),
            nameTH: newChoice.nameTH.trim(),
            nameEN: newChoice.nameEN.trim(),
            orderOptionId: prev.id,
          },
        ],
      }))
      setNewChoice({ nameTH: '', nameEN: '' })
    }
  }

  const handleRemoveChoice = (index: number) => {
    setEditedOption((prev) => ({
      ...prev,
      choices: prev.choices.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(editedOption)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[690px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {editedOption.id ? 'แก้ไขตัวเลือก' : 'เพิ่มตัวเลือกใหม่'}
          </DialogTitle>
          <DialogDescription>
            {editedOption.id
              ? 'แก้ไขรายละเอียดตัวเลือกที่นี่'
              : 'เพิ่มรายละเอียดตัวเลือกใหม่ที่นี่'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid gap-6'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='nameTH' className='text-right'>
                หัวข้อตัวเลือก (ภาษาไทย)
              </Label>
              <Input
                id='nameTH'
                name='nameTH'
                value={editedOption.nameTH}
                onChange={handleInputChange}
                className='col-span-3'
                placeholder='เช่น ระดับความเผ็ด'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='nameEN' className='text-right'>
                หัวข้อตัวเลือก (อังกฤษ)
              </Label>
              <Input
                id='nameEN'
                name='nameEN'
                value={editedOption.nameEN}
                onChange={handleInputChange}
                className='col-span-3'
                placeholder='e.g., Spiciness Level'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right'>ประเภท</Label>
              <RadioGroup
                value={editedOption.type}
                onValueChange={handleTypeChange}
                className='flex col-span-3 space-x-4'
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='single' id='single' />
                  <Label htmlFor='single'>ตัวเลือกเดียว</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='multiple' id='multiple' />
                  <Label htmlFor='multiple'>หลายตัวเลือก</Label>
                </div>
              </RadioGroup>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right'>ตัวเลือก</Label>
              <div className='col-span-3 space-y-3'>
                {editedOption.choices.length > 0 &&
                  editedOption.choices.map((choice, index) => (
                    <div key={choice.id} className='flex items-center gap-2'>
                      <Input
                        value={choice.nameTH}
                        onChange={(e) => {
                          const newChoices = [...editedOption.choices]
                          newChoices[index] = {
                            ...choice,
                            nameTH: e.target.value,
                          }
                          setEditedOption((prev) => ({
                            ...prev,
                            choices: newChoices,
                          }))
                        }}
                        placeholder='ตัวเลือกย่อย (ภาษาไทย)'
                        className='flex-1'
                      />
                      <Input
                        value={choice.nameEN}
                        onChange={(e) => {
                          const newChoices = [...editedOption.choices]
                          newChoices[index] = {
                            ...choice,
                            nameEN: e.target.value,
                          }
                          setEditedOption((prev) => ({
                            ...prev,
                            choices: newChoices,
                          }))
                        }}
                        placeholder='ตัวเลือกย่อย (ภาษาอังกฤษ)'
                        className='flex-1'
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => handleRemoveChoice(index)}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  ))}

                {/* Always show add new row */}
                <div className='flex items-center gap-2'>
                  <Input
                    value={newChoice.nameTH}
                    onChange={(e) =>
                      setNewChoice((prev) => ({
                        ...prev,
                        nameTH: e.target.value,
                      }))
                    }
                    placeholder='ตัวเลือกย่อย (ภาษาไทย)'
                    className='flex-1'
                  />
                  <Input
                    value={newChoice.nameEN}
                    onChange={(e) =>
                      setNewChoice((prev) => ({
                        ...prev,
                        nameEN: e.target.value,
                      }))
                    }
                    placeholder='ตัวเลือกย่อย (ภาษาอังกฤษ)'
                    className='flex-1'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    onClick={handleAddChoice}
                    disabled={
                      !newChoice.nameTH.trim() && !newChoice.nameEN.trim()
                    }
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
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
