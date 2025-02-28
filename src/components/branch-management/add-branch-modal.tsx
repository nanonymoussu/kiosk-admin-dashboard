'use client'

import { useState } from 'react'
import useSWR from 'swr'
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

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function AddBranchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [manager, setManager] = useState('')
  const { mutate } = useSWR<Branch[]>('/api/branches', fetcher)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/branches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, manager }),
    })

    if (res.ok) {
      const newBranch = await res.json()
      mutate((branches = []) => [...branches, newBranch], false)
      mutate()
      setName('')
      setManager('')
    } else {
      console.error('Failed to add new branch')
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>เพิ่มสาขาใหม่</DialogTitle>
          <DialogDescription>กรอกรายละเอียดสำหรับสาขาใหม่</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                ชื่อสาขา
              </Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='manager' className='text-right'>
                ผู้จัดการสาขา
              </Label>
              <Input
                id='manager'
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>ยืนยัน</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
