/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Minus } from 'lucide-react'
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Ingredient {
  id?: number
  inventoryId: string | number
  quantity: number
  inventory?: {
    id: number
    name: string
    unit: string
  }
}

interface EditBOMModalProps {
  isOpen: boolean
  onClose: () => void
  bom: any
  onSave: (editedBom: any) => void
}

export function EditBOMModal({
  isOpen,
  onClose,
  bom,
  onSave,
}: EditBOMModalProps) {
  const [inventory, setInventory] = useState<any[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchInventory()
      // Convert the BOM ingredients to the format we need
      const formattedIngredients = bom.ingredients.map((ing: any) => ({
        id: ing.id,
        inventoryId: ing.inventoryId.toString(),
        quantity: ing.quantity,
        inventory: ing.inventory,
      }))
      setIngredients(formattedIngredients)
    }
  }, [isOpen, bom])

  const fetchInventory = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/inventory')
      if (!response.ok) throw new Error('Failed to fetch inventory')
      const data = await response.json()
      setInventory(data)
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleIngredientChange = (index: number, field: string, value: any) => {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    )
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { inventoryId: '', quantity: 0 }])
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const editedBom = {
      ...bom,
      ingredients: ingredients,
    }
    onSave(editedBom)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>แก้ไขสูตรอาหาร</DialogTitle>
          <DialogDescription>
            {bom.menuItem
              ? `แก้ไขสูตรอาหารของ ${bom.menuItem.nameTH}`
              : `แก้ไขสูตรอาหารของตัวเลือก ${bom.name}`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='space-y-4 py-4'>
            <div className='space-y-4'>
              {ingredients.map((ingredient, index) => (
                <div key={index} className='grid gap-4'>
                  <div className='flex items-center justify-between'>
                    <Label className='font-medium'>
                      วัตถุดิบที่ {index + 1}
                    </Label>
                    {ingredients.length > 1 && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => removeIngredient(index)}
                        className='text-destructive'
                      >
                        <Minus className='h-4 w-4 mr-1' />
                        ลบ
                      </Button>
                    )}
                  </div>
                  <div className='grid grid-cols-[2fr,1fr] gap-4'>
                    <Select
                      value={ingredient.inventoryId.toString()}
                      onValueChange={(value) =>
                        handleIngredientChange(index, 'inventoryId', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder='เลือกวัตถุดิบ'
                          defaultValue={ingredient.inventoryId.toString()}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {inventory.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type='number'
                      value={ingredient.quantity}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          'quantity',
                          parseFloat(e.target.value)
                        )
                      }
                      min={0.01}
                      step={0.01}
                      placeholder='จำนวน'
                    />
                  </div>
                </div>
              ))}

              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={addIngredient}
                className='w-full'
              >
                <Plus className='h-4 w-4 mr-1' />
                เพิ่มวัตถุดิบ
              </Button>
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
