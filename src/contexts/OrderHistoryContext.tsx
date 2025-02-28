'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Order } from '@/types/order'

type OrderHistoryContextType = {
  history: Order[]
  addToHistory: (order: Order) => void
}

const OrderHistoryContext = createContext<OrderHistoryContextType | undefined>(
  undefined
)

export function OrderHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<Order[]>([])

  const addToHistory = (order: Order) => {
    setHistory((prev) => [
      {
        ...order,
        status: 'เสร็จสิ้น',
        completedAt: new Date().toISOString(),
      },
      ...prev,
    ])
  }

  return (
    <OrderHistoryContext.Provider value={{ history, addToHistory }}>
      {children}
    </OrderHistoryContext.Provider>
  )
}

export const useOrderHistory = () => {
  const context = useContext(OrderHistoryContext)
  if (!context) {
    throw new Error('useOrderHistory must be used within OrderHistoryProvider')
  }
  return context
}
