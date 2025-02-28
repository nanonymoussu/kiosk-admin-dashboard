'use client'

import { PageContainer } from '@/components/page-container'
import { BOMList } from '@/components/bom/bom-list'
import { BOMActions } from '@/components/bom/bom-actions'

export default function BOMPage() {
  return (
    <PageContainer>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl md:text-3xl font-bold'>รายการวัตถุดิบ</h1>
        <BOMActions />
      </div>
      <BOMList />
    </PageContainer>
  )
}
