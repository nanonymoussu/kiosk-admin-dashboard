import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'รหัสสูตรอาหารไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { ingredients } = body

    // Delete existing ingredients
    await prisma.bOMIngredient.deleteMany({
      where: { bomId: id },
    })

    // Create new ingredients
    const updatedBom = await prisma.bOM.update({
      where: { id },
      data: {
        ingredients: {
          create: ingredients.map((ing: any) => ({
            inventoryId: parseInt(ing.inventoryId),
            quantity: parseFloat(ing.quantity),
          })),
        },
      },
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

    return NextResponse.json(updatedBom)
  } catch (error) {
    console.error('Error updating BOM:', error)
    return NextResponse.json(
      { error: 'ไม่สามารถแก้ไขสูตรอาหารได้' },
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
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'รหัสสูตรอาหารไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    // First delete all ingredients related to this BOM
    await prisma.bOMIngredient.deleteMany({
      where: { bomId: id },
    })

    // Then delete the BOM itself
    await prisma.bOM.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'ลบสูตรอาหารเรียบร้อยแล้ว',
    })
  } catch (error) {
    console.error('Error deleting BOM:', error)
    return NextResponse.json(
      { error: 'ไม่สามารถลบสูตรอาหารได้' },
      { status: 500 }
    )
  }
}
