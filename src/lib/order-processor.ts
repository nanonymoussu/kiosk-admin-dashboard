import { prisma } from '@/lib/prisma'
import { OrderItem } from '@/types/order'

interface OrderData {
  id?: string
  date: string
  totalQuantity: number
  totalPrice: number
  deliveryType: string
  status: string
  items: OrderItem[]
  time?: string
}

const formatTime = (date: Date = new Date()): string => {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export async function processOrder(orderData: OrderData) {
  try {
    console.log('[Order Processor] Processing order:', orderData)

    if (!orderData.id || !orderData.date) {
      throw new Error('Missing required fields: id or date')
    }

    const orderWithTime = {
      ...orderData,
      time: orderData.time || formatTime(),
    }

    console.log('[Order Processor] Processed order data:', orderWithTime)

    // Check if order already exists
    const existingOrder = await prisma.tempOrder.findUnique({
      where: { id: orderWithTime.id },
    })

    if (existingOrder) {
      // Update existing order instead of creating new one
      const updatedOrder = await prisma.tempOrder.update({
        where: { id: orderWithTime.id },
        data: {
          date: orderWithTime.date,
          time: orderWithTime.time,
          totalQuantity: Number(orderWithTime.totalQuantity),
          totalPrice: Number(orderWithTime.totalPrice),
          deliveryType: orderWithTime.deliveryType,
          status: orderWithTime.status,
          items: JSON.stringify(orderWithTime.items),
        },
      })
      console.log('[Order Processor] Order updated successfully:', updatedOrder)
      return updatedOrder
    }

    // Create new order if it doesn't exist
    const newOrder = await prisma.tempOrder.create({
      data: {
        id: orderWithTime.id as string,
        date: orderWithTime.date,
        time: orderWithTime.time ?? '',
        totalQuantity: Number(orderWithTime.totalQuantity),
        totalPrice: Number(orderWithTime.totalPrice),
        deliveryType: orderWithTime.deliveryType,
        status: orderWithTime.status,
        items: JSON.stringify(orderWithTime.items),
      },
    })

    console.log('[Order Processor] Order created successfully:', newOrder)
    return newOrder
  } catch (error) {
    console.error('[Order Processor] Error processing order:', error)
    throw error
  }
}
