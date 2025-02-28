'use client'

import { useState, useCallback } from 'react'
import { InventoryList } from '@/components/inventory/inventory-list'
import { InventoryActions } from '@/components/inventory/inventory-actions'

export default function InventoryPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleInventoryUpdate = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  return (
    <div className='space-y-6 p-8 pt-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>จัดการวัตถุดิบ</h2>
        <InventoryActions onInventoryUpdate={handleInventoryUpdate} />
      </div>
      <div className='w-full'>
        <InventoryList key={refreshKey} />
      </div>
    </div>
  )
}
