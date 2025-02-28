'use client'

import { useState, useEffect } from 'react'
import { Order } from '@/types/order'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  useEffect(() => {
    fetchOrders()
    // Set up polling interval
    const interval = setInterval(fetchOrders, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return { orders, setOrders, fetchOrders }
}
