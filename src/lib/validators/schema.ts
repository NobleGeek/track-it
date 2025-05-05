import { z } from 'zod'

export const userSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(255),
  name: z.string().max(50).optional(),
  email: z.string().email().optional(),
})

export const budgetSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  totalLimit: z.number().positive(),
})

export const transactionSchema = z.object({
  amount: z.number().positive(),
  isExpense: z.boolean(),
  category: z.string().max(50).optional(),
  description: z.string().optional(),
  budgetId: z.number().optional(),
})