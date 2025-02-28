'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Store,
  Bike,
  DollarSign,
  ShoppingCart,
  ArrowUpRight,
  Calculator,
} from 'lucide-react'

interface MetricsData {
  todayOrders: number
  totalOrders: number
  todaySales: number
  totalSales: number
  orderGrowth: number
  salesGrowth: number
  avgOrderValue: number
  totalAvgOrderValue: number
  mostActiveHour: number
  mostActiveHourOrders: number
  weeklyOrders: number
  weeklySales: number
  deliveryStats: Array<{
    type: string
    count: number
    sales: number
  }>
  dailyAverage: number
}

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/analytics/metrics')
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error('Failed to fetch metrics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (isLoading) {
    return (
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className='p-4'>
              <div className='h-[72px] flex items-center justify-center'>
                <p className='text-muted-foreground'>กำลังโหลด...</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const metricsConfig = [
    // Main KPIs - Full width on mobile, quarter width on larger screens
    {
      title: 'ยอดขายวันนี้',
      value: `฿${metrics?.todaySales.toLocaleString() || '0'}`,
      change: metrics?.salesGrowth.toFixed(1),
      subtitle: `เฉลี่ย ฿${metrics?.avgOrderValue.toFixed(0) || '0'}/ออเดอร์`,
      icon: <DollarSign className='h-4 w-4' />,
      className: 'col-span-4 sm:col-span-2 lg:col-span-1 bg-primary/5',
    },
    {
      title: 'จำนวนออเดอร์วันนี้',
      value: metrics?.todayOrders.toLocaleString() || '0',
      change: metrics?.orderGrowth.toFixed(1),
      subtitle: 'รายการ',
      icon: <ShoppingCart className='h-4 w-4' />,
      className: 'col-span-4 sm:col-span-2 lg:col-span-1 bg-primary/5',
    },
    {
      title: 'ยอดขายเฉลี่ยต่อวัน',
      value: `฿${(metrics?.dailyAverage || 0).toLocaleString()}`,
      subtitle: '7 วันที่ผ่านมา',
      icon: <TrendingUp className='h-4 w-4' />,
      className: 'col-span-4 sm:col-span-2 lg:col-span-1 bg-primary/5',
    },
    {
      title: 'ยอดขายทั้งหมด',
      value: `฿${metrics?.totalSales.toLocaleString() || '0'}`,
      subtitle: `${metrics?.totalOrders.toLocaleString() || '0'} ออเดอร์`,
      icon: <ArrowUpRight className='h-4 w-4' />,
      className: 'col-span-4 sm:col-span-2 lg:col-span-1 bg-primary/5',
    },
    {
      title: 'รับประทานที่ร้าน',
      value:
        metrics?.deliveryStats
          ?.find((s) => s.type === 'ทานที่ร้าน')
          ?.count.toLocaleString() || '0',
      subtitle: `฿${
        metrics?.deliveryStats
          ?.find((s) => s.type === 'ทานที่ร้าน')
          ?.sales.toLocaleString() || '0'
      }`,
      icon: <Store className='h-4 w-4' />,
      className: 'col-span-2 lg:col-span-1',
    },
    {
      title: 'สั่งกลับบ้าน',
      value:
        metrics?.deliveryStats
          ?.find((s) => s.type === 'สั่งกลับบ้าน')
          ?.count.toLocaleString() || '0',
      subtitle: `฿${
        metrics?.deliveryStats
          ?.find((s) => s.type === 'สั่งกลับบ้าน')
          ?.sales.toLocaleString() || '0'
      }`,
      icon: <Bike className='h-4 w-4' />,
      className: 'col-span-2 lg:col-span-1',
    },
    // Time-based metrics
    {
      title: 'ช่วงเวลาขายดี',
      value: `${String(metrics?.mostActiveHour || 0).padStart(2, '0')}:00`,
      subtitle: `${metrics?.mostActiveHourOrders || 0} ออเดอร์`,
      icon: <Clock className='h-4 w-4' />,
      className: 'col-span-2 lg:col-span-1',
    },
    // Additional metrics
    {
      title: 'มูลค่าเฉลี่ยต่อออเดอร์',
      value: `฿${(metrics?.totalAvgOrderValue || 0).toLocaleString()}`,
      subtitle: 'เฉลี่ยทั้งหมด',
      icon: <Calculator className='h-4 w-4' />,
      className: 'col-span-2 lg:col-span-1',
    },
  ]

  return (
    <div className='grid gap-4 grid-cols-4 lg:grid-cols-4'>
      {metricsConfig.map((metric) => (
        <Card
          key={metric.title}
          className={`${metric.className} transition-all hover:scale-[1.02] hover:shadow-md`}
        >
          <CardContent className='p-4'>
            <div className='flex flex-col gap-3'>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-medium text-muted-foreground'>
                  {metric.title}
                </p>
                <span className='p-2 rounded-full bg-background/80'>
                  {metric.icon}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <p className='text-2xl font-bold tracking-tight'>
                  {metric.value}
                </p>
                {metric.change && (
                  <span
                    className={`flex items-center text-sm ${
                      parseFloat(metric.change) >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {parseFloat(metric.change) >= 0 ? (
                      <TrendingUp className='h-4 w-4' />
                    ) : (
                      <TrendingDown className='h-4 w-4' />
                    )}
                    {Math.abs(parseFloat(metric.change))}%
                  </span>
                )}
              </div>
              <p className='text-sm text-muted-foreground'>{metric.subtitle}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
