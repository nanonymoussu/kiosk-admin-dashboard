import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const { username, password, role, branchName } = await request.json()

    let branchId = null
    if (role === 'manager' && branchName) {
      const branch = await prisma.branch.findUnique({
        where: { name: branchName },
      })
      if (branch) branchId = branch.id
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username,
        ...(password ? { password } : {}),
        role,
        branchId,
      },
    })

    return NextResponse.json({
      id: updatedUser.id,
      username: updatedUser.username,
      role: updatedUser.role,
      branchName: updatedUser.role === 'admin' ? '-' : branchName,
    })
  } catch (error) {
    console.error('Error updating user credential:', error)
    return NextResponse.json(
      { error: 'Failed to update user credential' },
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
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({
      message: 'User credential deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting user credential:', error)
    return NextResponse.json(
      { error: 'Failed to delete user credential' },
      { status: 500 }
    )
  }
}
