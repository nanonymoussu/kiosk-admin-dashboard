import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { publishMenuItems } from '@/lib/mqtt'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const menuItemId = parseInt(params.id)
    if (isNaN(menuItemId)) {
      return NextResponse.json(
        { error: 'Invalid menu item ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { nameTH, nameEN, type, choices } = body

    if (!nameTH || !nameEN || !type || !choices?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const orderOption = await prisma.orderOption.create({
      data: {
        nameTH,
        nameEN,
        type,
        menuItemId: menuItemId,
        choices: {
          create: choices.map((choice: { nameTH: string; nameEN: string }) => ({
            nameTH: choice.nameTH,
            nameEN: choice.nameEN,
          })),
        },
      },
      include: {
        choices: true,
      },
    })

    const menuItems = await prisma.menuItem
      .findMany({
        include: {
          menuCategory: true,
          orderOptions: {
            include: {
              choices: true,
            },
          },
        },
      })
      .then((items) =>
        items.map((item) => ({
          ...item,
          menuCategory: item.menuCategory || undefined,
          orderOptions: item.orderOptions.map((option) => ({
            ...option,
            type: option.type as 'single' | 'multiple',
          })),
        }))
      )

    await publishMenuItems(menuItems)

    return NextResponse.json(orderOption, { status: 201 })
  } catch (error) {
    console.error('Error creating order option:', error)
    return NextResponse.json(
      { error: 'Failed to create order option' },
      { status: 500 }
    )
  }
}
