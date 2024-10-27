import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const TRANSACTIONS_FILE = join(process.cwd(), 'src/data/transactions.json');
const CATEGORIES_FILE = join(process.cwd(), 'src/data/categories.json');

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const financeService = {
  getAllTransactions(): Transaction[] {
    const data = JSON.parse(readFileSync(TRANSACTIONS_FILE, 'utf-8'));
    return data.transactions;
  },

  getTransactionsByDateRange(startDate: string, endDate: string): Transaction[] {
    const transactions = this.getAllTransactions();
    return transactions.filter(t => {
      const date = new Date(t.date);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });
  },

  addTransaction(transaction: Omit<Transaction, 'id'>): Transaction {
    const transactions = this.getAllTransactions();
    const newTransaction = {
      ...transaction,
      id: `t${Date.now()}`,
    };
    
    transactions.push(newTransaction);
    writeFileSync(TRANSACTIONS_FILE, JSON.stringify({ transactions }, null, 2));
    return newTransaction;
  },

  getCategories(): { expense: Category[]; income: Category[] } {
    const data = JSON.parse(readFileSync(CATEGORIES_FILE, 'utf-8'));
    return data.categories;
  },

  calculateBalance(): number {
    const transactions = this.getAllTransactions();
    return transactions.reduce((acc, t) => {
      return acc + (t.type === 'income' ? t.amount : -t.amount);
    }, 0);
  },

  getMonthlyAnalytics(year: number, month: number) {
    const transactions = this.getAllTransactions();
    const monthlyTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });

    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses,
      profit: income - expenses,
      transactionCount: monthlyTransactions.length,
    };
  },

  getCategoryBreakdown(type: 'income' | 'expense'): Record<string, number> {
    const transactions = this.getAllTransactions()
      .filter(t => t.type === type);

    return transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
  }
};