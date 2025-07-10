import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCryptoPrices } from '../../hooks/useCryptoPrices';
import CryptoCard from '../../components/Crypto/CryptoCard';
import { tradingService } from '../../services/tradingService';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { data: cryptos, isLoading } = useCryptoPrices();
  const [portfolio, setPortfolio] = React.useState(tradingService.getPortfolio());
  const [transactions, setTransactions] = React.useState(tradingService.getTransactions());

  React.useEffect(() => {
    if (cryptos) {
      tradingService.updateAssetPrices(cryptos);
      setPortfolio(tradingService.getPortfolio());
    }
  }, [cryptos]); // Only update when cryptos data changes

  // Memoize expensive calculations
  const portfolioStats = React.useMemo(() => {
    const totalValue = portfolio.totalValue;
    const assetsValue = portfolio.assets.reduce((sum, asset) => sum + asset.value, 0);
    const todayChange = portfolio.totalChange24h || 0;
    const todayTrades = transactions.filter(tx => {
      const today = new Date();
      const txDate = new Date(tx.timestamp);
      return txDate.toDateString() === today.toDateString();
    }).length;

    return { totalValue, assetsValue, todayChange, todayTrades };
  }, [portfolio, transactions]);

  const stats = [
    {
      title: t('total_balance'),
      value: `$${portfolioStats.totalValue.toLocaleString()}`,
      change: '+2.4%',
      positive: true,
      icon: DollarSign,
    },
    {
      title: t('portfolio_value'),
      value: `$${portfolioStats.assetsValue.toLocaleString()}`,
      change: '+1.8%',
      positive: true,
      icon: PieChart,
    },
    {
      title: t('today_pnl'),
      value: `$${Math.abs(portfolioStats.todayChange).toFixed(2)}`,
      change: `${portfolioStats.todayChange >= 0 ? '+' : ''}${portfolioStats.todayChange.toFixed(1)}%`,
      positive: portfolioStats.todayChange >= 0,
      icon: TrendingUp,
    },
    {
      title: t('total_trades'),
      value: transactions.length.toString(),
      change: `+${portfolioStats.todayTrades}`,
      positive: true,
      icon: TrendingDown,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t('welcome_back')}, {user?.name}!
        </h1>
        <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`rounded-lg p-6 border ${
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {stat.title}
              </div>
              <stat.icon className={`h-5 w-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>
            <div className="flex items-center justify-between">
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {stat.value}
              </div>
              <div className={`text-sm ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Market Overview */}
      <div className={`rounded-lg p-6 border ${
        isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t('market_overview')}
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`rounded-lg p-4 animate-pulse ${
                isDark ? 'bg-slate-700' : 'bg-slate-100'
              }`}>
                <div className={`h-4 rounded w-3/4 mb-2 ${
                  isDark ? 'bg-slate-600' : 'bg-slate-200'
                }`}></div>
                <div className={`h-4 rounded w-1/2 ${
                  isDark ? 'bg-slate-600' : 'bg-slate-200'
                }`}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cryptos?.slice(0, 6).map((crypto) => (
              <CryptoCard key={crypto.id} crypto={crypto} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className={`rounded-lg p-6 border ${
        isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t('recent_activity')}
        </h2>
        <div className="space-y-4">
          {transactions.slice(0, 3).map((transaction) => (
            <div key={transaction.id} className={`flex items-center justify-between p-4 rounded-lg ${
              isDark ? 'bg-slate-700' : 'bg-slate-50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction.type === 'buy' ? 'bg-green-600' : 'bg-red-600'
                }`}>
                  {transaction.type === 'buy' ? (
                    <TrendingUp className="h-4 w-4 text-white" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-white" />
                  )}
                </div>
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {transaction.type === 'buy' ? 'Bought' : 'Sold'} {transaction.symbol}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {new Date(transaction.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {transaction.type === 'buy' ? '+' : '-'}{transaction.amount} {transaction.symbol}
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  ${transaction.total.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;