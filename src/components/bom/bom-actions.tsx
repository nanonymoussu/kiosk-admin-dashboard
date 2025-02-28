/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle, Plus, Minus } from 'lucide-react'
import { Card } from '@/components/ui/card' // Add this import
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { ScrollArea } from '@/components/ui/scroll-area'

interface Ingredient {
  inventoryId: string
  quantity: string
}

interface IngredientSet {
  id: string
  type: 'menu' | 'option'
  targetId: number
  targetName: string
  ingredients: Ingredient[]
}

export function BOMActions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [menuItems, setMenuItems] = useState([])
  const [inventory, setInventory] = useState([])
  const [selectedMenu, setSelectedMenu] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [ingredientSets, setIngredientSets] = useState<IngredientSet[]>([])
  const [showOptionFormulas, setShowOptionFormulas] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuResponse, inventoryResponse] = await Promise.all([
          fetch('/api/menu-items'),
          fetch('/api/inventory'),
        ])

        if (!menuResponse.ok || !inventoryResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const menuData = await menuResponse.json()
        const inventoryData = await inventoryResponse.json()

        // Filter out menu items that already have BOMs
        const availableMenuItems = menuData.filter((item: any) => !item.bom)

        console.log('Available menu items:', availableMenuItems) // For debugging
        setMenuItems(availableMenuItems)
        setInventory(inventoryData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const handleMenuChange = (menuId: string) => {
    try {
      const menu = menuItems.find((m: any) => m.id.toString() === menuId)
      if (!menu) throw new Error('Menu not found')

      setSelectedMenu(menu)
      // Add menu formula to ingredient sets
      setIngredientSets([
        {
          id: `menu-${menu.id}`,
          type: 'menu',
          targetId: menu.id,
          targetName: menu.nameTH,
          ingredients: [{ inventoryId: '', quantity: '' }],
        },
      ])
    } catch (error) {
      console.error('Error selecting menu:', error)
    }
  }

  const handleOptionChange = (optionId: string) => {
    const option = selectedMenu?.orderOptions.find(
      (o: any) => o.id.toString() === optionId
    )
    setSelectedOption(option)
  }

  const handleChoiceChange = (choiceId: string) => {
    const choice = selectedOption?.choices.find(
      (c: any) => c.id.toString() === choiceId
    )
    if (!choice) return

    // Add option choice formula to ingredient sets
    setIngredientSets((prev) => [
      ...prev,
      {
        id: `choice-${choice.id}`,
        type: 'option',
        targetId: choice.id,
        targetName: `${selectedOption.nameTH} - ${choice.nameTH}`,
        ingredients: [{ inventoryId: '', quantity: '' }],
      },
    ])
  }

  const addIngredient = (setId: string) => {
    setIngredientSets((prev) =>
      prev.map((set) => {
        if (set.id === setId) {
          return {
            ...set,
            ingredients: [
              ...set.ingredients,
              { inventoryId: '', quantity: '' },
            ],
          }
        }
        return set
      })
    )
  }

  const removeIngredient = (setId: string, index: number) => {
    setIngredientSets((prev) =>
      prev.map((set) => {
        if (set.id === setId) {
          return {
            ...set,
            ingredients: set.ingredients.filter((_, i) => i !== index),
          }
        }
        return set
      })
    )
  }

  const handleIngredientChange = (
    setId: string,
    index: number,
    field: string,
    value: string
  ) => {
    setIngredientSets((prev) =>
      prev.map((set) => {
        if (set.id === setId) {
          return {
            ...set,
            ingredients: set.ingredients.map((ing, i) =>
              i === index ? { ...ing, [field]: value } : ing
            ),
          }
        }
        return set
      })
    )
  }

  const validateIngredients = (ingredients: Ingredient[]) => {
    return ingredients.filter(
      (ing) => ing.inventoryId && ing.quantity && parseFloat(ing.quantity) > 0
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Submit only ingredient sets with valid ingredients
      const validSets = ingredientSets.filter(
        (set) => validateIngredients(set.ingredients).length > 0
      )

      if (validSets.length === 0) {
        throw new Error('กรุณาระบุวัตถุดิบอย่างน้อย 1 รายการ')
      }

      await Promise.all(
        validSets.map(async (set) => {
          const formData = {
            type: set.type,
            itemId: set.targetId,
            name: set.targetName,
            ingredients: validateIngredients(set.ingredients),
          }

          const response = await fetch('/api/bom', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          })

          if (!response.ok) {
            throw new Error(`Failed to create BOM for ${set.targetName}`)
          }
        })
      )

      setIsDialogOpen(false)
      setIngredientSets([])
      // Show success message
      setAlertState({
        isOpen: true,
        type: 'success',
        message: 'เพิ่มสูตรอาหารเรียบร้อยแล้ว',
      })
    } catch (error) {
      console.error('Error creating BOMs:', error)
      setAlertState({
        isOpen: true,
        type: 'error',
        message:
          error instanceof Error ? error.message : 'ไม่สามารถเพิ่มสูตรอาหารได้',
      })
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className='mr-2 h-4 w-4' />
          เพิ่มสูตรอาหาร
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[800px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>เพิ่มสูตรอาหาร</DialogTitle>
          <DialogDescription>
            กรุณาเลือกเมนูและกำหนดสูตรสำหรับเมนูและตัวเลือก
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {/* Menu Selection */}
          <div className='space-y-6 py-4'>
            <div className='space-y-4'>
              <Label>เมนู</Label>
              <Select onValueChange={handleMenuChange}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      menuItems.length > 0
                        ? 'เลือกเมนู'
                        : 'ไม่มีเมนูที่สามารถเพิ่มสูตรได้'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {menuItems.length > 0 ? (
                    menuItems.map((item: any) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.nameTH}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value='none' disabled>
                      ไม่มีเมนูที่สามารถเพิ่มสูตรได้
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedMenu && (
              <div className='space-y-6'>
                {/* Menu Formula */}
                <Card className='p-4'>
                  <h3 className='font-medium mb-4'>
                    สูตรสำหรับเมนูหลัก: {selectedMenu.nameTH}
                  </h3>
                  {ingredientSets
                    .find((set) => set.type === 'menu')
                    ?.ingredients.map((_, index) => (
                      <IngredientInput
                        key={index}
                        index={index}
                        setId={`menu-${selectedMenu.id}`}
                        inventory={inventory}
                        onAdd={addIngredient}
                        onRemove={removeIngredient}
                        onChange={handleIngredientChange}
                      />
                    ))}
                </Card>

                {/* Option Formulas */}
                {selectedMenu.orderOptions.length > 0 && (
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <Label>ตัวเลือกเพิ่มเติม</Label>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() =>
                          setShowOptionFormulas(!showOptionFormulas)
                        }
                      >
                        {showOptionFormulas ? 'ซ่อน' : 'แสดง'} สูตรตัวเลือก
                      </Button>
                    </div>

                    {showOptionFormulas && (
                      <div className='space-y-4'>
                        <Select onValueChange={handleOptionChange}>
                          <SelectTrigger>
                            <SelectValue placeholder='เลือกตัวเลือก' />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedMenu.orderOptions.map((option: any) => (
                              <SelectItem
                                key={option.id}
                                value={option.id.toString()}
                              >
                                {option.nameTH}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {selectedOption && (
                          <Select onValueChange={handleChoiceChange}>
                            <SelectTrigger>
                              <SelectValue placeholder='เลือกรายการ' />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedOption.choices.map((choice: any) => (
                                <SelectItem
                                  key={choice.id}
                                  value={choice.id.toString()}
                                >
                                  {choice.nameTH}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {/* Option Choice Formulas */}
                        {ingredientSets
                          .filter((set) => set.type === 'option')
                          .map((set) => (
                            <Card key={set.id} className='p-4'>
                              <h3 className='font-medium mb-4'>
                                สูตรสำหรับ: {set.targetName}
                              </h3>
                              {set.ingredients.map((_, index) => (
                                <IngredientInput
                                  key={index}
                                  index={index}
                                  setId={set.id}
                                  inventory={inventory}
                                  onAdd={addIngredient}
                                  onRemove={removeIngredient}
                                  onChange={handleIngredientChange}
                                />
                              ))}
                            </Card>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type='submit'>บันทึก</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Add this new component for ingredient inputs
function IngredientInput({
  index,
  setId,
  inventory,
  onAdd,
  onRemove,
  onChange,
}: {
  index: number
  setId: string
  inventory: any[]
  onAdd: (setId: string) => void
  onRemove: (setId: string, index: number) => void
  onChange: (setId: string, index: number, field: string, value: string) => void
}) {
  return (
    <div className='grid grid-cols-[1fr,auto] gap-4 items-end mb-4'>
      <div className='grid grid-cols-2 gap-4'>
        <Select
          onValueChange={(value) =>
            onChange(setId, index, 'inventoryId', value)
          }
          required
        >
          <SelectTrigger>
            <SelectValue placeholder='เลือกวัตถุดิบ' />
          </SelectTrigger>
          <SelectContent>
            {inventory.map((item: any) => (
              <SelectItem key={item.id} value={item.id.toString()}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type='number'
          placeholder='จำนวน'
          value={ingredient.quantity || ''}
          onChange={(e) => onChange(setId, index, 'quantity', e.target.value)}
          min='0.01'
          step='0.01'
          required
        />
      </div>
      <div className='flex gap-2'>
        {index === 0 ? (
          <Button
            type='button'
            variant='outline'
            size='icon'
            onClick={() => onAdd(setId)}
          >
            <Plus className='h-4 w-4' />
          </Button>
        ) : (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='text-destructive'
            onClick={() => onRemove(setId, index)}
          >
            <Minus className='h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}
