'use client'

import { BudgetCard } from "@/components/shared/BudgetCard"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BudgetForm } from "@/components/forms/BudgetForm"
import { TransactionForm } from "@/components/forms/TransactionForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

async function getBudgets() {
  const res = await fetch('/api/budgets')
  if (!res.ok) throw new Error('Failed to fetch budgets')
  return res.json()
}

async function getTransactions() {
  const res = await fetch('/api/transactions')
  if (!res.ok) throw new Error('Failed to fetch transactions')
  return res.json()
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const { data: budgets = [], isLoading: isLoadingBudgets } = useQuery({
    queryKey: ['budgets'],
    queryFn: getBudgets,
  })

  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  })

  const handleAddBudget = async (data: any) => {
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create budget')
      }
      
      await queryClient.invalidateQueries({ queryKey: ['budgets'] })
      toast.success('Budget created successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create budget')
      console.error('Error creating budget:', error)
    }
  }

  const handleAddTransaction = async (data: any) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create transaction')
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['budgets'] }),
      ])
      toast.success('Transaction added successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to add transaction')
      console.error('Error creating transaction:', error)
    }
  }

  const handleDeleteTransaction = async (id: number) => {
    try {
      const res = await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to delete transaction')
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['budgets'] }),
      ])
      toast.success('Transaction deleted successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete transaction')
      console.error('Error deleting transaction:', error)
    }
  }

  return (
    <div>
      <main className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Budget</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Budget</DialogTitle>
                </DialogHeader>
                <BudgetForm onSubmit={handleAddBudget} />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Transaction</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                </DialogHeader>
                <TransactionForm 
                  onSubmit={handleAddTransaction} 
                  budgets={budgets.map((b: any) => ({ 
                    id: b.id, 
                    name: b.name 
                  }))} 
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoadingBudgets ? (
          <div className="text-center py-8">Loading budgets...</div>
        ) : budgets.length === 0 ? (
          <Card className="mb-8">
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                No budgets yet. Create your first budget to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {budgets.map((budget: any) => (
              <BudgetCard
                key={budget.id}
                name={budget.name}
                description={budget.description}
                totalLimit={Number(budget.totalLimit)}
                totalSpent={budget.totalSpent}
                progress={budget.progress}
              />
            ))}
          </div>
        )}

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingTransactions ? (
                <div className="text-center py-4">Loading transactions...</div>
              ) : transactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No transactions yet. Add your first transaction to get started!
                </p>
              ) : (
                <div className="space-y-2">
                  {transactions.map((transaction: any) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">
                          {transaction.description || 'Untitled Transaction'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.category || 'Uncategorized'} •{' '}
                          {new Date(transaction.transactionDate).toLocaleDateString()}
                          {transaction.budget && (
                            <> • Budget: {transaction.budget.name}</>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={transaction.isExpense ? 'text-red-500' : 'text-green-500'}>
                          {transaction.isExpense ? '-' : '+'}${Number(transaction.amount).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}