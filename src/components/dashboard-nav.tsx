'use client'

import {
  LayoutDashboard,
  ShoppingCart,
  History,
  Utensils,
  FolderTree,
  Menu,
  LucideIcon,
  Package,
  FileSpreadsheet,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

const navItems = [
  {
    title: 'แดชบอร์ดภาพรวม',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    title: 'หมวดหมู่อาหาร',
    icon: FolderTree,
    href: '/menu/categories',
  },
  {
    title: 'เมนูอาหาร',
    icon: Utensils,
    href: '/menu',
  },
  {
    title: 'คลังวัตถุดิบ',
    icon: Package,
    href: '/inventory',
  },
  {
    title: 'รายการวัตถุดิบ',
    icon: FileSpreadsheet,
    href: '/menu/bom',
  },
  {
    title: 'คำสั่งซื้อ',
    icon: ShoppingCart,
    href: '/orders',
  },
  {
    title: 'ประวัติคำสั่งซื้อ',
    icon: History,
    href: '/orders/history',
  },
  // {
  //   title: 'สาขา',
  //   icon: Building2,
  //   href: '/branch-management',
  // },
  // {
  //   title: 'ข้อมูลประจำสาขา',
  //   icon: Users,
  //   href: '/branch-management/users',
  // },
]

export function DashboardNav({
  isCollapsed,
  onCollapse,
  isMobile,
}: {
  isCollapsed: boolean
  onCollapse: (collapsed: boolean) => void
  isMobile?: boolean
}) {
  const pathname = usePathname()

  return (
    <div
      className={`relative h-screen flex flex-col border-r bg-card transition-all duration-300
        ${isCollapsed ? 'w-[70px]' : 'w-[240px]'}
        ${!isMobile && isCollapsed ? 'hover:w-[240px] group' : ''}
      `}
    >
      {/* Updated header layout for better icon alignment */}
      <div className='h-[60px] border-b sticky top-0 bg-card z-10'>
        <div className='flex h-full px-2'>
          {!isCollapsed && (
            <span className='flex items-center text-lg font-semibold text-orange-500 transition-all duration-300 px-2'>
              Food Kiosk
            </span>
          )}
          <div
            className={`flex items-center ${
              isCollapsed ? 'w-full justify-center' : 'ml-auto'
            }`}
          >
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onCollapse(!isCollapsed)}
              className='h-8 w-8 p-0'
            >
              <Menu className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      {/* Nav Items with better spacing */}
      <nav className='flex-1 overflow-y-auto py-2 px-2'>
        <div className='space-y-1'>
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </nav>
    </div>
  )
}

function NavItem({
  item,
  isActive,
  isCollapsed,
}: {
  item: { icon: LucideIcon; href: string; title: string }
  isActive: boolean
  isCollapsed: boolean
}) {
  return (
    <Link
      href={item.href}
      className={`
        flex items-center rounded-lg px-2 py-2 text-sm transition-all duration-200
        group/item relative
        ${isCollapsed ? 'justify-center' : 'justify-start'}
        ${
          isActive
            ? 'bg-orange-500 text-white'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }
      `}
    >
      <div className={`min-w-[24px] ${isCollapsed ? 'text-center' : ''}`}>
        <item.icon className='h-4 w-4' />
      </div>
      <span
        className={`truncate transition-all duration-200 ${
          isCollapsed
            ? 'w-0 opacity-0 hidden group-hover/nav:block group-hover/nav:w-auto group-hover/nav:opacity-100 group-hover/nav:ml-2'
            : 'w-auto opacity-100 ml-2'
        }`}
      >
        {item.title}
      </span>
      {isCollapsed && (
        <div className='absolute left-full z-50 hidden ml-1 px-2 py-1 overflow-hidden whitespace-nowrap rounded-md bg-popover text-popover-foreground shadow-md group-hover/item:flex items-center'>
          {item.title}
        </div>
      )}
    </Link>
  )
}
