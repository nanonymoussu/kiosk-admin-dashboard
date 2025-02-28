'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TrendingUp } from 'lucide-react'
import Image from 'next/image'

const trendingItems = [
  {
    name: 'Spicy Ramen',
    category: 'Main Course',
    growth: '+15%',
    image: '/placeholder.svg?height=40&width=40',
  },
  {
    name: 'Avocado Toast',
    category: 'Breakfast',
    growth: '+12%',
    image: '/placeholder.svg?height=40&width=40',
  },
  {
    name: 'Matcha Latte',
    category: 'Beverages',
    growth: '+10%',
    image: '/placeholder.svg?height=40&width=40',
  },
  {
    name: 'Poke Bowl',
    category: 'Main Course',
    growth: '+8%',
    image: '/placeholder.svg?height=40&width=40',
  },
  {
    name: 'Truffle Fries',
    category: 'Sides',
    growth: '+7%',
    image: '/placeholder.svg?height=40&width=40',
  },
]

export function TrendingMenu() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Growth</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trendingItems.map((item) => (
          <TableRow key={item.name}>
            <TableCell>
              <Image
                src={item.image || '/placeholder.svg'}
                alt={item.name}
                width={40}
                height={40}
                className='rounded-full'
              />
            </TableCell>
            <TableCell className='font-medium'>{item.name}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell className='text-green-600'>
              <span className='flex items-center'>
                <TrendingUp className='w-4 h-4 mr-1' />
                {item.growth}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
