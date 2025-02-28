'use client'

import type React from 'react'

import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [tempColor, setTempColor] = useState(color)

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempColor(e.target.value)
  }

  const handleConfirm = () => {
    onChange(tempColor)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='w-[220px] justify-start text-left font-normal'
        >
          <div
            className='w-4 h-4 rounded-full mr-2'
            style={{ backgroundColor: color }}
          />
          {color}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[220px]'>
        <div className='flex flex-col space-y-2'>
          <div className='flex-1 space-y-2'>
            <div
              className='w-full h-40'
              style={{ backgroundColor: tempColor }}
            />
            <Input
              type='color'
              value={tempColor}
              onChange={handleColorChange}
              className='w-full'
            />
          </div>
          <Button onClick={handleConfirm}>Confirm</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
