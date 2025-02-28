'use client'

import { useClientOnly } from '@/hooks/useClientOnly'
import { RoleProvider } from '@/contexts/RoleContext'
import { AuthWrapper } from '@/components/auth-wrapper'
import { DashboardLayout } from '@/components/dashboard-layout'

export function Providers({ children }: { children: React.ReactNode }) {
  const isMounted = useClientOnly()

  if (!isMounted) {
    return null
  }

  return (
    <RoleProvider>
      <AuthWrapper>
        <DashboardLayout>{children}</DashboardLayout>
      </AuthWrapper>
    </RoleProvider>
  )
}
