import { Transaction, Portfolio, PortfolioAsset } from '../types';
import { authService } from './authService';

class TradingService {
  private transactions: Transaction[] = [];
  private portfolio: Portfolio = {
    id: 'user-portfolio',
    userId: 'current-user',
    assets: [],
    totalValue: 10000, // Starting balance
    totalChange24h: 0,
  };
  private currentUserId: string = 'current-user';

  constructor() {
    this.loadFromStorage();
  }

  setCurrentUser(userId: string) {
    this.currentUserId = userId;
    this.loadFromStorage();
  }

  private saveToStorage() {
    localStorage.setItem(`trading_transactions_${this.currentUserId}`, JSON.stringify(this.transactions));
    localStorage.setItem(`trading_portfolio_${this.currentUserId}`, JSON.stringify(this.portfolio));
  }

  private loadFromStorage() {
    const savedTransactions = localStorage.getItem(`trading_transactions_${this.currentUserId}`);
    const savedPortfolio = localStorage.getItem(`trading_portfolio_${this.currentUserId}`);

    if (savedTransactions) {
      this.transactions = JSON.parse(savedTransactions);
    } else {
      this.transactions = [];
    }

    if (savedPortfolio) {
      this.portfolio = JSON.parse(savedPortfolio);
    } else {
      // Initialize with 0 USDT balance - will be updated after auth service is ready
      this.portfolio.assets = [{
        symbol: 'USDT',
        name: 'Tether USD',
        amount: 0,
        avgPrice: 1,
        currentPrice: 1,
        value: 0,
        change24h: 0,
      }];
      this.portfolio.totalValue = 0;
      this.portfolio.userId = this.currentUserId;
    }
  }

  updateUserBalance(userId: string, newBalance: number) {
    if (userId === this.currentUserId) {
      const usdtAsset = this.portfolio.assets.find(asset => asset.symbol === 'USDT');
      if (usdtAsset) {
        usdtAsset.amount = newBalance;
        usdtAsset.value = newBalance;
        this.updatePortfolioValue();
        this.saveToStorage();
      }
    }
  }

  async executeTrade(
    type: 'buy' | 'sell',
    symbol: string,
    amount: number,
    price: number,
    cryptoName: string
  ): Promise<{ success: boolean; message: string; transaction?: Transaction }> {
    const total = amount * price;
    const fee = total * 0.001; // 0.1% fee
    const totalWithFee = type === 'buy' ? total + fee : total - fee;

    // Check if user has enough balance
    const usdtAsset = this.portfolio.assets.find(asset => asset.symbol === 'USDT');
    const cryptoAsset = this.portfolio.assets.find(asset => asset.symbol === symbol);

    if (type === 'buy') {
      if (!usdtAsset || usdtAsset.amount < totalWithFee) {
        return { success: false, message: 'Insufficient USDT balance' };
      }

      // Deduct USDT
      usdtAsset.amount -= totalWithFee;
      usdtAsset.value = usdtAsset.amount * usdtAsset.currentPrice;

      // Add or update crypto asset
      if (cryptoAsset) {
        const newTotalAmount = cryptoAsset.amount + amount;
        cryptoAsset.avgPrice = ((cryptoAsset.avgPrice * cryptoAsset.amount) + (price * amount)) / newTotalAmount;
        cryptoAsset.amount = newTotalAmount;
        cryptoAsset.currentPrice = price;
        cryptoAsset.value = cryptoAsset.amount * price;
      } else {
        this.portfolio.assets.push({
          symbol,
          name: cryptoName,
          amount,
          avgPrice: price,
          currentPrice: price,
          value: amount * price,
          change24h: 0,
        });
      }
    } else {
      if (!cryptoAsset || cryptoAsset.amount < amount) {
        return { success: false, message: `Insufficient ${symbol} balance` };
      }

      // Deduct crypto
      cryptoAsset.amount -= amount;
      cryptoAsset.value = cryptoAsset.amount * cryptoAsset.currentPrice;

      // Add USDT
      if (usdtAsset) {
        usdtAsset.amount += totalWithFee;
        usdtAsset.value = usdtAsset.amount * usdtAsset.currentPrice;
      }

      // Remove asset if amount is 0
      if (cryptoAsset.amount === 0) {
        this.portfolio.assets = this.portfolio.assets.filter(asset => asset.symbol !== symbol);
      }
    }

    // Create transaction record
    const transaction: Transaction = {
      id: Date.now().toString(),
      userId: this.currentUserId,
      type,
      symbol,
      amount,
      price,
      total,
      fee,
      status: 'completed',
      timestamp: new Date(),
    };

    this.transactions.unshift(transaction);
    this.updatePortfolioValue();
    
    // Update user balance in auth service
    const currentUsdtAsset = this.portfolio.assets.find(asset => asset.symbol === 'USDT');
    if (currentUsdtAsset) {
      authService.updateUserBalance(this.currentUserId, currentUsdtAsset.amount);
    }
    
    this.saveToStorage();

    return { 
      success: true, 
      message: `${type === 'buy' ? 'Bought' : 'Sold'} ${amount} ${symbol} successfully`,
      transaction 
    };
  }

  private updatePortfolioValue() {
    this.portfolio.totalValue = this.portfolio.assets.reduce((sum, asset) => sum + asset.value, 0);
  }

  getPortfolio(): Portfolio {
    return { ...this.portfolio };
  }

  getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  updateAssetPrices(cryptoPrices: any[]) {
    this.portfolio.assets.forEach(asset => {
      if (asset.symbol === 'USDT') return;
      
      const cryptoData = cryptoPrices.find(crypto => 
        crypto.symbol.toUpperCase() === asset.symbol
      );
      
      if (cryptoData) {
        asset.currentPrice = cryptoData.price;
        asset.value = asset.amount * cryptoData.price;
        asset.change24h = cryptoData.priceChangePercent24h;
      }
    });
    
    this.updatePortfolioValue();
    this.saveToStorage();
  }

  getBalance(symbol: string): number {
    const asset = this.portfolio.assets.find(asset => asset.symbol === symbol);
    return asset ? asset.amount : 0;
  }
}

export const tradingService = new TradingService();