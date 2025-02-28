'use client'

import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function SalesFilters() {
  const [date, setDate] = useState<Date>()

  return (
    <div className='flex items-center gap-4'>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={`w-[240px] justify-start text-left font-normal ${
              !date && 'text-muted-foreground'
            }`}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date ? format(date, 'PPP') : 'กรุณาเลือกวันที่'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
