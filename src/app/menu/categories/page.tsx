'use client'

import { PageContainer } from '@/components/page-container'
import { MenuCategoriesList } from '@/components/menu-categories/menu-categories-list'
import { MenuCategoriesActions } from '@/components/menu-categories/menu-categories-actions'

export default function MenuCategoriesPage() {
  return (
    <PageContainer>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl md:text-3xl font-bold'>จัดการหมวดหมู่อาหาร</h1>
        <MenuCategoriesActions />
      </div>
      <MenuCategoriesList />
    </PageContainer>
  )
}
