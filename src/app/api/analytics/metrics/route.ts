import { prisma } from '@/lib/prisma'
import { startOfDay, subDays } from 'date-fns'

export async function GET() {
  try {
    const today = startOfDay(new Date())
    const yesterday = subDays(today, 1)

    // Get today's metrics
    const todayMetrics = await prisma.orderHistory.aggregate({
      where: {
        date: {
          gte: today,
        },
      },
      _count: {
        id: true,
      },
      _sum: {
        totalPrice: true,
      },
      _avg: {
        totalPrice: true,
      },
    })

    // Get yesterday's metrics for comparison
    const yesterdayMetrics = await prisma.orderHistory.aggregate({
      where: {
        date: {
          gte: yesterday,
          lt: today,
        },
      },
      _count: {
        id: true,
      },
      _sum: {
        totalPrice: true,
      },
    })

    // Get total metrics
    const totalMetrics = await prisma.orderHistory.aggregate({
      _count: {
        id: true,
      },
      _sum: {
        totalPrice: true,
      },
      _avg: {
        totalPrice: true,
      },
    })

    // Find most active hour
    const hourlyOrders = await prisma.orderHistory.findMany({
      where: {
        date: {
          gte: today,
        },
      },
      select: {
        date: true,
      },
    })

    const hourCounts: { [key: number]: number } = {}
    hourlyOrders.forEach((order) => {
      const hour = new Date(order.date).getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })

    const mostActiveHour = Object.entries(hourCounts).reduce(
      (max, [hour, count]) => {
        return count > (hourCounts[parseInt(max[0])] || 0) ? [hour, count] : max
      },
      ['0', 0]
    )

    // Calculate daily growth rates
    const todayOrders = todayMetrics._count.id || 0
    const yesterdayOrders = yesterdayMetrics._count.id || 0
    const todaySales = todayMetrics._sum.totalPrice || 0
    const yesterdaySales = yesterdayMetrics._sum.totalPrice || 0

    // Calculate order growth rate
    let orderGrowth = 0
    if (yesterdayOrders > 0) {
      orderGrowth = ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100
    } else if (todayOrders > 0) {
      orderGrowth = 100 // If yesterday was 0 and today has orders, that's 100% growth
    }

    // Calculate sales growth rate
    let salesGrowth = 0
    if (yesterdaySales > 0) {
      salesGrowth = ((todaySales - yesterdaySales) / yesterdaySales) * 100
    } else if (todaySales > 0) {
      salesGrowth = 100 // If yesterday was 0 and today has sales, that's 100% growth
    }

    // Add debug logging
    console.log('Growth calculations:', {
      todayOrders,
      yesterdayOrders,
      orderGrowth,
      todaySales,
      yesterdaySales,
      salesGrowth,
    })

    // Add new analytics metrics with proper logging
    const deliveryTypeMetrics = await prisma.orderHistory.groupBy({
      by: ['deliveryType'],
      _count: true,
      _sum: {
        totalPrice: true,
      },
      where: {
        date: {
          gte: today,
        },
        // Ensure we only get valid delivery types
        deliveryType: {
          in: ['ทานที่ร้าน', 'สั่งกลับบ้าน'],
        },
      },
    })

    // Add debug logging
    console.log('Raw delivery metrics:', deliveryTypeMetrics)

    // Normalize delivery stats with debug logging
    const normalizedDeliveryStats = [
      {
        type: 'ทานที่ร้าน',
        count:
          deliveryTypeMetrics.find((m) => m.deliveryType === 'ทานที่ร้าน')
            ?._count || 0,
        sales:
          deliveryTypeMetrics.find((m) => m.deliveryType === 'ทานที่ร้าน')?._sum
            ?.totalPrice || 0,
      },
      {
        type: 'สั่งกลับบ้าน',
        count:
          deliveryTypeMetrics.find((m) => m.deliveryType === 'สั่งกลับบ้าน')
            ?._count || 0,
        sales:
          deliveryTypeMetrics.find((m) => m.deliveryType === 'สั่งกลับบ้าน')
            ?._sum?.totalPrice || 0,
      },
    ]

    const weeklyGrowth = await prisma.orderHistory.findMany({
      where: {
        date: {
          gte: subDays(today, 7),
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    const weeklyStats = weeklyGrowth.reduce(
      (acc, order) => {
        return {
          totalOrders: acc.totalOrders + 1,
          totalSales: acc.totalSales + order.totalPrice,
        }
      },
      { totalOrders: 0, totalSales: 0 }
    )

    return Response.json({
      todayOrders,
      totalOrders: totalMetrics._count.id,
      todaySales,
      totalSales: totalMetrics._sum.totalPrice || 0,
      orderGrowth,
      salesGrowth,
      avgOrderValue: todayMetrics._avg.totalPrice || 0,
      totalAvgOrderValue: totalMetrics._avg.totalPrice || 0,
      mostActiveHour: parseInt(mostActiveHour[0]),
      mostActiveHourOrders: mostActiveHour[1],
      weeklyOrders: weeklyStats.totalOrders,
      weeklySales: weeklyStats.totalSales,
      deliveryStats: normalizedDeliveryStats,
      dailyAverage: weeklyStats.totalSales / 7,
    })
  } catch (error) {
    console.error('Failed to fetch metrics:', error)
    return new Response('Failed to fetch metrics', { status: 500 })
  }
}
