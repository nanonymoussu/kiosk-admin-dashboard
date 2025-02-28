import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const order = await req.json()
    const items =
      typeof order.items === 'string' ? JSON.parse(order.items) : order.items

    // Convert date string to ISO DateTime
    const [year, month, day] = order.date.split('-')
    const [hours, minutes, seconds] = order.time.split(':')
    const isoDateTime = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds)
    )

    const orderHistory = await prisma.orderHistory.create({
      data: {
        orderId: order.id,
        date: isoDateTime,
        time: order.time,
        totalQuantity: order.totalQuantity,
        totalPrice: order.totalPrice,
        deliveryType:
          order.deliveryType.toUpperCase() === 'ทานที่ร้าน'
            ? 'ทานที่ร้าน'
            : 'สั่งกลับบ้าน',
        status: 'เสร็จสิ้น',
        items: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          create: items.map((item: any) => ({
            menuName: item.menuName,
            category: item.category || '',
            quantity: item.quantity,
            price: item.price,
            options: item.options || [],
          })),
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(orderHistory)
  } catch (error) {
    console.error('Error creating order history:', error)
    return NextResponse.json(
      { error: 'Failed to create order history' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    const limit = Number(searchParams.get('limit')) || undefined

    let where = {}
    if (dateParam) {
      const filterDate = new Date(dateParam)
      where = {
        date: {
          gte: new Date(filterDate.setHours(0, 0, 0, 0)),
          lt: new Date(filterDate.setHours(23, 59, 59, 999)),
        },
      }
    }

    const orderHistory = await prisma.orderHistory.findMany({
      where,
      include: {
        items: true,
        branch: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: limit,
    })

    return NextResponse.json(orderHistory || [])
  } catch (error) {
    console.error('Error fetching order history:', error)
    return NextResponse.json([], { status: 500 })
  }
}
