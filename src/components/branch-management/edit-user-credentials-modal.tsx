'use client'

import { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Branch } from '@/types/branch'
import { UserCredential } from '@/types/user-credential'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function EditUserCredentialsModal({
  isOpen,
  onClose,
  credential,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  credential: UserCredential
  onSave: (editedCredential: UserCredential & { password?: string }) => void
}) {
  const [editedCredential, setEditedCredential] =
    useState<UserCredential>(credential)
  const [password, setPassword] = useState('')
  const { data: branches } = useSWR<Branch[]>('/api/branches', fetcher)

  useEffect(() => {
    setEditedCredential(credential)
    setPassword('')
  }, [credential])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedCredential((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: 'admin' | 'manager') => {
    setEditedCredential((prev) => ({
      ...prev,
      role: value,
      branchName: value === 'admin' ? '-' : prev.branchName,
    }))
  }

  const handleBranchChange = (value: string) => {
    setEditedCredential((prev) => ({ ...prev, branchName: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // For new credentials (id === 0), ensure a password is provided
    if (!credential.id && !password) {
      alert('Password is required for new credentials')
      return
    }
    onSave({ ...editedCredential, password })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {credential.id
              ? 'แก้ไขข้อมูลประจำตัวผู้ใช้'
              : 'เพิ่มข้อมูลประจำตัวผู้ใช้'}
          </DialogTitle>
          <DialogDescription>
            {credential.id
              ? 'แก้ไขข้อมูลประจำตัวผู้ใช้ที่นี่'
              : 'เพิ่มข้อมูลประจำตัวผู้ใช้ใหม่ที่นี่'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='username' className='text-right'>
                ชื่อบัญชีผู้ใช้
              </Label>
              <Input
                id='username'
                name='username'
                value={editedCredential.username}
                onChange={handleInputChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='password' className='text-right'>
                รหัสผ่าน
              </Label>
              <Input
                id='password'
                name='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='col-span-3'
                placeholder={
                  credential.id ? 'ปล่อยว่างถ้าไม่ต้องการเปลี่ยนแปลง' : ''
                }
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='role' className='text-right'>
                สิทธิผู้ใช้งาน
              </Label>
              <Select
                value={editedCredential.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='กรุณาเลือกสิทธิผู้ใช้งาน' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='admin'>แอดมิน</SelectItem>
                  <SelectItem value='manager'>ผู้จัดการสาขา</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {editedCredential.role === 'manager' && (
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='branch' className='text-right'>
                  สาขา
                </Label>
                <Select
                  value={editedCredential.branchName}
                  onValueChange={handleBranchChange}
                >
                  <SelectTrigger className='col-span-3'>
                    <SelectValue placeholder='กรุณาเลือกสาขา' />
                  </SelectTrigger>
                  <SelectContent>
                    {branches &&
                      branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.name}>
                          {branch.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type='submit'>ยืนยันการเปลี่ยนแปลง</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
