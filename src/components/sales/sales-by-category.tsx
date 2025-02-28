'use client'

import { useEffect, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#FF6B6B',
  '#4ECDC4',
]

interface CategorySales {
  name: string
  value: number
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return percent > 0.05 ? ( // Only show label if segment is > 5%
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor='middle'
      dominantBaseline='central'
      fontSize={12}
      fontWeight='bold'
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null
}

export function SalesByCategory() {
  const [data, setData] = useState<CategorySales[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        const response = await fetch('/api/order-history')
        const orderHistory = await response.json()

        // Group sales by category
        const categorySales = orderHistory.reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (acc: { [key: string]: number }, order: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            order.items.forEach((item: any) => {
              const totalItemSales = item.price * item.quantity
              acc[item.category] = (acc[item.category] || 0) + totalItemSales
            })

            return acc
          },
          {}
        )

        // Transform to chart data format
        const chartData = Object.entries(categorySales).map(
          ([name, value]) => ({
            name,
            value: value as number,
          })
        )

        setData(chartData)
      } catch (error) {
        console.error('Failed to fetch category sales:', error)
        setData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAndProcessData()
  }, [])

  if (isLoading || !data.length) {
    return (
      <div className='h-full w-full flex items-center justify-center'>
        <p className='text-muted-foreground'>
          {isLoading ? 'กำลังโหลด...' : 'ไม่มีข้อมูล'}
        </p>
      </div>
    )
  }

  return (
    <div className='h-full w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius='80%'
            innerRadius='60%'
            fill='#8884d8'
            dataKey='value'
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Legend
            verticalAlign='bottom'
            align='center'
            layout='horizontal'
            wrapperStyle={{
              bottom: 0,
              lineHeight: '24px',
            }}
            formatter={(value, entry) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const { payload } = entry as any
              const total = data.reduce((sum, item) => sum + item.value, 0)
              const percentage = ((payload.value / total) * 100).toFixed(1)
              return (
                <span className='text-sm'>{`${value} (${percentage}%)`}</span>
              )
            }}
          />
          <Tooltip
            formatter={(value: number) => [
              `฿${value.toLocaleString()}`,
              'ยอดขาย',
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
