import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const branches = await prisma.branch.findMany()
    return NextResponse.json(branches)
  } catch (error) {
    console.error('Error fetching branches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch branches' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, manager } = await request.json()

    if (!name || !manager) {
      return NextResponse.json(
        { error: 'Name and manager are required' },
        { status: 400 }
      )
    }

    const branch = await prisma.branch.create({
      data: { name, manager },
    })

    return NextResponse.json(branch, { status: 201 })
  } catch (error) {
    console.error('Error creating branch:', error)
    return NextResponse.json(
      { error: 'Failed to create branch' },
      { status: 500 }
    )
  }
}
