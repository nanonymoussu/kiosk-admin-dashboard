'use client'

import { PageContainer } from '@/components/page-container'
import { BranchActions } from '@/components/branch-management/branch-actions'
import { BranchList } from '@/components/branch-management/branch-list'

export default function BranchManagementPage() {
  return (
    <PageContainer>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl md:text-3xl font-bold'>จัดการสาขา</h1>
        <BranchActions />
      </div>
      <BranchList />
    </PageContainer>
  )
}
