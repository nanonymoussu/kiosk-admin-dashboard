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
import { Pencil, Trash2 } from 'lucide-react'
import { EditOrderOptionModal } from '@/components/menu/edit-order-option-modal'
import { useRole } from '@/contexts/RoleContext'
import { OrderOption } from '@/types/order-options'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function OrderOptionsList({
  onAction,
}: {
  onAction: (type: 'success' | 'error' | 'warning', message: string) => void
}) {
  const {
    data: orderOptions,
    error,
    mutate,
  } = useSWR<OrderOption[]>('/api/order-options', fetcher)

  const [editingOption, setEditingOption] = useState<OrderOption | null>(null)
  const { role } = useRole()

  const handleEdit = (option: OrderOption) => {
    if (role === 'admin') {
      setEditingOption(option)
    } else {
      onAction('error', "You don't have permission to edit order options.")
    }
  }

  const handleDelete = async (id: number) => {
    if (role === 'admin') {
      try {
        const filteredOptions =
          orderOptions?.filter((option) => option.id !== id) || []
        await mutate(filteredOptions, false)
        onAction('success', 'Order option deleted successfully')
      } catch (error) {
        console.error('Error deleting order option:', error)
        onAction('error', 'Failed to delete order option')
      }
    } else {
      onAction('error', "You don't have permission to delete order options.")
    }
  }

  const handleSave = (editedOption: OrderOption) => {
    if (editedOption.id) {
      const updatedOptions =
        orderOptions?.map((option: OrderOption) =>
          option.id === editedOption.id ? editedOption : option
        ) || []
      mutate(updatedOptions, false)
      onAction('success', 'Order option updated successfully')
    } else {
      const newOption = {
        ...editedOption,
        id: Math.max(...(orderOptions?.map((o) => o.id) || [0])) + 1,
      }
      mutate([...(orderOptions || []), newOption], false)
      onAction('success', 'New order option added successfully')
    }
    setEditingOption(null)
  }

  if (error) return <div>Failed to load order options</div>
  if (!orderOptions) return <div>Loading...</div>

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Choices</TableHead>
              {role === 'admin' && (
                <TableHead className='text-right'>Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderOptions.map((option) => (
              <TableRow key={option.id}>
                <TableCell className='font-medium'>{option.nameEN}</TableCell>
                <TableCell>{option.type}</TableCell>
                <TableCell>
                  {option.choices.map((c) => c.nameEN).join(', ')}
                </TableCell>
                {role === 'admin' && (
                  <TableCell className='text-right'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleEdit(option)}
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleDelete(option.id)}
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
      {editingOption && (
        <EditOrderOptionModal
          isOpen={!!editingOption}
          onClose={() => setEditingOption(null)}
          option={editingOption}
          onSave={handleSave}
        />
      )}
    </>
  )
}
