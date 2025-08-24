import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usePortfolioStore } from '../store/portfolioStore';
// Temporary local types to avoid module resolution issues
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

// Portfolio queries
export const usePortfolios = () => {
  const fetchPortfolios = usePortfolioStore((state) => state.fetchPortfolios);

  return useQuery({
    queryKey: ['portfolios'],
    queryFn: async () => {
      await fetchPortfolios();
      return usePortfolioStore.getState().portfolios;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePortfolio = (id: number | undefined) => {
  const fetchPortfolioById = usePortfolioStore((state) => state.fetchPortfolioById);

  return useQuery({
    queryKey: ['portfolio', id],
    queryFn: async () => {
      await fetchPortfolioById(id!);
      return usePortfolioStore.getState().currentPortfolio;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Portfolio mutations
export const useCreatePortfolio = () => {
  const queryClient = useQueryClient();
  const createPortfolio = usePortfolioStore((state) => state.createPortfolio);

  return useMutation({
    mutationFn: (data: PortfolioCreate) => createPortfolio(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
};

export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();
  const updatePortfolio = usePortfolioStore((state) => state.updatePortfolio);

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PortfolioUpdate }) => 
      updatePortfolio(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio', id] });
    },
  });
};

export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();
  const deletePortfolio = usePortfolioStore((state) => state.deletePortfolio);

  return useMutation({
    mutationFn: (id: number) => deletePortfolio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
};

// Transaction queries
export const useTransactions = (portfolioId: number | undefined) => {
  const fetchTransactions = usePortfolioStore((state) => state.fetchTransactions);

  return useQuery({
    queryKey: ['transactions', portfolioId],
    queryFn: async () => {
      await fetchTransactions(portfolioId!);
      return usePortfolioStore.getState().transactions;
    },
    enabled: !!portfolioId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Transaction mutations
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const createTransaction = usePortfolioStore((state) => state.createTransaction);

  return useMutation({
    mutationFn: (data: TransactionCreate) => createTransaction(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio', data.portfolio_id] });
      queryClient.invalidateQueries({ queryKey: ['transactions', data.portfolio_id] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const updateTransaction = usePortfolioStore((state) => state.updateTransaction);
  const currentPortfolio = usePortfolioStore((state) => state.currentPortfolio);

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TransactionUpdate }) => 
      updateTransaction(id, data),
    onSuccess: () => {
      if (currentPortfolio) {
        queryClient.invalidateQueries({ queryKey: ['portfolios'] });
        queryClient.invalidateQueries({ queryKey: ['portfolio', currentPortfolio.id] });
        queryClient.invalidateQueries({ queryKey: ['transactions', currentPortfolio.id] });
      }
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const deleteTransaction = usePortfolioStore((state) => state.deleteTransaction);
  const currentPortfolio = usePortfolioStore((state) => state.currentPortfolio);

  return useMutation({
    mutationFn: (id: number) => deleteTransaction(id),
    onSuccess: () => {
      if (currentPortfolio) {
        queryClient.invalidateQueries({ queryKey: ['portfolios'] });
        queryClient.invalidateQueries({ queryKey: ['portfolio', currentPortfolio.id] });
        queryClient.invalidateQueries({ queryKey: ['transactions', currentPortfolio.id] });
      }
    },
  });
};