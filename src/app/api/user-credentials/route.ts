import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { branch: true },
    })

    // Map the users into our credential shape
    const credentials = users.map((user) => ({
      id: user.id,
      username: user.username,
      role: user.role,
      branchName: user.role === 'admin' ? '-' : user.branch?.name || '',
    }))

    return NextResponse.json(credentials)
  } catch (error) {
    console.error('Error fetching user credentials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user credentials' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { username, password, role, branchName } = await request.json()

    // Validate required fields
    if (!username || !password || !role) {
      return NextResponse.json(
        { error: 'Username, password, and role are required.' },
        { status: 400 }
      )
    }

    let branchId = null
    if (role === 'manager' && branchName) {
      const branch = await prisma.branch.findUnique({
        where: { name: branchName },
      })
      if (branch) branchId = branch.id
    }

    // Hash the password before storing it
    const hashedPassword = await hash(password, 10)
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, role, branchId },
    })

    return NextResponse.json(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        branchName: role === 'admin' ? '-' : branchName,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating user credential:', error)
    return NextResponse.json(
      { error: 'Failed to create user credential' },
      { status: 500 }
    )
  }
}
