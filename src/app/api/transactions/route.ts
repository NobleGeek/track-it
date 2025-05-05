import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { transactionSchema } from '@/lib/validators/schema'
import type { Prisma } from '.prisma/client'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { amount, isExpense, category, description, budgetId } = transactionSchema.parse(body)
    const userId = parseInt(req.headers.get('x-user-id') || '')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    if (budgetId) {
      // Verify budget exists and belongs to user
      const budget = await prisma.budget.findFirst({
        where: {
          id: budgetId,
          userId,
        },
      })
      
      if (!budget) {
        return NextResponse.json(
          { error: 'Budget not found or unauthorized' },
          { status: 404 }
        )
      }

      // Calculate current budget usage
      const transactions = await prisma.transaction.findMany({
        where: {
          budgetId,
          isExpense: true,
        },
        select: {
          amount: true,
        },
      })

      const currentTotal = transactions.reduce((acc: number, t: { amount: number | Prisma.Decimal }) => acc + Number(t.amount), 0)
      const newTotal = currentTotal + Number(amount)

      if (isExpense && newTotal > Number(budget.totalLimit)) {
        return NextResponse.json(
          { error: 'This transaction would exceed the budget limit' },
          { status: 400 }
        )
      }
    }
    
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        transactionDate: new Date(), // Use current time
        isExpense,
        category,
        description,
        userId,
        budgetId,
      },
      include: {
        budget: {
          select: {
            name: true,
          },
        },
      },
    })
    
    return NextResponse.json(transaction)
  } catch (error: any) {
    console.error('Transaction creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 400 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const userId = parseInt(req.headers.get('x-user-id') || '')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(req.url)
    const budgetId = searchParams.get('budgetId')
    const limit = Number(searchParams.get('limit')) || 10
    
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        ...(budgetId ? { budgetId: parseInt(budgetId) } : {}),
      },
      include: {
        budget: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        transactionDate: 'desc',
      },
      take: limit,
    })
    
    return NextResponse.json(transactions)
  } catch (error: any) {
    console.error('Transaction fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = parseInt(req.headers.get('x-user-id') || '')
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!userId || !id) {
      return NextResponse.json(
        { error: !userId ? 'Unauthorized' : 'Transaction ID is required' },
        { status: !userId ? 401 : 400 }
      )
    }
    
    // Verify transaction belongs to user
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
    })
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found or unauthorized' },
        { status: 404 }
      )
    }
    
    await prisma.transaction.delete({
      where: {
        id: parseInt(id),
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Transaction deletion error:', error)
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}