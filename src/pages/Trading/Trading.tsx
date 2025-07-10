import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useBybitTickers } from '../../hooks/useCryptoPrices';
import { tradingService } from '../../services/tradingService';

const Trading: React.FC = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { data: tickers, isLoading } = useBybitTickers();
  const [selectedPair, setSelectedPair] = useState('BTCUSDT');
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  // Update price when selected pair changes
  React.useEffect(() => {
    if (tickers && selectedPair) {
      const selectedTicker = tickers.find(t => t.symbol === selectedPair);
      if (selectedTicker) {
        setPrice(selectedTicker.price.toFixed(2));
      }
    }
  }, [selectedPair, tickers]);

  const handleOrder = () => {
    if (!amount || !price) return;

    const symbol = selectedPair.replace('USDT', '');
    const selectedTicker = tickers?.find(t => t.symbol === selectedPair);
    
    if (selectedTicker) {
      tradingService.executeTrade(
        orderType,
        symbol,
        parseFloat(amount),
        parseFloat(price),
        selectedTicker.baseAsset
      ).then(result => {
        if (result.success) {
          alert(result.message);
          setAmount('');
          setPrice('');
        } else {
          alert(result.message);
        }
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t('trading')}
        </h1>
        <div className="flex items-center space-x-2">
          <BarChart3 className={`h-5 w-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
            {t('advanced_trading')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trading Pairs */}
        <div className="lg:col-span-1">
          <div className={`rounded-lg p-6 border ${
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('trading_pairs')}
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className={`h-12 rounded animate-pulse ${
                      isDark ? 'bg-slate-700' : 'bg-slate-100'
                    }`}></div>
                  ))}
                </div>
              ) : (
                tickers?.map((ticker) => (
                  <div
                    key={ticker.symbol}
                    onClick={() => setSelectedPair(ticker.symbol)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedPair === ticker.symbol
                        ? 'bg-blue-600 text-white'
                        : isDark
                          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{ticker.symbol}</div>
                        <div className="text-sm opacity-75">{ticker.baseAsset}/USDT</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${ticker.price.toLocaleString()}</div>
                        <div className={`text-sm ${
                          ticker.priceChange24h > 0 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {ticker.priceChange24h > 0 ? '+' : ''}{ticker.priceChange24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chart & Order Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Chart Placeholder */}
          <div className={`rounded-lg p-6 border ${
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {selectedPair}
              </h2>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <span className="text-green-400 font-medium">+2.34%</span>
              </div>
            </div>
            <div className={`h-64 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-slate-700' : 'bg-slate-100'
            }`}>
              <div className="text-center">
                <BarChart3 className={`h-16 w-16 mx-auto mb-2 ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`} />
                <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  {t('chart_placeholder')}
                </p>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div className={`rounded-lg p-6 border ${
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('place_order')}
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                onClick={() => setOrderType('buy')}
                className={`p-3 rounded-lg font-medium transition-colors ${
                  orderType === 'buy'
                    ? 'bg-green-600 text-white'
                    : isDark
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('buy')}
              </button>
              <button
                onClick={() => setOrderType('sell')}
                className={`p-3 rounded-lg font-medium transition-colors ${
                  orderType === 'sell'
                    ? 'bg-red-600 text-white'
                    : isDark
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('sell')}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {t('amount')} ({selectedPair.replace('USDT', '')})
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500'
                  }`}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {t('price')} (USDT)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500'
                  }`}
                  placeholder="0.00"
                />
              </div>

              <div className={`border-t pt-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <div className={`flex items-center justify-between text-sm mb-2 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <span>{t('total')}</span>
                  <span>${(parseFloat(amount || '0') * parseFloat(price || '0')).toFixed(2)}</span>
                </div>
                <div className={`flex items-center justify-between text-sm mb-4 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <span>{t('fee')}</span>
                  <span>0.1%</span>
                </div>
                
                <button
                  onClick={handleOrder}
                  disabled={!amount || !price}
                  className={`w-full p-3 rounded-lg font-medium transition-colors ${
                    orderType === 'buy'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {t(orderType === 'buy' ? 'place_buy_order' : 'place_sell_order')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;