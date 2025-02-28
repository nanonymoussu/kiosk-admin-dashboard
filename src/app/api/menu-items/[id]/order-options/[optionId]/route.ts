import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { publishMenuItems } from '@/lib/mqtt'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; optionId: string } }
) {
  if (!params.id || !params.optionId) {
    return NextResponse.json(
      { error: 'Menu item ID and option ID are required' },
      { status: 400 }
    )
  }

  try {
    const menuItemId = parseInt(params.id)
    const optionId = parseInt(params.optionId)

    if (isNaN(menuItemId) || isNaN(optionId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }

    // First delete all choices associated with this option
    await prisma.orderOptionChoice.deleteMany({
      where: { orderOptionId: optionId },
    })

    // Then delete the order option
    const deletedOption = await prisma.orderOption.delete({
      where: {
        id: optionId,
        menuItemId: menuItemId,
      },
    })

    if (!deletedOption) {
      return NextResponse.json(
        { error: 'Order option not found' },
        { status: 404 }
      )
    }

    // Get updated menu items for MQTT publish
    const allMenuItems = await prisma.menuItem.findMany({
      include: {
        menuCategory: true,
        orderOptions: {
          include: {
            choices: true,
          },
        },
      },
    })

    const formattedMenuItems = allMenuItems.map((item) => ({
      ...item,
      menuCategory: item.menuCategory || undefined,
      orderOptions: item.orderOptions.map((option) => ({
        ...option,
        type: option.type as 'single' | 'multiple',
      })),
    }))

    await publishMenuItems(formattedMenuItems)

    return NextResponse.json(
      { message: 'Order option deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting order option:', error)
    return NextResponse.json(
      { error: 'Failed to delete order option' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; optionId: string } }
) {
  if (!params.id || !params.optionId) {
    return NextResponse.json(
      { error: 'Menu item ID and option ID are required' },
      { status: 400 }
    )
  }

  try {
    const menuItemId = parseInt(params.id)
    const optionId = parseInt(params.optionId)
    const body = await request.json()
    const { nameTH, nameEN, type, choices } = body

    // Delete existing choices
    await prisma.orderOptionChoice.deleteMany({
      where: { orderOptionId: optionId },
    })

    // Update order option and create new choices
    const updatedOption = await prisma.orderOption.update({
      where: {
        id: optionId,
        menuItemId: menuItemId,
      },
      data: {
        nameTH,
        nameEN,
        type,
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

    // Get and publish updated menu items
    const allMenuItems = await prisma.menuItem.findMany({
      include: {
        menuCategory: true,
        orderOptions: {
          include: {
            choices: true,
          },
        },
      },
    })

    const formattedMenuItems = allMenuItems.map((item) => ({
      ...item,
      menuCategory: item.menuCategory || undefined,
      orderOptions: item.orderOptions.map((option) => ({
        ...option,
        type: option.type as 'single' | 'multiple',
      })),
    }))

    await publishMenuItems(formattedMenuItems)

    return NextResponse.json(updatedOption)
  } catch (error) {
    console.error('Error updating order option:', error)
    return NextResponse.json(
      { error: 'Failed to update order option' },
      { status: 500 }
    )
  }
}
