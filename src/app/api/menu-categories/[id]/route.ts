import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { publishMenuCategories } from '@/lib/mqtt'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const { nameTH, nameEN } = await request.json()

    const updatedCategory = await prisma.menuCategory.update({
      where: { id },
      data: { nameTH, nameEN },
    })

    const allCategories = await prisma.menuCategory.findMany()
    await publishMenuCategories(allCategories)

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    await prisma.menuCategory.delete({
      where: { id },
    })

    const allCategories = await prisma.menuCategory.findMany()
    await publishMenuCategories(allCategories)

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
