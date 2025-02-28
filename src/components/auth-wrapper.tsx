'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useRole } from '@/contexts/RoleContext'

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useRole()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login')
    }
  }, [isAuthenticated, pathname, router])

  return <>{children}</>
}
