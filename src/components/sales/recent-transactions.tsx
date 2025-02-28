'use client'

import { CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useState, useEffect } from 'react'
import { OrderHistory } from '@/types/order'

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<OrderHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderHistory | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/order-history?limit=5')
        const data = await response.json()
        setTransactions(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
        setTransactions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-muted-foreground'>กำลังโหลด...</p>
      </div>
    )
  }

  if (!transactions.length) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-muted-foreground'>ไม่พบรายการ</p>
      </div>
    )
  }

  return (
    <div className='h-full w-full -mx-4 sm:mx-0'>
      <div className='min-w-full overflow-x-auto'>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px]'>เลขที่ออเดอร์</TableHead>
                <TableHead className='w-[100px]'>วันที่สั่ง</TableHead>
                <TableHead className='w-[80px]'>เวลา</TableHead>
                <TableHead className='w-[100px] text-right'>จำนวน</TableHead>
                <TableHead className='w-[100px] text-right'>ราคารวม</TableHead>
                <TableHead className='w-[100px]'>ประเภท</TableHead>
                <TableHead className='w-[60px]'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.orderId}</TableCell>
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
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-8 w-8 p-0'
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className='h-4 w-4' />
                    </Button>
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
                      {item.options.length > 0 && (
                        <div className='mt-2 pl-4 border-l-2 border-muted space-y-1'>
                          {item.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className='text-sm flex items-center gap-2'
                            >
                              <span className='text-muted-foreground min-w-[80px]'>
                                {option.name}:
                              </span>
                              <span className='font-medium'>
                                {option.value}
                              </span>
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
        </CardContent>
      </div>
    </div>
  )
}
