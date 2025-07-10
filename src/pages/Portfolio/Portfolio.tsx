import React from 'react';
import { useEffect, useState } from 'react';
import { PieChart, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { tradingService } from '../../services/tradingService';
import { useCryptoPrices } from '../../hooks/useCryptoPrices';
import { Portfolio as PortfolioType } from '../../types';

const Portfolio: React.FC = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { data: cryptoPrices } = useCryptoPrices();
  const [portfolio, setPortfolio] = useState<PortfolioType | null>(null);

  useEffect(() => {
    const portfolioData = tradingService.getPortfolio();
    setPortfolio(portfolioData);
  }, []);

  useEffect(() => {
    if (cryptoPrices && portfolio) {
      tradingService.updateAssetPrices(cryptoPrices);
      setPortfolio(tradingService.getPortfolio());
    }
  }, [cryptoPrices]);

  if (!portfolio) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const portfolioAssets = portfolio.assets.filter(asset => asset.amount > 0);
  const totalValue = portfolio.totalValue;
  const totalChange = portfolioAssets.reduce((sum, asset) => {
    return sum + (asset.value * asset.change24h / 100);
  }, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t('portfolio')}
        </h1>
        <div className="flex items-center space-x-2">
          <PieChart className={`h-5 w-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
            {t('asset_allocation')}
          </span>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-lg p-6 border ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('total_value')}
            </div>
            <DollarSign className={`h-5 w-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
          <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ${totalValue.toLocaleString()}
          </div>
          <div className="text-sm text-green-400 mt-1">+$1,234 (+3.8%)</div>
        </div>

        <div className={`rounded-lg p-6 border ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('today_pnl')}
            </div>
            <TrendingUp className={`h-5 w-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
          <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            +$567
          </div>
          <div className="text-sm text-green-400 mt-1">+1.7%</div>
        </div>

        <div className={`rounded-lg p-6 border ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('assets')}
            </div>
            <PieChart className={`h-5 w-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
          <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {portfolioAssets.length}
          </div>
          <div className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {t('different_coins')}
          </div>
        </div>
      </div>

      {/* Asset List */}
      <div className={`rounded-lg p-6 border ${
        isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t('your_assets')}
        </h2>
        <div className="space-y-4">
          {portfolioAssets.map((asset) => (
            <div key={asset.symbol} className={`p-4 rounded-lg ${
              isDark ? 'bg-slate-700' : 'bg-slate-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{asset.symbol}</span>
                  </div>
                  <div>
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {asset.name}
                    </div>
                    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {asset.amount} {asset.symbol}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    ${asset.value.toLocaleString()}
                  </div>
                  <div className={`text-sm flex items-center ${
                    asset.change > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {asset.change > 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {asset.change > 0 ? '+' : ''}{asset.change}%
                  </div>
                </div>
              </div>
              <div className={`mt-3 rounded-full h-2 ${
                isDark ? 'bg-slate-600' : 'bg-slate-200'
              }`}>
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(asset.value / totalValue) * 100}%` }}
                ></div>
              </div>
              <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {((asset.value / totalValue) * 100).toFixed(1)}% {t('of_portfolio')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;