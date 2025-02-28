'use client'

import { useState } from 'react'
import useSWR from 'swr'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { EditUserCredentialsModal } from '@/components/branch-management/edit-user-credentials-modal'
import { SweetAlert } from '@/components/sweet-alert'
import { UserCredential } from '@/types/user-credential'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function UserCredentialsList() {
  const {
    data: credentials,
    error,
    mutate,
  } = useSWR<UserCredential[]>('/api/user-credentials', fetcher)
  const [editingCredential, setEditingCredential] =
    useState<UserCredential | null>(null)
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'warning',
    message: '',
  })

  if (error) return <div>Failed to load user credentials</div>
  if (!credentials) return <div>Loading...</div>

  const handleEdit = (credential: UserCredential) => {
    setEditingCredential(credential)
  }

  const handleDelete = async (id: number) => {
    mutate(
      credentials.filter((c) => c.id !== id),
      false
    )
    const res = await fetch(`/api/user-credentials/${id}`, { method: 'DELETE' })
    if (res.ok) {
      mutate()
      setAlertState({
        isOpen: true,
        type: 'success',
        message: 'ทำการลบข้อมูลผู้ใช้เรียบร้อยแล้ว',
      })
    } else {
      mutate()
      setAlertState({
        isOpen: true,
        type: 'error',
        message: 'เกิดข้อผิดพลาดในการลบข้อมูลผู้ใช้',
      })
    }
  }

  const handleSave = async (
    editedCredential: UserCredential & { password?: string }
  ) => {
    mutate(
      credentials.map((c) =>
        c.id === editedCredential.id ? editedCredential : c
      ),
      false
    )
    const res = await fetch(`/api/user-credentials/${editedCredential.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedCredential),
    })
    if (res.ok) {
      mutate()
      setAlertState({
        isOpen: true,
        type: 'success',
        message: 'อัปเดตข้อมูลประจำตัวผู้ใช้สำเร็จแล้ว',
      })
    } else {
      mutate()
      setAlertState({
        isOpen: true,
        type: 'error',
        message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลประจำตัวผู้ใช้',
      })
    }
    setEditingCredential(null)
  }

  const handleAdd = () => {
    const newCredential: UserCredential = {
      id: 0,
      username: '',
      role: 'manager',
      branchName: '',
    }
    setEditingCredential(newCredential)
  }

  const handleCreate = async (
    newCredential: UserCredential & { password: string }
  ) => {
    const res = await fetch('/api/user-credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCredential),
    })
    if (res.ok) {
      const created = await res.json()
      mutate([...credentials, created], false)
      setAlertState({
        isOpen: true,
        type: 'success',
        message: 'สร้างข้อมูลประจำตัวผู้ใช้สำเร็จแล้ว',
      })
      mutate()
    } else {
      setAlertState({
        isOpen: true,
        type: 'error',
        message: 'เกิดข้อผิดพลาดในการสร้างข้อมูลประจำตัวผู้ใช้',
      })
    }
    setEditingCredential(null)
  }

  return (
    <>
      <Card>
        <div className='flex justify-end p-4'>
          <Button onClick={handleAdd}>
            <Plus className='h-4 w-4 mr-2' />
            เพิ่มผู้ใช้
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อบัญชีผู้ใช้</TableHead>
              <TableHead>สิทธิผู้ใช้งาน</TableHead>
              <TableHead>สาขา</TableHead>
              <TableHead className='text-right'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {credentials.map((credential) => (
              <TableRow key={credential.id}>
                <TableCell className='font-medium'>
                  {credential.username}
                </TableCell>
                <TableCell>{credential.role}</TableCell>
                <TableCell>{credential.branchName}</TableCell>
                <TableCell className='text-right'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleEdit(credential)}
                  >
                    <Pencil className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleDelete(credential.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {editingCredential && (
        <EditUserCredentialsModal
          isOpen={!!editingCredential}
          onClose={() => setEditingCredential(null)}
          credential={editingCredential}
          onSave={(
            credential:
              | (UserCredential & { password: string })
              | (UserCredential & { password?: string })
          ) => {
            // Use `handleCreate` if the credential is new (id === 0)
            if (editingCredential?.id === 0) {
              handleCreate(credential as UserCredential & { password: string })
            } else {
              handleSave(credential)
            }
          }}
        />
      )}
      <SweetAlert
        type={alertState.type}
        message={alertState.message}
        isOpen={alertState.isOpen}
        onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  )
}
