import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'
import { userSchema } from '@/lib/validators/schema'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, password, name, email } = userSchema.parse(body)
    
    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'Username already exists' },
        { status: 400 }
      )
    }

    // Check if email is taken if provided
    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email }
      })
      
      if (existingEmail) {
        return NextResponse.json(
          { message: 'Email already registered' },
          { status: 400 }
        )
      }
    }
    
    const hashedPassword = await hash(password, 12)
    
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        email,
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
      }
    })
    
    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: error.message || 'Something went wrong' },
      { status: 400 }
    )
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
      }
    })
    
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}