import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'ไม่สามารถดึงข้อมูลวัตถุดิบได้' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, quantity, unit, reorderPoint } = body

    if (!name || !unit) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    const item = await prisma.inventoryItem.create({
      data: {
        name,
        quantity: parseFloat(quantity),
        unit,
        reorderPoint: parseFloat(reorderPoint),
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating inventory item:', error)
    return NextResponse.json(
      { error: 'ไม่สามารถเพิ่มข้อมูลวัตถุดิบได้' },
      { status: 500 }
    )
  }
}
