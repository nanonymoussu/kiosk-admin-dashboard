import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { publishMenuItems } from '@/lib/mqtt'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const body = await request.json()

    // Update only menu item fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: {
        nameTH: body.nameTH,
        nameEN: body.nameEN,
        price: body.price,
        menuCategoryId: body.menuCategoryId,
        image: body.image,
      },
    })

    const finalItem = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        menuCategory: true,
        orderOptions: {
          include: {
            choices: true,
          },
        },
      },
    })

    const allMenuItems = await prisma.menuItem
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

    await publishMenuItems(allMenuItems)
    return NextResponse.json(finalItem)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json(
      { error: 'Menu item ID is required' },
      { status: 400 }
    )
  }

  try {
    const menuItemId = parseInt(params.id)
    if (isNaN(menuItemId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    // First, delete all related order option choices
    await prisma.orderOptionChoice.deleteMany({
      where: {
        orderOption: {
          menuItemId: menuItemId,
        },
      },
    })

    // Then, delete all related order options
    await prisma.orderOption.deleteMany({
      where: {
        menuItemId: menuItemId,
      },
    })

    // Finally, delete the menu item
    const deletedItem = await prisma.menuItem.delete({
      where: {
        id: menuItemId,
      },
    })

    if (!deletedItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      )
    }

    // Get updated menu items list
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

    // Publish updated menu items
    await publishMenuItems(formattedMenuItems)

    return NextResponse.json(
      { message: 'Menu item deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting menu item:', error)
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    )
  }
}
