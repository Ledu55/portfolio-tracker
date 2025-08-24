// User types
export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface UserCreate {
  email: string;
  username: string;
  full_name?: string;
  password: string;
  is_active?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// Portfolio types
export interface Portfolio {
  id: number;
  name: string;
  description?: string;
  is_default: boolean;
  owner_id: number;
  created_at: string;
  updated_at?: string;
  positions?: Position[];
}

export interface PortfolioCreate {
  name: string;
  description?: string;
  is_default?: boolean;
}

export interface PortfolioUpdate {
  name?: string;
  description?: string;
  is_default?: boolean;
}

export interface PortfolioWithStats extends Portfolio {
  total_value: number;
  total_invested: number;
  total_pnl: number;
  total_pnl_percentage: number;
  positions_count: number;
}

// Position types
export interface Position {
  id: number;
  symbol: string;
  company_name?: string;
  market: string;
  quantity: number;
  average_price: number;
  total_invested: number;
  portfolio_id: number;
  created_at: string;
  updated_at?: string;
}

// Transaction types
export const TransactionType = {
  BUY: "buy" as const,
  SELL: "sell" as const,
  DIVIDEND: "dividend" as const,
  SPLIT: "split" as const,
};

export type TransactionTypeValue = typeof TransactionType[keyof typeof TransactionType];

export interface Transaction {
  id: number;
  symbol: string;
  company_name?: string;
  market: string;
  transaction_type: TransactionTypeValue;
  quantity: number;
  price: number;
  total_amount: number;
  fees?: number;
  notes?: string;
  transaction_date: string;
  portfolio_id: number;
  created_at: string;
  updated_at?: string;
}

export interface TransactionCreate {
  symbol: string;
  company_name?: string;
  market: string;
  transaction_type: TransactionTypeValue;
  quantity: number;
  price: number;
  fees?: number;
  notes?: string;
  transaction_date: string;
  portfolio_id: number;
}

export interface TransactionUpdate {
  symbol?: string;
  company_name?: string;
  market?: string;
  transaction_type?: TransactionTypeValue;
  quantity?: number;
  price?: number;
  fees?: number;
  notes?: string;
  transaction_date?: string;
}

// Market data types
export interface MarketSummary {
  [market: string]: {
    current: number;
    change: number;
    change_percentage: number;
  };
}

export interface SymbolValidation {
  symbol: string;
  company_name: string;
  current_price: number;
  is_valid: boolean;
}

export interface HistoricalData {
  dates: string[];
  prices: number[];
  volumes: number[];
}

export interface CurrentPrices {
  [symbol: string]: number | null;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  detail?: string;
}

// Chart data types
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface PieChartDataPoint {
  name: string;
  value: number;
  color?: string;
}