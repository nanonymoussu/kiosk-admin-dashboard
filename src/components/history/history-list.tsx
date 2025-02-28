'use client'

import { useEffect, useState } from 'react'
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
import { Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { OrderHistory } from '@/types/order'

interface HistoryListProps {
  filterDate?: Date
}

export function HistoryList({ filterDate }: HistoryListProps) {
  const [history, setHistory] = useState<OrderHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderHistory | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true)
        const queryParams = filterDate
          ? `?date=${filterDate.toISOString()}`
          : ''
        const response = await fetch(`/api/order-history${queryParams}`)
        const data = await response.json()
        // Ensure data is an array
        setHistory(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch history:', error)
        setHistory([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [filterDate])

  if (isLoading) {
    return (
      <Card className='p-8'>
        <div className='flex justify-center'>
          <p className='text-muted-foreground'>กำลังโหลด...</p>
        </div>
      </Card>
    )
  }

  if (!history.length) {
    return (
      <Card className='p-8'>
        <div className='flex justify-center'>
          <p className='text-muted-foreground'>ไม่พบรายการ</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className='overflow-x-auto'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='min-w-[100px]'>เลขที่ออเดอร์</TableHead>
            <TableHead className='min-w-[100px]'>วันที่สั่ง</TableHead>
            <TableHead className='min-w-[100px]'>เวลา</TableHead>
            <TableHead className='min-w-[100px]'>จำนวนรายการ</TableHead>
            <TableHead className='min-w-[100px]'>ราคารวม</TableHead>
            <TableHead className='min-w-[120px]'>ประเภทการบริการ</TableHead>
            <TableHead className='w-[100px] text-center'>รายละเอียด</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((order) => (
            <TableRow key={order.id}>
              <TableCell className='font-medium'>{order.orderId}</TableCell>
              <TableCell>
                {new Date(order.date).toLocaleDateString('th-TH')}
              </TableCell>
              <TableCell>
                {order.time
                  ? new Date(`2000-01-01T${order.time}`).toLocaleTimeString(
                      'th-TH',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      }
                    )
                  : '-'}
              </TableCell>
              <TableCell>{order.totalQuantity} รายการ</TableCell>
              <TableCell>{order.totalPrice.toLocaleString()} บาท</TableCell>
              <TableCell>{order.deliveryType}</TableCell>
              <TableCell className='text-center'>
                <div className='flex flex-col items-center'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-8 w-8 p-0'
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className='h-4 w-4' />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className='sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col'>
          <DialogHeader>
            <DialogTitle className='text-xl border-b pb-4'>
              รายการอาหาร
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4 overflow-y-auto'>
            <div className='divide-y divide-border rounded-lg border'>
              {selectedOrder?.items.map((item, index) => (
                <div key={index} className='p-4 hover:bg-muted/50'>
                  <div className='flex justify-between items-start mb-2'>
                    <div>
                      <h4 className='font-medium text-lg flex items-center gap-2'>
                        {item.menuName}
                        <span className='text-sm text-muted-foreground'>
                          x{item.quantity}
                        </span>
                      </h4>
                    </div>
                    <div className='text-right'>
                      <p className='font-medium'>
                        {(item.price * item.quantity).toLocaleString()} บาท
                      </p>
                    </div>
                  </div>
                  {Array.isArray(item.options) && item.options.length > 0 && (
                    <div className='mt-2 pl-4 border-l-2 border-muted space-y-1'>
                      {item.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className='text-sm flex items-center gap-2'
                        >
                          <span className='text-muted-foreground min-w-[80px]'>
                            {option.name}:
                          </span>
                          <span className='font-medium'>{option.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
