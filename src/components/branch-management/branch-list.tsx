'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Pencil, Trash2 } from 'lucide-react'
import { EditBranchModal } from '@/components/branch-management/edit-branch-modal'
import { SweetAlert } from '@/components/sweet-alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useRole } from '@/contexts/RoleContext'

interface Branch {
  id: number
  name: string
  manager: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function BranchList() {
  const { data: branches, error, mutate } = useSWR('/api/branches', fetcher)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'warning',
    message: '',
  })
  const { role } = useRole()

  if (error) return <div>Failed to load branches</div>
  if (!branches) return <div>Loading...</div>

  const handleEdit = (branch: Branch) => {
    if (role === 'admin') {
      setEditingBranch(branch)
    } else {
      setAlertState({
        isOpen: true,
        type: 'error',
        message: 'คุณไม่มีสิทธิ์ในการแก้ไขสาขา',
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (role === 'admin') {
      mutate(
        (prev: Branch[]) => prev.filter((branch: Branch) => branch.id !== id),
        false
      )
      const res = await fetch(`/api/branches/${id}`, { method: 'DELETE' })
      if (res.ok) {
        // Revalidate in the background
        mutate()
        setAlertState({
          isOpen: true,
          type: 'success',
          message: 'ทำการลบสาขาเรียบร้อยแล้ว',
        })
      } else {
        // Revert update on error
        mutate()
        setAlertState({
          isOpen: true,
          type: 'error',
          message: 'เกิดข้อผิดพลาดในการลบสาขา',
        })
      }
    } else {
      setAlertState({
        isOpen: true,
        type: 'error',
        message: 'คุณไม่มีสิทธิ์ในการลบสาขา',
      })
    }
  }
  const handleSave = async (editedBranch: Branch) => {
    mutate(
      (prev: Branch[]) =>
        prev.map((branch: Branch) =>
          branch.id === editedBranch.id ? editedBranch : branch
        ),
      false
    )
    const res = await fetch(`/api/branches/${editedBranch.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedBranch),
    })
    if (res.ok) {
      // Revalidate data in the background
      mutate()
      setAlertState({
        isOpen: true,
        type: 'success',
        message: 'ทำการบันทึกข้อมูลสาขาเรียบร้อยแล้ว',
      })
    } else {
      // Revert update on error
      mutate()
      setAlertState({
        isOpen: true,
        type: 'error',
        message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
      })
    }
    setEditingBranch(null)
  }

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อสาขา</TableHead>
              <TableHead>ผู้จัดการสาขา</TableHead>
              {role === 'admin' && (
                <TableHead className='text-right'></TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch: Branch) => (
              <TableRow key={branch.id}>
                <TableCell className='font-medium'>{branch.name}</TableCell>
                <TableCell>{branch.manager}</TableCell>
                {role === 'admin' && (
                  <TableCell className='text-right'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleEdit(branch)}
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleDelete(branch.id)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {editingBranch && (
        <EditBranchModal
          isOpen={!!editingBranch}
          onClose={() => setEditingBranch(null)}
          branch={editingBranch}
          onSave={handleSave}
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
