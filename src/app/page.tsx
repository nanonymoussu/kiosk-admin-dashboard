'use client'

import { DashboardMetrics } from '@/components/dashboard-metrics'
import { OrdersChart } from '@/components/orders-chart'
import { BestSellerMenu } from '@/components/best-seller-menu'
import { SalesByCategory } from '@/components/sales/sales-by-category'
import { RecentTransactions } from '@/components/sales/recent-transactions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <main className='space-y-6 p-4 md:p-6 max-w-7xl mx-auto'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-3xl md:text-4xl font-bold'>ภาพรวมแดชบอร์ด</h1>
      </div>

      <DashboardMetrics />

      <div className='grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
        {/* Sales Trend Chart */}
        <Card className='min-h-[400px] lg:min-h-[500px] xl:col-span-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-6'>
            <CardTitle className='text-xl md:text-2xl font-bold tracking-tight'>
              แนวโน้มของยอดขาย
            </CardTitle>
          </CardHeader>
          <CardContent className='h-[350px] lg:h-[450px]'>
            <OrdersChart />
          </CardContent>
        </Card>

        {/* Category Sales Chart */}
        <Card className='min-h-[400px] lg:min-h-[500px]'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-6'>
            <CardTitle className='text-xl md:text-2xl font-bold tracking-tight'>
              ยอดขายตามหมวดหมู่
            </CardTitle>
          </CardHeader>
          <CardContent className='h-[400px]'>
            <SalesByCategory />
          </CardContent>
        </Card>

        {/* Best Sellers */}
        <Card className='min-h-[400px]'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-6'>
            <CardTitle className='text-xl md:text-2xl font-bold tracking-tight'>
              เมนูขายดี
            </CardTitle>
          </CardHeader>
          <CardContent className='h-[350px] overflow-auto'>
            <BestSellerMenu />
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className='min-h-[400px] xl:col-span-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-6'>
            <CardTitle className='text-xl md:text-2xl font-bold tracking-tight'>
              คำสั่งซื้อล่าสุด
            </CardTitle>
          </CardHeader>
          <CardContent className='h-[350px] overflow-auto'>
            <RecentTransactions />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
