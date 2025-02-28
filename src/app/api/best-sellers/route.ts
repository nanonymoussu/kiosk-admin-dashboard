import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get('limit')) || 5

    // Get order history with items
    const orderHistory = await prisma.orderHistory.findMany({
      include: {
        items: true,
      },
      where: {
        status: 'เสร็จสิ้น', // Only completed orders
      },
    })

    // Aggregate sales by menu item
    const salesByItem = orderHistory.reduce((acc, order) => {
      order.items.forEach((item) => {
        const key = `${item.menuName}-${item.category}`
        if (!acc[key]) {
          acc[key] = {
            menuName: item.menuName,
            category: item.category,
            totalSales: 0,
          }
        }
        acc[key].totalSales += item.quantity
      })
      return acc
    }, {} as Record<string, { menuName: string; category: string; totalSales: number }>)

    // Convert to array and sort by total sales
    const bestSellers = Object.values(salesByItem)
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, limit)
      .map((item) => ({
        ...item,
        imageUrl: '/placeholder.svg',
      }))

    return NextResponse.json(bestSellers)
  } catch (error) {
    console.error('Failed to fetch best sellers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch best sellers' },
      { status: 500 }
    )
  }
}
