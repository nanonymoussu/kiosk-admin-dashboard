'use client'

import { PageContainer } from '@/components/page-container'
import { OrdersList } from '@/components/orders/orders-list'

export default function OrdersPage() {
  return (
    <PageContainer>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl md:text-3xl font-bold'>รายการออเดอร์</h1>
      </div>
      <OrdersList />
    </PageContainer>
  )
}
