import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  PieChart, 
  Settings, 
  Shield,
  BarChart3,
  Wallet
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: t('dashboard') },
    { path: '/trading', icon: TrendingUp, label: t('trading') },
    { path: '/portfolio', icon: PieChart, label: t('portfolio') },
    { path: '/', icon: BarChart3, label: t('market') },
  ];

  const adminItems = [
    { path: '/admin', icon: Shield, label: t('admin_panel') },
  ];

  return (
    <aside className={`fixed left-0 top-16 w-64 h-screen z-40 border-r transition-colors ${
      isDark 
        ? 'bg-slate-800 border-slate-700' 
        : 'bg-white border-slate-200'
    }`}>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isDark
                        ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
          
          {user?.role === 'admin' && (
            <>
              <li className="pt-4">
                <div className={`text-xs uppercase tracking-wide font-semibold ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {t('administration')}
                </div>
              </li>
              {adminItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-red-600 text-white'
                          : isDark
                            ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;