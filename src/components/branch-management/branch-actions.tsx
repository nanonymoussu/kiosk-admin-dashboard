'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AddBranchModal } from '@/components/branch-management/add-branch-modal'

export function BranchActions() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>เพิ่มสาขาใหม่</Button>
      <AddBranchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
