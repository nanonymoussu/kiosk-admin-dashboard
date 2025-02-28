'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'

type Role = 'admin' | 'manager' | null

interface RoleContextType {
  role: Role
  setRole: (role: Role) => void
  login: (role: Role) => void
  logout: () => void
  isAuthenticated: boolean
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  const [role, setRole] = useState<Role>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('role') as Role) || null
    }
    return null
  })

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => typeof window !== 'undefined' && !!localStorage.getItem('role')
  )

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      setRole(null)
      setIsAuthenticated(false)
      localStorage.removeItem('role')
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify')
        const data = await response.json()

        if (response.ok && data.role) {
          setRole(data.role)
          setIsAuthenticated(true)
          localStorage.setItem('role', data.role)
        } else {
          logout()
        }
      } catch (error) {
        console.error('Auth verification failed:', error)
        logout()
      }
    }

    if (!isAuthenticated) {
      checkAuth()
    }
  }, [isAuthenticated, logout])

  const login = (newRole: Role) => {
    setRole(newRole)
    setIsAuthenticated(true)
    if (newRole) {
      localStorage.setItem('role', newRole)
    }
    router.push('/')
  }

  return (
    <RoleContext.Provider
      value={{ role, setRole, login, logout, isAuthenticated }}
    >
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}
