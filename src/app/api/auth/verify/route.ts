import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    return NextResponse.json({ role: payload.role })
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
