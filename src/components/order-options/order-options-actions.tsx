'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
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

export function OrderOptionsActions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newOption, setNewOption] = useState({
    name: '',
    type: '',
    choices: [''],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewOption((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setNewOption((prev) => ({ ...prev, type: value }))
  }

  const handleChoiceChange = (index: number, value: string) => {
    setNewOption((prev) => ({
      ...prev,
      choices: prev.choices.map((choice, i) => (i === index ? value : choice)),
    }))
  }

  const addChoice = () => {
    setNewOption((prev) => ({ ...prev, choices: [...prev.choices, ''] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('New Order Option:', newOption)
    setIsDialogOpen(false)
    setNewOption({ name: '', type: '', choices: [''] })
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className='mr-2 h-4 w-4' />
          Add Order Option
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add New Order Option</DialogTitle>
          <DialogDescription>
            Enter the details of the new order option here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input
                id='name'
                name='name'
                value={newOption.name}
                onChange={handleInputChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='type' className='text-right'>
                Type
              </Label>
              <Select onValueChange={handleTypeChange}>
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='spicy'>Spicy</SelectItem>
                  <SelectItem value='vegetable'>Vegetable</SelectItem>
                  <SelectItem value='meat'>Meat</SelectItem>
                  <SelectItem value='size'>Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newOption.choices.map((choice, index) => (
              <div key={index} className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor={`choice-${index}`} className='text-right'>
                  Choice {index + 1}
                </Label>
                <Input
                  id={`choice-${index}`}
                  value={choice}
                  onChange={(e) => handleChoiceChange(index, e.target.value)}
                  className='col-span-3'
                />
              </div>
            ))}
            <Button type='button' variant='outline' onClick={addChoice}>
              Add Choice
            </Button>
          </div>
          <DialogFooter>
            <Button type='submit'>Add Order Option</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
