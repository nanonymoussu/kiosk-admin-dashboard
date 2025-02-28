import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const branchId = parseInt(params.id)
    const { name, manager } = await request.json()

    const updatedBranch = await prisma.branch.update({
      where: { id: branchId },
      data: { name, manager },
    })

    return NextResponse.json(updatedBranch)
  } catch (error) {
    console.error('Error updating branch:', error)
    return NextResponse.json(
      { error: 'Failed to update branch' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const branchId = parseInt(params.id)
    await prisma.branch.delete({
      where: { id: branchId },
    })

    return NextResponse.json({ message: 'Branch deleted successfully' })
  } catch (error) {
    console.error('Error deleting branch:', error)
    return NextResponse.json(
      { error: 'Failed to delete branch' },
      { status: 500 }
    )
  }
}
