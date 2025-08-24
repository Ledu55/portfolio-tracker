import { create } from 'zustand';
// Commenting out problematic imports temporarily
// import { 
//   MarketSummary, 
//   SymbolValidation
// } from '../types';
import { marketAPI } from '../services/api';

// Temporary local type definitions
type CurrentPrices = { [symbol: string]: number | null };
type HistoricalData = {
  dates: string[];
  prices: number[];
  volumes: number[];
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

interface MarketState {
  marketSummary: MarketSummary | null;
  popularSymbols: Record<string, Record<string, string>>;
  currentPrices: CurrentPrices;
  historicalData: Record<string, HistoricalData>;
  symbolValidations: Record<string, SymbolValidation>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchMarketSummary: () => Promise<void>;
  fetchPopularSymbols: (market: string) => Promise<string[]>;
  searchSymbols: (market: string, query: string) => Promise<string[]>;
  validateSymbol: (symbol: string) => Promise<SymbolValidation>;
  fetchCurrentPrices: (symbols: string[]) => Promise<void>;
  fetchHistoricalData: (symbol: string, period?: string) => Promise<void>;
  
  // Cache management
  clearCache: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  marketSummary: null,
  popularSymbols: {},
  currentPrices: {},
  historicalData: {},
  symbolValidations: {},
  isLoading: false,
  error: null,

  fetchMarketSummary: async () => {
    try {
      set({ isLoading: true, error: null });
      const { market_summary } = await marketAPI.getMarketSummary();
      set({ marketSummary: market_summary, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to fetch market summary',
        isLoading: false 
      });
    }
  },

  fetchPopularSymbols: async (market: string) => {
    try {
      const state = get();
      
      // Check cache first
      if (state.popularSymbols[market]) {
        return Object.keys(state.popularSymbols[market]);
      }
      
      set({ isLoading: true, error: null });
      const { symbols } = await marketAPI.getPopularSymbols(market);
      
      set({ 
        popularSymbols: {
          ...state.popularSymbols,
          [market]: symbols
        },
        isLoading: false 
      });
      
      return Object.keys(symbols);
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to fetch popular symbols',
        isLoading: false 
      });
      return [];
    }
  },

  searchSymbols: async (market: string, query: string) => {
    try {
      set({ error: null });
      const { symbols } = await marketAPI.searchSymbols(market, query);
      return symbols;
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to search symbols' });
      return [];
    }
  },

  validateSymbol: async (symbol: string) => {
    try {
      const state = get();
      
      // Check cache first
      if (state.symbolValidations[symbol]) {
        return state.symbolValidations[symbol];
      }
      
      set({ isLoading: true, error: null });
      const validation = await marketAPI.validateSymbol(symbol);
      
      set({ 
        symbolValidations: {
          ...state.symbolValidations,
          [symbol]: validation
        },
        isLoading: false 
      });
      
      return validation;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to validate symbol',
        isLoading: false 
      });
      throw error;
    }
  },

  fetchCurrentPrices: async (symbols: string[]) => {
    try {
      set({ isLoading: true, error: null });
      const { prices } = await marketAPI.getCurrentPrices(symbols);
      
      set({ 
        currentPrices: {
          ...get().currentPrices,
          ...prices
        },
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to fetch current prices',
        isLoading: false 
      });
    }
  },

  fetchHistoricalData: async (symbol: string, period = '6mo') => {
    try {
      const state = get();
      const cacheKey = `${symbol}_${period}`;
      
      // Check cache first
      if (state.historicalData[cacheKey]) {
        return;
      }
      
      set({ isLoading: true, error: null });
      const data = await marketAPI.getHistoricalData(symbol, period);
      
      set({ 
        historicalData: {
          ...state.historicalData,
          [cacheKey]: data
        },
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to fetch historical data',
        isLoading: false 
      });
    }
  },

  clearCache: () => {
    set({
      popularSymbols: {},
      currentPrices: {},
      historicalData: {},
      symbolValidations: {},
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));