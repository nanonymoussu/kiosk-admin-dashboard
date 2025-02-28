'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { AddCategoryModal } from '@/components/menu-categories/add-category-modal'

export function MenuCategoriesActions() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>
        <PlusCircle className='h-4 w-4 mr-2' />
        เพิ่มหมวดหมู่อาหาร
      </Button>
      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
