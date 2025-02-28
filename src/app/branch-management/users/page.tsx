'use client'

import { PageContainer } from '@/components/page-container'
import { UserCredentialsList } from '@/components/branch-management/user-credentials-list'
import { useRole } from '@/contexts/RoleContext'

export default function UserCredentialsPage() {
  const { role } = useRole()

  return (
    <PageContainer>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl md:text-3xl font-bold'>
          User Credentials Management
        </h1>
      </div>
      {role !== 'admin' ? (
        <p>You do not have permission to access this page.</p>
      ) : (
        <UserCredentialsList />
      )}
    </PageContainer>
  )
}
