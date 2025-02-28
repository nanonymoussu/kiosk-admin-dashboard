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

type BestSellerItem = {
  menuName: string
  category: string
  totalSales: number
  imageUrl?: string
}

export function BestSellerMenu() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bestSellers, setBestSellers] = useState<BestSellerItem[]>([])

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('/api/best-sellers?limit=5')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setBestSellers(data)
      } catch (error) {
        console.error('Failed to fetch best sellers:', error)
        setError(error instanceof Error ? error.message : 'An error occurred')
        setBestSellers([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchBestSellers()
  }, [])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-[350px]'>
        <p className='text-muted-foreground'>กำลังโหลด...</p>
      </div>
    )
  }

  if (error) {
    console.log('Error state:', error)
  }

  if (!bestSellers.length) {
    return (
      <div className='flex items-center justify-center h-[350px]'>
        <p className='text-muted-foreground'>ไม่พบข้อมูล</p>
      </div>
    )
  }

  return (
    <div className='h-full w-full'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='min-w-[100px]'>เมนูอาหาร</TableHead>
            <TableHead className='min-w-[100px]'>หมวดหมู่</TableHead>
            <TableHead className='w-[100px] text-right'>ยอดขาย</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bestSellers.map((item) => (
            <TableRow key={item.menuName}>
              <TableCell>{item.menuName}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className='text-right'>{item.totalSales}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
