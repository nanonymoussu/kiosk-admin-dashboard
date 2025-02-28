'use client'

import { useState } from 'react'
import { CheckCircle, Eye, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Order, OrderType } from '@/types/order'
import { useOrders } from '@/hooks/use-orders'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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

export function OrdersList() {
  const { orders, setOrders, fetchOrders } = useOrders()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  if (!orders?.length) {
    return (
      <Card className='p-8'>
        <div className='flex justify-center'>
          <p className='text-muted-foreground'>ไม่มีรายการคำสั่งซื้อ</p>
        </div>
      </Card>
    )
  }

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order['status']
  ) => {
    try {
      const completedOrder = orders.find((order) => order.id === orderId)
      if (!completedOrder) return

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )

      if (newStatus === 'เสร็จสิ้น') {
        const response = await fetch('/api/order-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...completedOrder,
            status: 'เสร็จสิ้น',
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to save to history')
        }

        await fetch(`/api/orders/${orderId}`, {
          method: 'DELETE',
        })

        await fetchOrders()
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
      await fetchOrders()
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete order')
      }

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: 'ยกเลิก' } : order
        )
      )

      setTimeout(() => {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        )
      }, 250)
    } catch (error) {
      console.error('Failed to delete order:', error)
    }
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
            <TableHead className='min-w-[100px]'>สถานะออเดอร์</TableHead>
            <TableHead className='min-w-[200px] text-center'>
              จัดการสถานะ
            </TableHead>
            <TableHead className='w-[100px] text-center'>รายละเอียด</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {orders.map((order) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 1, height: 'auto' }}
                exit={{
                  opacity: 0,
                  height: 0,
                  scale: 0.98,
                  transition: {
                    opacity: { duration: 0.25, ease: 'easeOut' },
                    height: { duration: 0.4, delay: 0.1, ease: 'easeInOut' },
                    scale: { duration: 0.3, ease: 'easeOut' },
                  },
                }}
                layout
                className={
                  order.deliveryType === 'ทานที่ร้าน'
                    ? 'bg-green-50/50 hover:bg-green-100/50'
                    : 'bg-blue-50/50 hover:bg-blue-100/50'
                }
              >
                <TableCell className='font-medium'>{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
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
                <TableCell>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-sm ${
                      order.status === 'เสร็จสิ้น'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'กำลังทำ'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className='text-center'>
                  <div className='flex justify-center gap-6'>
                    <div className='flex flex-col items-center'>
                      <Button
                        size='lg'
                        variant={
                          order.status === 'เสร็จสิ้น' ? 'default' : 'outline'
                        }
                        onClick={() =>
                          handleStatusChange(order.id, 'เสร็จสิ้น')
                        }
                        className={`${
                          order.status === 'เสร็จสิ้น'
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'text-green-500 hover:text-green-600'
                        } mb-1 h-12 w-12`}
                      >
                        <CheckCircle className='h-6 w-6' />
                      </Button>
                      <span className='text-sm font-medium text-muted-foreground'>
                        เสร็จสิ้น
                      </span>
                    </div>
                    <div className='flex flex-col items-center'>
                      <Button
                        size='lg'
                        variant='outline'
                        onClick={() => handleCancelOrder(order.id)}
                        className='text-red-500 hover:text-red-600 hover:bg-red-50 mb-1 h-12 w-12'
                      >
                        <XCircle className='h-6 w-6' />
                      </Button>
                      <span className='text-sm font-medium text-muted-foreground'>
                        ยกเลิก
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className='text-center'>
                  <div className='flex flex-col items-center'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-8 w-8 p-0 mb-1'
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className='h-4 w-4' />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
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
              {(() => {
                // console.log('Selected Order:', selectedOrder)
                // console.log('Items type:', typeof selectedOrder?.items)
                // console.log('Items:', selectedOrder?.items)

                const items =
                  typeof selectedOrder?.items === 'string'
                    ? JSON.parse(selectedOrder.items)
                    : selectedOrder?.items

                if (!items || !Array.isArray(items)) {
                  return (
                    <div className='p-4 text-center text-muted-foreground'>
                      ไม่พบรายการอาหาร
                    </div>
                  )
                }

                return items.map((item, index) => (
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
                        {item.options.map(
                          (option: OrderType, optIndex: number) => (
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
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))
              })()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
