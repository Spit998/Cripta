export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  isVerified: boolean;
  avatar?: string;
}

export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  marketCap: number;
  volume24h: number;
  rank: number;
  image: string;
  lastUpdated: Date;
  description?: string;
  totalSupply?: number;
  circulatingSupply?: number;
  allTimeHigh?: number;
  allTimeLow?: number;
}

export interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
}

export interface ChartData {
  timestamp: Date;
  price: number;
  date: string;
  time: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  assets: PortfolioAsset[];
  totalValue: number;
  totalChange24h: number;
}

export interface PortfolioAsset {
  symbol: string;
  name: string;
  amount: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  change24h: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price: number;
  total: number;
  fee: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}

export interface PriceAlert {
  id: string;
  userId: string;
  symbol: string;
  type: 'above' | 'below';
  price: number;
  isActive: boolean;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
}