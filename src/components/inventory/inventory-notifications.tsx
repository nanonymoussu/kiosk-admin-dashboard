'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { InventoryItem } from './inventory-list'

export function InventoryNotifications() {
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/inventory')
        if (!response.ok) throw new Error('Failed to fetch inventory')
        const data = await response.json()
        const lowStock = data.filter(
          (item: InventoryItem) => item.quantity <= item.reorderPoint
        )
        setLowStockItems(lowStock)
      } catch (error) {
        console.error('Error fetching inventory:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInventory()
  }, [])

  if (isLoading) {
    return <div className='p-6'>กำลังโหลดข้อมูล...</div>
  }

  if (lowStockItems.length === 0) {
    return (
      <div className='p-6 text-center text-muted-foreground'>
        ไม่มีวัตถุดิบที่ต้องสั่งซื้อเพิ่ม
      </div>
    )
  }

  return (
    <div className='p-6'>
      <div className='space-y-4'>
        <div className='flex items-center gap-2 text-yellow-600'>
          <AlertTriangle className='h-5 w-5' />
          <h3 className='font-semibold'>วัตถุดิบที่ต้องสั่งซื้อ</h3>
        </div>
        <div className='space-y-2'>
          {lowStockItems.map((item) => (
            <div
              key={item.id}
              className='flex items-center justify-between rounded-lg border p-2 text-sm'
            >
              <span>{item.name}</span>
              <span className='text-yellow-600'>
                เหลือ {item.quantity} {item.unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
