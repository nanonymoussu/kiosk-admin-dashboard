import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const orders = await prisma.tempOrder.findMany({})
    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json()
    const orderId = orderData.id
    const totalQuantity = Number(orderData.totalQuantity)
    const totalPrice = Number(orderData.totalPrice)

    if (!orderData.time) {
      return NextResponse.json(
        { error: 'Time field is required' },
        { status: 400 }
      )
    }

    const newOrder = await prisma.tempOrder.create({
      data: {
        id: orderId,
        date: orderData.date,
        time: orderData.time, // Ensure time is included
        totalQuantity,
        totalPrice,
        deliveryType: orderData.deliveryType,
        status: orderData.status,
        items: JSON.stringify(orderData.items),
      },
    })

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error('Error saving order:', error)
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
  }
}
