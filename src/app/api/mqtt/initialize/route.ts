import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  publishMenuCategories,
  publishMenuItems,
  subscribeToOrders,
} from '@/lib/mqtt'
import { MenuItem } from '@/types/menu-item'

let isSubscribed = false

export async function POST() {
  try {
    // Initialize menu data
    const [categories, items] = await Promise.all([
      prisma.menuCategory.findMany(),
      prisma.menuItem.findMany({
        include: {
          menuCategory: true,
          orderOptions: {
            include: {
              choices: true,
            },
          },
        },
      }),
    ])

    const validItems = items.filter(
      (item) => item.menuCategory !== null
    ) as MenuItem[]

    // Initialize MQTT data
    await Promise.all([
      publishMenuCategories(categories),
      publishMenuItems(validItems),
    ])

    // Subscribe to orders only once
    if (!isSubscribed) {
      await subscribeToOrders()
      isSubscribed = true
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error initializing MQTT:', error)
    return NextResponse.json(
      { error: 'Failed to initialize MQTT' },
      { status: 500 }
    )
  }
}
