import { useState, useEffect } from 'react'
import { MenuCategory } from '@/types/menu-category'
import { MenuItem } from '@/types/menu-item'
import { publishMenuCategories, publishMenuItems } from '@/lib/mqtt'

export function useMenu() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [items, setItems] = useState<MenuItem[]>([])

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch('/api/menu')
        if (!response.ok) throw new Error('Failed to fetch menu data')
        const data = await response.json()

        setCategories(data.categories)
        setItems(data.items)

        // Publish to MQTT
        await Promise.all([
          publishMenuCategories(data.categories),
          publishMenuItems(data.items),
        ])
      } catch (error) {
        console.error('Error fetching menu data:', error)
      }
    }

    fetchMenuData()
  }, [])

  return { categories, items }
}
