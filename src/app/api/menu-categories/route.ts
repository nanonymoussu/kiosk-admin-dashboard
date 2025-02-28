import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { publishMenuCategories } from '@/lib/mqtt'

export async function GET() {
  try {
    const categories = await prisma.menuCategory.findMany()

    await publishMenuCategories(categories)
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { nameTH, nameEN } = await request.json()

    if (!nameTH || !nameEN) {
      return NextResponse.json(
        { error: 'Both nameTH and nameEN are required' },
        { status: 400 }
      )
    }

    const category = await prisma.menuCategory.create({
      data: { nameTH, nameEN },
    })

    const allCategories = await prisma.menuCategory.findMany()
    await publishMenuCategories(allCategories)

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
