import { useQuery } from 'react-query';
import { cryptoService } from '../services/cryptoService';

export const useCryptoPrices = () => {
  return useQuery(
    'cryptoPrices',
    cryptoService.getCryptoPrices,
    {
      refetchInterval: 120000, // Refetch every 2 minutes instead of 1
      staleTime: 60000, // Consider data stale after 1 minute
      retry: 2, // Reduce retries
      retryDelay: 2000, // Fixed delay instead of exponential
      cacheTime: 300000, // Cache for 5 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: false, // Don't refetch on component mount if data exists
    }
  );
};

export const useBybitTickers = () => {
  return useQuery(
    'bybitTickers',
    cryptoService.getBybitTickers,
    {
      refetchInterval: 60000, // Refetch every 1 minute
      staleTime: 30000, // Consider data stale after 30 seconds
      retry: 2, // Reduce retries
      retryDelay: 2000, // Fixed delay
      cacheTime: 300000, // Cache for 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
};

export const useCoinDetail = (id: string) => {
  return useQuery(
    ['coinDetail', id],
    () => cryptoService.getCryptoDetails(id),
    {
      enabled: !!id,
      staleTime: 60000, // 1 minute
      cacheTime: 300000, // 5 minutes
      retry: 2,
      retryDelay: 2000,
      refetchOnWindowFocus: false,
    }
  );
};

export const useCoinChart = (id: string, days: number) => {
  return useQuery(
    ['coinChart', id, days],
    () => cryptoService.getCryptoChart(id, days),
    {
      enabled: !!id,
      staleTime: 120000, // 2 minutes for chart data
      cacheTime: 600000, // 10 minutes
      retry: 1, // Only retry once for chart data
      retryDelay: 3000,
      refetchOnWindowFocus: false,
    }
  );
};