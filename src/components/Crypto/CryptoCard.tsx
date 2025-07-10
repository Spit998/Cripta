import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { CryptoCurrency } from '../../types';

interface CryptoCardProps {
  crypto: CryptoCurrency;
  onClick?: () => void;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ crypto, onClick }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const isPositive = crypto.priceChangePercent24h > 0;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/coin/${crypto.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`rounded-lg p-6 transition-colors cursor-pointer border ${
        isDark 
          ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' 
          : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={crypto.image}
            alt={crypto.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {crypto.name}
            </h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {crypto.symbol}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ${crypto.price.toLocaleString()}
          </p>
          <div className={`flex items-center space-x-1 ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm">
              {isPositive ? '+' : ''}{crypto.priceChangePercent24h.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Market Cap</p>
          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ${(crypto.marketCap / 1e9).toFixed(2)}B
          </p>
        </div>
        <div>
          <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Volume 24h</p>
          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ${(crypto.volume24h / 1e6).toFixed(2)}M
          </p>
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;