'use client'

import { useState } from 'react'
import { PageContainer } from '@/components/page-container'
import { HistoryFilters } from '@/components/history/history-filters'
import { HistoryList } from '@/components/history/history-list'

export default function OrderHistoryPage() {
  const [filterDate, setFilterDate] = useState<Date>()

  return (
    <PageContainer>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl md:text-3xl font-bold'>
          ประวัติรายการคำสั่งซื้อ
        </h1>
        <HistoryFilters onDateChange={setFilterDate} />
      </div>
      <HistoryList filterDate={filterDate} />
    </PageContainer>
  )
}
