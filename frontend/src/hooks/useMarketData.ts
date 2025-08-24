import { useQuery, useMutation } from '@tanstack/react-query';
import { useMarketStore } from '../store/marketStore';

// Market data queries
export const useMarketSummary = () => {
  const fetchMarketSummary = useMarketStore((state) => state.fetchMarketSummary);

  return useQuery({
    queryKey: ['market-summary'],
    queryFn: async () => {
      await fetchMarketSummary();
      return useMarketStore.getState().marketSummary;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });
};

export const usePopularSymbols = (market: string) => {
  const fetchPopularSymbols = useMarketStore((state) => state.fetchPopularSymbols);

  return useQuery({
    queryKey: ['popular-symbols', market],
    queryFn: () => fetchPopularSymbols(market),
    staleTime: 60 * 60 * 1000, // 1 hour (symbols don't change often)
  });
};

export const useHistoricalData = (symbol: string, period = '6mo') => {
  const fetchHistoricalData = useMarketStore((state) => state.fetchHistoricalData);

  return useQuery({
    queryKey: ['historical-data', symbol, period],
    queryFn: () => fetchHistoricalData(symbol, period),
    enabled: !!symbol,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCurrentPrices = (symbols: string[]) => {
  const fetchCurrentPrices = useMarketStore((state) => state.fetchCurrentPrices);

  return useQuery({
    queryKey: ['current-prices', symbols],
    queryFn: () => fetchCurrentPrices(symbols),
    enabled: symbols.length > 0,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Auto-refresh every minute
  });
};

// Symbol search and validation
export const useSearchSymbols = () => {
  const searchSymbols = useMarketStore((state) => state.searchSymbols);

  return useMutation({
    mutationFn: ({ market, query }: { market: string; query: string }) =>
      searchSymbols(market, query),
  });
};

export const useValidateSymbol = () => {
  const validateSymbol = useMarketStore((state) => state.validateSymbol);

  return useMutation({
    mutationFn: (symbol: string) => validateSymbol(symbol),
  });
};