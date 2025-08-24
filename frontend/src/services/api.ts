import axios from 'axios';
// Temporary: Import all types as namespace to avoid module resolution issues
// import * as Types from '../types';

// Temporary local type definitions (to avoid module resolution issues)
type User = {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
};

type UserCreate = {
  email: string;
  username: string;
  full_name?: string;
  password: string;
  is_active?: boolean;
};

type LoginRequest = {
  username: string;
  password: string;
};

type Token = {
  access_token: string;
  token_type: string;
};

type Portfolio = {
  id: number;
  name: string;
  description?: string;
  is_default: boolean;
  owner_id: number;
  created_at: string;
  updated_at?: string;
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

type PortfolioWithStats = Portfolio & {
  total_value: number;
  total_invested: number;
  total_pnl: number;
  total_pnl_percentage: number;
  positions_count: number;
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

type MarketSummary = {
  [market: string]: {
    current: number;
    change: number;
    change_percentage: number;
  };
};

type SymbolValidation = {
  symbol: string;
  company_name: string;
  current_price: number;
  is_valid: boolean;
};

type HistoricalData = {
  dates: string[];
  prices: number[];
  volumes: number[];
};

type CurrentPrices = { [symbol: string]: number | null };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<Token> => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  register: async (data: UserCreate): Promise<User> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

// Portfolio API
export const portfolioAPI = {
  getAll: async (): Promise<PortfolioWithStats[]> => {
    const response = await api.get('/portfolios');
    return response.data;
  },

  getById: async (id: number): Promise<PortfolioWithStats> => {
    const response = await api.get(`/portfolios/${id}`);
    return response.data;
  },

  create: async (data: PortfolioCreate): Promise<Portfolio> => {
    const response = await api.post('/portfolios', data);
    return response.data;
  },

  update: async (id: number, data: PortfolioUpdate): Promise<Portfolio> => {
    const response = await api.put(`/portfolios/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/portfolios/${id}`);
  },
};

// Transaction API
export const transactionAPI = {
  getAll: async (portfolioId: number, skip = 0, limit = 100): Promise<Transaction[]> => {
    const response = await api.get('/transactions', {
      params: { portfolio_id: portfolioId, skip, limit },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: TransactionCreate): Promise<Transaction> => {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  update: async (id: number, data: TransactionUpdate): Promise<Transaction> => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};

// Market Data API
export const marketAPI = {
  searchSymbols: async (market: string, query = ''): Promise<{ symbols: string[] }> => {
    const response = await api.get('/market/symbols/search', {
      params: { market, query },
    });
    return response.data;
  },

  validateSymbol: async (symbol: string): Promise<SymbolValidation> => {
    const response = await api.get(`/market/symbols/validate/${symbol}`);
    return response.data;
  },

  getCurrentPrices: async (symbols: string[]): Promise<{ prices: CurrentPrices }> => {
    const response = await api.post('/market/prices/current', symbols);
    return response.data;
  },

  getHistoricalData: async (symbol: string, period = '6mo'): Promise<HistoricalData> => {
    const response = await api.get(`/market/prices/historical/${symbol}`, {
      params: { period },
    });
    return response.data;
  },

  getMarketSummary: async (): Promise<{ market_summary: MarketSummary }> => {
    const response = await api.get('/market/market/summary');
    return response.data;
  },

  getPopularSymbols: async (market: string): Promise<{ symbols: Record<string, string> }> => {
    const response = await api.get('/market/symbols/popular', {
      params: { market },
    });
    return response.data;
  },
};

export default api;