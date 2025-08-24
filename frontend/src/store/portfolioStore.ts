import { create } from 'zustand';
// Temporary local types to avoid module resolution issues
type Portfolio = {
  id: number;
  name: string;
  description?: string;
  is_default: boolean;
  owner_id: number;
  created_at: string;
  updated_at?: string;
};

type PortfolioWithStats = Portfolio & {
  total_value: number;
  total_invested: number;
  total_pnl: number;
  total_pnl_percentage: number;
  positions_count: number;
};

type PortfolioCreate = {
  name: string;
  description?: string;
  is_default?: boolean;
};

type PortfolioUpdate = {
  name?: string;
  description?: string;
  is_default?: boolean;
};

type Transaction = {
  id: number;
  symbol: string;
  company_name?: string;
  market: string;
  transaction_type: string;
  quantity: number;
  price: number;
  total_amount: number;
  fees?: number;
  notes?: string;
  transaction_date: string;
  portfolio_id: number;
  created_at: string;
  updated_at?: string;
};

type TransactionCreate = {
  symbol: string;
  company_name?: string;
  market: string;
  transaction_type: string;
  quantity: number;
  price: number;
  fees?: number;
  notes?: string;
  transaction_date: string;
  portfolio_id: number;
};

type TransactionUpdate = {
  symbol?: string;
  company_name?: string;
  market?: string;
  transaction_type?: string;
  quantity?: number;
  price?: number;
  fees?: number;
  notes?: string;
  transaction_date?: string;
};
import { portfolioAPI, transactionAPI } from '../services/api';

interface PortfolioState {
  portfolios: PortfolioWithStats[];
  currentPortfolio: PortfolioWithStats | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  // Portfolio actions
  fetchPortfolios: () => Promise<void>;
  fetchPortfolioById: (id: number) => Promise<void>;
  createPortfolio: (data: PortfolioCreate) => Promise<void>;
  updatePortfolio: (id: number, data: PortfolioUpdate) => Promise<void>;
  deletePortfolio: (id: number) => Promise<void>;
  setCurrentPortfolio: (portfolio: PortfolioWithStats | null) => void;
  
  // Transaction actions
  fetchTransactions: (portfolioId: number) => Promise<void>;
  createTransaction: (data: TransactionCreate) => Promise<void>;
  updateTransaction: (id: number, data: TransactionUpdate) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  portfolios: [],
  currentPortfolio: null,
  transactions: [],
  isLoading: false,
  error: null,

  // Portfolio actions
  fetchPortfolios: async () => {
    try {
      set({ isLoading: true, error: null });
      const portfolios = await portfolioAPI.getAll();
      set({ portfolios, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to fetch portfolios',
        isLoading: false 
      });
    }
  },

  fetchPortfolioById: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const portfolio = await portfolioAPI.getById(id);
      set({ currentPortfolio: portfolio, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to fetch portfolio',
        isLoading: false 
      });
    }
  },

  createPortfolio: async (data: PortfolioCreate) => {
    try {
      set({ isLoading: true, error: null });
      await portfolioAPI.create(data);
      
      // Refresh portfolios list
      await get().fetchPortfolios();
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to create portfolio',
        isLoading: false 
      });
      throw error;
    }
  },

  updatePortfolio: async (id: number, data: PortfolioUpdate) => {
    try {
      set({ isLoading: true, error: null });
      await portfolioAPI.update(id, data);
      
      // Refresh portfolios list
      await get().fetchPortfolios();
      
      // Update current portfolio if it's the one being updated
      if (get().currentPortfolio?.id === id) {
        await get().fetchPortfolioById(id);
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to update portfolio',
        isLoading: false 
      });
      throw error;
    }
  },

  deletePortfolio: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await portfolioAPI.delete(id);
      
      // Remove from local state
      const portfolios = get().portfolios.filter(p => p.id !== id);
      set({ portfolios });
      
      // Clear current portfolio if it was deleted
      if (get().currentPortfolio?.id === id) {
        set({ currentPortfolio: null });
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to delete portfolio',
        isLoading: false 
      });
      throw error;
    }
  },

  setCurrentPortfolio: (portfolio: PortfolioWithStats | null) => {
    set({ currentPortfolio: portfolio });
  },

  // Transaction actions
  fetchTransactions: async (portfolioId: number) => {
    try {
      set({ isLoading: true, error: null });
      const transactions = await transactionAPI.getAll(portfolioId);
      set({ transactions, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to fetch transactions',
        isLoading: false 
      });
    }
  },

  createTransaction: async (data: TransactionCreate) => {
    try {
      set({ isLoading: true, error: null });
      await transactionAPI.create(data);
      
      // Refresh transactions and portfolio
      await get().fetchTransactions(data.portfolio_id);
      await get().fetchPortfolioById(data.portfolio_id);
      await get().fetchPortfolios();
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to create transaction',
        isLoading: false 
      });
      throw error;
    }
  },

  updateTransaction: async (id: number, data: TransactionUpdate) => {
    try {
      set({ isLoading: true, error: null });
      await transactionAPI.update(id, data);
      
      // Refresh transactions and portfolio
      const currentPortfolio = get().currentPortfolio;
      if (currentPortfolio) {
        await get().fetchTransactions(currentPortfolio.id);
        await get().fetchPortfolioById(currentPortfolio.id);
        await get().fetchPortfolios();
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to update transaction',
        isLoading: false 
      });
      throw error;
    }
  },

  deleteTransaction: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await transactionAPI.delete(id);
      
      // Refresh transactions and portfolio
      const currentPortfolio = get().currentPortfolio;
      if (currentPortfolio) {
        await get().fetchTransactions(currentPortfolio.id);
        await get().fetchPortfolioById(currentPortfolio.id);
        await get().fetchPortfolios();
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to delete transaction',
        isLoading: false 
      });
      throw error;
    }
  },

  // Utility actions
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));