import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import LanguageSelector from '../Common/LanguageSelector';
import ThemeSelector from '../Common/ThemeSelector';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-16 border-b transition-colors ${
      isDark 
        ? 'bg-slate-800 border-slate-700' 
        : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between px-6 h-full">
        <Link to="/" className="flex items-center space-x-2">
          <TrendingUp className="h-8 w-8 text-blue-500" />
          <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            CryptoTrade
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeSelector />
          <LanguageSelector />
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className={`h-5 w-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {user?.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className={`flex items-center space-x-1 px-3 py-1 text-sm transition-colors ${
                  isDark 
                    ? 'text-slate-300 hover:text-white' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogOut className="h-4 w-4" />
                <span>{t('logout')}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className={`px-4 py-2 text-sm transition-colors ${
                  isDark 
                    ? 'text-slate-300 hover:text-white' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('login')}
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {t('register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;