import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useCoinDetail, useCoinChart } from '../../hooks/useCryptoPrices';
import { tradingService } from '../../services/tradingService';
import { ChartData } from '../../types';

const CoinDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');

  // Use optimized hooks
  const { data: coin, isLoading: coinLoading, error: coinError } = useCoinDetail(id || '');
  const { data: chartData = [], isLoading: chartLoading } = useCoinChart(id || '', selectedPeriod);

  const periods = [
    { label: '24H', value: 1 },
    { label: '7D', value: 7 },
    { label: '30D', value: 30 },
    { label: '90D', value: 90 },
    { label: '1Y', value: 365 },
  ];

  const loading = coinLoading || chartLoading;

  const handleTrade = async () => {
    if (!coin || !amount) return;

    setOrderLoading(true);
    setOrderMessage('');

    try {
      const result = await tradingService.executeTrade(
        orderType,
        coin.symbol,
        parseFloat(amount),
        coin.price,
        coin.name
      );

      if (result.success) {
        setOrderMessage(result.message);
        setAmount('');
      } else {
        setOrderMessage(result.message);
      }
    } catch (error) {
      setOrderMessage('Trade execution failed');
    } finally {
      setOrderLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const userBalance = coin ? tradingService.getBalance(orderType === 'buy' ? 'USDT' : coin.symbol) : 0;
  const maxAmount = orderType === 'buy' ? userBalance / (coin?.price || 1) : userBalance;

  if (coinError) {
    return (
      <div className="p-6 text-center">
        <p className={`mb-4 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
          Error loading coin data: {coinError instanceof Error ? coinError.message : 'Unknown error'}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className={`h-8 rounded w-1/4 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
          <div className={`h-64 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-2 h-96 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className={`h-96 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="p-6 text-center">
        <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Coin not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className={`p-2 rounded-lg transition-colors ${
            isDark 
              ? 'bg-slate-800 hover:bg-slate-700' 
              : 'bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <ArrowLeft className={`h-5 w-5 ${isDark ? 'text-white' : 'text-slate-900'}`} />
        </button>
        <div className="flex items-center space-x-3">
          <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-full" />
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {coin.name}
            </h1>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>{coin.symbol}</p>
          </div>
        </div>
      </div>

      {/* Price Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`rounded-lg p-6 border ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Current Price
          </div>
          <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {formatPrice(coin.price)}
          </div>
          <div className={`flex items-center space-x-1 mt-1 ${
            coin.priceChangePercent24h > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {coin.priceChangePercent24h > 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{coin.priceChangePercent24h > 0 ? '+' : ''}{coin.priceChangePercent24h.toFixed(2)}%</span>
          </div>
        </div>

        <div className={`rounded-lg p-6 border ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Market Cap
          </div>
          <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ${(coin.marketCap / 1e9).toFixed(2)}B
          </div>
          <div className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Rank #{coin.rank}
          </div>
        </div>

        <div className={`rounded-lg p-6 border ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            24h Volume
          </div>
          <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ${(coin.volume24h / 1e6).toFixed(2)}M
          </div>
        </div>

        <div className={`rounded-lg p-6 border ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Circulating Supply
          </div>
          <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {coin.circulatingSupply ? (coin.circulatingSupply / 1e6).toFixed(2) + 'M' : 'N/A'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className={`lg:col-span-2 rounded-lg p-6 border ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Price Chart
            </h2>
            <div className="flex space-x-2">
              {periods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    selectedPeriod === period.value
                      ? 'bg-blue-600 text-white'
                      : isDark
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e2e8f0"} />
                <XAxis 
                  dataKey="date" 
                  stroke={isDark ? "#9CA3AF" : "#64748b"}
                  fontSize={12}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke={isDark ? "#9CA3AF" : "#64748b"}
                  fontSize={12}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                  domain={['dataMin * 0.95', 'dataMax * 1.05']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1F2937' : '#ffffff',
                    border: isDark ? '1px solid #374151' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: isDark ? '#F9FAFB' : '#0f172a',
                  }}
                  formatter={(value: number) => [formatPrice(value), 'Price']}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#3B82F6' }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trading Panel */}
        <div className={`rounded-lg p-6 border ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Trade {coin.symbol}
          </h2>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
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
                Amount ({coin.symbol})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={maxAmount}
                step="0.000001"
                className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500'
                }`}
                placeholder="0.00"
              />
              <div className="text-xs text-slate-400 mt-1">
                Available: {maxAmount.toFixed(6)} {orderType === 'buy' ? coin.symbol : coin.symbol}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Price (USDT)
              </label>
              <input
                type="number"
                value={coin.price}
                readOnly
                className={`w-full p-3 rounded-lg ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className={`border-t pt-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className={`flex items-center justify-between text-sm mb-2 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <span>Total</span>
                <span>{formatPrice((parseFloat(amount || '0') * coin.price))}</span>
              </div>
              <div className={`flex items-center justify-between text-sm mb-4 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <span>Fee (0.1%)</span>
                <span>{formatPrice((parseFloat(amount || '0') * coin.price * 0.001))}</span>
              </div>
              
              {orderMessage && (
                <div className={`p-3 rounded-lg mb-4 text-sm ${
                  orderMessage.includes('successfully') 
                    ? 'bg-green-900/50 border border-green-500 text-green-200'
                    : 'bg-red-900/50 border border-red-500 text-red-200'
                }`}>
                  {orderMessage}
                </div>
              )}
              
              <button
                onClick={handleTrade}
                disabled={!amount || orderLoading || parseFloat(amount) > maxAmount}
                className={`w-full p-3 rounded-lg font-medium transition-colors ${
                  orderType === 'buy'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {orderLoading ? 'Processing...' : `${orderType === 'buy' ? 'Buy' : 'Sell'} ${coin.symbol}`}
              </button>
            </div>
          </div>

          {/* Balance Info */}
          <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
            <div className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Your Balance
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>USDT:</span>
                <span className={isDark ? 'text-white' : 'text-slate-900'}>
                  {tradingService.getBalance('USDT').toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{coin.symbol}:</span>
                <span className={isDark ? 'text-white' : 'text-slate-900'}>
                  {tradingService.getBalance(coin.symbol).toFixed(6)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {coin.description && (
        <div className={`rounded-lg p-6 border ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            About {coin.name}
          </h2>
          <div 
            className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
            dangerouslySetInnerHTML={{ 
              __html: coin.description.replace(/<a/g, `<a class="${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}"`)
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CoinDetail;