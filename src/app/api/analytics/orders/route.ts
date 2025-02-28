import { type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  format,
} from 'date-fns'
import { th } from 'date-fns/locale'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const range = searchParams.get('range') || 'week'
  const now = new Date()

  try {
    let startDate: Date
    let dateFormat: string
    let groupBy: 'hour' | 'day' | 'month'

    switch (range) {
      case 'today':
        startDate = startOfDay(now)
        dateFormat = 'HH:00'
        groupBy = 'hour'
        break
      case 'week':
        startDate = startOfWeek(now, { weekStartsOn: 0 })
        dateFormat = 'EEEE'
        groupBy = 'day'
        break
      case 'month':
        startDate = startOfMonth(now)
        dateFormat = 'd MMM'
        groupBy = 'day'
        break
      case 'year':
        startDate = startOfYear(now)
        dateFormat = 'MMMM'
        groupBy = 'month'
        break
      case 'all':
        // Get start of the previous year
        startDate = startOfYear(new Date(now.getFullYear() - 1, 0))
        dateFormat = 'MMM yyyy'
        groupBy = 'month'
        break
      default:
        startDate = startOfWeek(now, { weekStartsOn: 0 })
        dateFormat = 'EEEE'
        groupBy = 'day'
    }

    const orders = await prisma.orderHistory.findMany({
      where: {
        date: {
          gte: startDate,
        },
      },
      select: {
        date: true,
        totalPrice: true,
      },
      orderBy: {
        date: 'asc',
      },
    })

    let chartData: { name: string; orders: number; sales: number }[] = []

    if (range === 'all') {
      // Group by month for all time view, including current and previous year
      const months: Record<string, { orders: number; sales: number }> = {}

      orders.forEach((order) => {
        const date = new Date(order.date)
        const key = format(date, dateFormat, { locale: th })

        if (!months[key]) {
          months[key] = { orders: 0, sales: 0 }
        }
        months[key].orders++
        months[key].sales += order.totalPrice
      })

      chartData = Object.entries(months).map(([name, data]) => ({
        name,
        ...data,
      }))
    } else if (groupBy === 'hour') {
      // Group by hour for 24-hour view
      chartData = Array.from({ length: 24 }, (_, i) => {
        const hour = i // Start from 00:00
        const hourOrders = orders.filter((order) => {
          const orderHour = new Date(order.date).getHours()
          return orderHour === hour
        })

        // Format hour in 24-hour format (00:00-23:00)
        const formattedHour = `${String(hour).padStart(2, '0')}:00`

        return {
          name: formattedHour,
          orders: hourOrders.length,
          sales: hourOrders.reduce((sum, order) => sum + order.totalPrice, 0),
        }
      })
    } else if (groupBy === 'day') {
      // Group by day for week and month
      const days = range === 'week' ? 7 : 31
      chartData = Array.from({ length: days }, (_, i) => {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        const dayOrders = orders.filter((order) => {
          const orderDate = new Date(order.date)
          return (
            orderDate.getDate() === date.getDate() &&
            orderDate.getMonth() === date.getMonth()
          )
        })
        return {
          name: format(date, dateFormat, { locale: th }),
          orders: dayOrders.length,
          sales: dayOrders.reduce((sum, order) => sum + order.totalPrice, 0),
        }
      })
    } else {
      // Group by month for year
      chartData = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(startDate)
        date.setMonth(date.getMonth() + i)
        const monthOrders = orders.filter((order) => {
          const orderDate = new Date(order.date)
          return orderDate.getMonth() === date.getMonth()
        })
        return {
          name: format(date, dateFormat, { locale: th }),
          orders: monthOrders.length,
          sales: monthOrders.reduce((sum, order) => sum + order.totalPrice, 0),
        }
      })
    }

    return Response.json(chartData)
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    return new Response('Failed to fetch analytics', { status: 500 })
  }
}
