import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Globe, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useCryptoPrices } from '../../hooks/useCryptoPrices';
import CryptoCard from '../../components/Crypto/CryptoCard';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { data: cryptos, isLoading } = useCryptoPrices();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('hero_title')}
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                {t('get_started')}
              </Link>
              <Link
                to="/login"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                {t('sign_in')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <h2 className={`text-3xl font-bold text-center mb-12 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {t('why_choose_us')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('real_time_trading')}</h3>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                {t('real_time_trading_desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('secure_platform')}</h3>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                {t('secure_platform_desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('global_access')}</h3>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                {t('global_access_desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('fast_execution')}</h3>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                {t('fast_execution_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Cryptocurrencies */}
      <section className={`py-16 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
        <div className="container mx-auto px-6">
          <h2 className={`text-3xl font-bold text-center mb-12 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {t('top_cryptocurrencies')}
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`rounded-lg p-6 animate-pulse ${
                  isDark ? 'bg-slate-800' : 'bg-white'
                }`}>
                  <div className={`h-4 rounded w-3/4 mb-2 ${
                    isDark ? 'bg-slate-700' : 'bg-slate-200'
                  }`}></div>
                  <div className={`h-4 rounded w-1/2 ${
                    isDark ? 'bg-slate-700' : 'bg-slate-200'
                  }`}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cryptos?.slice(0, 6).map((crypto) => (
                <CryptoCard key={crypto.id} crypto={crypto} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;