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
        { error: 'รหัสวัตถุดิบไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, quantity, unit, reorderPoint } = body

    const item = await prisma.inventoryItem.update({
      where: { id },
      data: {
        name,
        quantity: parseFloat(quantity),
        unit,
        reorderPoint: parseFloat(reorderPoint),
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating inventory item:', error)
    return NextResponse.json(
      { error: 'ไม่สามารถแก้ไขข้อมูลวัตถุดิบได้' },
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
        { error: 'รหัสวัตถุดิบไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    await prisma.inventoryItem.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'ลบข้อมูลวัตถุดิบเรียบร้อยแล้ว' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting inventory item:', error)
    return NextResponse.json(
      { error: 'ไม่สามารถลบข้อมูลวัตถุดิบได้' },
      { status: 500 }
    )
  }
}
