import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { publishMenuItems } from '@/lib/mqtt'

export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      include: {
        menuCategory: true,
        orderOptions: {
          include: {
            choices: {
              include: {
                bom: true, // Include BOM relation
              },
            },
          },
        },
        bom: {
          include: {
            ingredients: {
              include: {
                inventory: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(menuItems)
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return NextResponse.json(
      { error: 'ไม่สามารถดึงข้อมูลเมนูได้' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received menu item data:', body)

    const { nameTH, nameEN, price, image, menuCategoryId } = body

    // Validation
    if (!nameTH || !nameEN) {
      return NextResponse.json(
        { error: 'ต้องระบุชื่อเมนูทั้งภาษาไทยและอังกฤษ' },
        { status: 400 }
      )
    }

    const numericPrice = parseFloat(price)
    if (isNaN(numericPrice)) {
      return NextResponse.json({ error: 'ราคาต้องเป็นตัวเลข' }, { status: 400 })
    }

    const parsedMenuCategoryId = menuCategoryId
      ? parseInt(menuCategoryId)
      : undefined
    if (
      menuCategoryId &&
      parsedMenuCategoryId !== undefined &&
      isNaN(parsedMenuCategoryId)
    ) {
      return NextResponse.json(
        { error: 'Invalid menu category ID' },
        { status: 400 }
      )
    }

    console.log('Creating menu item with data:', {
      nameTH,
      nameEN,
      price: numericPrice,
      menuCategoryId: parsedMenuCategoryId,
    })

    const menuItem = await prisma.menuItem.create({
      data: {
        nameTH,
        nameEN,
        price: numericPrice,
        image,
        menuCategoryId: parsedMenuCategoryId,
      },
      include: {
        orderOptions: {
          include: {
            choices: true,
          },
        },
        menuCategory: true,
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

    console.log('Created menu item:', menuItem)
    return NextResponse.json(menuItem, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating menu item:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'เกิดข้อผิดพลาดในการเพิ่มเมนูอาหาร',
      },
      { status: 500 }
    )
  }
}
