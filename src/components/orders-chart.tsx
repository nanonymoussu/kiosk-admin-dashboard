'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ChartData = {
  name: string
  orders: number
  sales: number
}

type TimeRange = 'today' | 'week' | 'month' | 'year' | 'all'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='rounded-lg border bg-background p-2 shadow-sm'>
        <p className='text-sm font-medium'>{label}</p>
        <p className='text-sm text-muted-foreground'>
          จำนวนออเดอร์: {payload[0].value.toLocaleString()} รายการ
        </p>
        <p className='text-sm text-muted-foreground'>
          ยอดขาย: {payload[1].value.toLocaleString()} บาท
        </p>
      </div>
    )
  }
  return null
}

export function OrdersChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>('today')

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/analytics/orders?range=${timeRange}`)
        const chartData = await response.json()
        setData(chartData)
      } catch (error) {
        console.error('Failed to fetch chart data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  if (isLoading) {
    return (
      <div className='h-full w-full flex items-center justify-center'>
        <p className='text-muted-foreground'>กำลังโหลดข้อมูล...</p>
      </div>
    )
  }

  return (
    <div className='h-full w-full flex flex-col'>
      <div className='flex justify-end mb-4'>
        <Select
          value={timeRange}
          onValueChange={(value: TimeRange) => setTimeRange(value)}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='เลือกช่วงเวลา' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='today'>วันนี้</SelectItem>
            <SelectItem value='week'>สัปดาห์นี้</SelectItem>
            <SelectItem value='month'>เดือนนี้</SelectItem>
            <SelectItem value='year'>ปีนี้</SelectItem>
            <SelectItem value='all'>ทั้งหมด</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='flex-1'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='name'
              tick={{ fontSize: 12 }}
              interval={timeRange === 'today' ? 2 : 1} // Show every 3rd hour for today view
              angle={-45}
              textAnchor='end'
            />
            <YAxis
              yAxisId='left'
              orientation='left'
              stroke='#8884d8'
              tickFormatter={(value) => `${value} ออเดอร์`}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId='right'
              orientation='right'
              stroke='#82ca9d'
              tickFormatter={(value) => `${value.toLocaleString()} ฿`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign='top'
              height={36}
              formatter={(value) => {
                return value === 'orders' ? 'จำนวนออเดอร์' : 'ยอดขาย (บาท)'
              }}
            />
            <Line
              yAxisId='left'
              type='monotone'
              dataKey='orders'
              name='orders'
              stroke='#8884d8'
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId='right'
              type='monotone'
              dataKey='sales'
              name='sales'
              stroke='#82ca9d'
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
