'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Branch } from '@/types/branch'

export function EditBranchModal({
  isOpen,
  onClose,
  branch,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  branch: Branch
  onSave: (editedBranch: Branch) => void
}) {
  const [name, setName] = useState(branch.name)
  const [manager, setManager] = useState(branch.manager)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...branch, name, manager })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>แก้ไขข้อมูลสาขา</DialogTitle>
          <DialogDescription>ปรับปรุงรายละเอียดของสาขา</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='edit-name' className='text-right'>
                ชื่อสาขา
              </Label>
              <Input
                id='edit-name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='edit-manager' className='text-right'>
                ผู้จัดการสาขา
              </Label>
              <Input
                id='edit-manager'
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>ยืนยันการแก้ไข</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
