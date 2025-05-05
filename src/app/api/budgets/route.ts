import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { budgetSchema } from '@/lib/validators/schema'
import type { Prisma } from '.prisma/client'

type BudgetWithTransactions = Prisma.BudgetGetPayload<{
  include: {
    transactions: {
      select: {
        amount: true
        isExpense: true
      }
    }
  }
}>

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, description, totalLimit } = budgetSchema.parse(body)
    const userId = parseInt(req.headers.get('x-user-id') || '')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const budget = await prisma.budget.create({
      data: {
        name,
        description,
        totalLimit,
        userId,
      },
    })
    
    return NextResponse.json(budget)
  } catch (error: any) {
    console.error('Budget creation error:', error)
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
    
    const budgets = await prisma.budget.findMany({
      where: {
        userId,
      },
      include: {
        transactions: {
          select: {
            amount: true,
            isExpense: true,
          },
        },
      },
    })
    
    const budgetsWithProgress = budgets.map((budget: BudgetWithTransactions) => {
      const totalSpent = budget.transactions.reduce((acc: number, transaction: { amount: number | Prisma.Decimal; isExpense: boolean }) => {
        if (transaction.isExpense) {
          return acc + Number(transaction.amount)
        }
        return acc
      }, 0)
      
      return {
        ...budget,
        progress: (totalSpent / Number(budget.totalLimit)) * 100,
        totalSpent,
        _count: {
          transactions: budget.transactions.length,
        },
      }
    })
    
    return NextResponse.json(budgetsWithProgress)
  } catch (error: any) {
    console.error('Budget fetch error:', error)
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
        { error: !userId ? 'Unauthorized' : 'Budget ID is required' },
        { status: !userId ? 401 : 400 }
      )
    }
    
    // Verify budget belongs to user
    const budget = await prisma.budget.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
    })
    
    if (!budget) {
      return NextResponse.json(
        { error: 'Budget not found or unauthorized' },
        { status: 404 }
      )
    }
    
    // Delete all associated transactions first
    await prisma.transaction.deleteMany({
      where: {
        budgetId: parseInt(id),
      },
    })
    
    // Then delete the budget
    await prisma.budget.delete({
      where: {
        id: parseInt(id),
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Budget deletion error:', error)
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}