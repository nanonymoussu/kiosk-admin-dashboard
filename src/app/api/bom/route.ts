/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const boms = await prisma.bOM.findMany({
      include: {
        menuItem: true,
        optionChoice: {
          include: {
            orderOption: {
              include: {
                menuItem: true,
              },
            },
          },
        },
        ingredients: {
          include: {
            inventory: true,
          },
        },
      },
    })
    return NextResponse.json(boms)
  } catch (error) {
    console.error('Error fetching BOMs:', error)
    return NextResponse.json(
      { error: 'ไม่สามารถดึงข้อมูลสูตรอาหารได้' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, itemId, name, ingredients } = body

    const validIngredients = ingredients.filter(
      (ing: any) => ing.inventoryId && !isNaN(ing.quantity) && ing.quantity > 0
    )

    if (validIngredients.length === 0) {
      return NextResponse.json(
        { error: 'ต้องระบุวัตถุดิบอย่างน้อย 1 รายการ' },
        { status: 400 }
      )
    }

    const bom = await prisma.bOM.create({
      data: {
        name,
        ...(type === 'menu'
          ? { menuItemId: itemId }
          : { optionChoiceId: itemId }),
        ingredients: {
          create: validIngredients.map((ing: any) => ({
            inventoryId: parseInt(ing.inventoryId),
            quantity: parseFloat(ing.quantity),
          })),
        },
      },
      include: {
        menuItem: true,
        optionChoice: {
          include: {
            orderOption: true,
          },
        },
        ingredients: {
          include: {
            inventory: true,
          },
        },
      },
    })

    return NextResponse.json(bom, { status: 201 })
  } catch (error) {
    console.error('Error creating BOM:', error)
    return NextResponse.json(
      { error: 'ไม่สามารถสร้างสูตรอาหารได้' },
      { status: 500 }
    )
  }
}
