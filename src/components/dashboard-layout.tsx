'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard-nav'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useLocalStorage } from '@/hooks/use-local-storage'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    'sidebar-collapsed',
    false
  )

  // Handle responsive sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // lg breakpoint
        setIsCollapsed(false)
      } else {
        setIsCollapsed(true)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setIsCollapsed])

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (isLoginPage) return children

  return (
    <div className='flex h-screen bg-background'>
      {/* Mobile menu button - only show below md breakpoint */}
      <Button
        variant='ghost'
        size='icon'
        className='fixed top-4 left-4 z-50 md:hidden'
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar with smooth transitions */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-40
          transform md:transform-none transition-all duration-300 ease-in-out
          ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }
        `}
      >
        <DashboardNav
          isCollapsed={isCollapsed}
          onCollapse={setIsCollapsed}
          isMobile={!sidebarOpen}
        />
      </div>

      {/* Main content with proper padding */}
      <div className='flex-1 overflow-hidden'>
        <main className='h-full overflow-y-auto'>
          <div
            className={`transition-all duration-300 ${
              isCollapsed ? 'md:pl-[70px]' : 'md:pl-0'
            }`}
          >
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay with fade effect */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 md:hidden z-30 transition-opacity duration-300'
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
