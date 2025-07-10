import { Language } from '../types';

export const LANGUAGES: Language[] = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export const API_ENDPOINTS = {
  CRYPTO_PRICES: 'https://api.coingecko.com/api/v3/coins/markets',
  BYBIT_TICKER: 'https://api.bybit.com/v5/market/tickers',
  EXCHANGE_RATES: 'https://api.exchangerate-api.com/v4/latest/USD',
};

export const POPULAR_CRYPTOCURRENCIES = [
  'bitcoin',
  'ethereum',
  'binancecoin',
  'cardano',
  'solana',
  'polkadot',
  'dogecoin',
  'shiba-inu',
  'polygon',
  'avalanche-2',
];

export const TRADING_PAIRS = [
  'BTCUSDT',
  'ETHUSDT',
  'BNBUSDT',
  'ADAUSDT',
  'SOLUSDT',
  'DOTUSDT',
  'DOGEUSDT',
  'SHIBUSDT',
  'MATICUSDT',
  'AVAXUSDT',
];

export const CHART_INTERVALS = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '1d', value: '1d' },
  { label: '1w', value: '1w' },
  { label: '1M', value: '1M' },
];

export const THEME_COLORS = {
  primary: '#3b82f6',
  secondary: '#1e293b',
  accent: '#10b981',
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: '#334155',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};