import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
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

    return NextResponse.json({
      categories,
      items: items.filter((item) => item.menuCategory !== null),
    })
  } catch (error) {
    console.error('Error fetching menu data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu data' },
      { status: 500 }
    )
  }
}
