import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError(t('password_too_short'));
      return;
    }

    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError(t('registration_failed'));
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      isDark ? 'bg-slate-900' : 'bg-slate-50'
    }`}>
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <TrendingUp className="h-12 w-12 text-blue-500" />
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {t('create_account')}
          </h2>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            {t('register_subtitle')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className={`block text-sm font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {t('full_name')}
              </label>
              <div className="mt-1 relative">
                <User className={`absolute left-3 top-3 h-5 w-5 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' 
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                  }`}
                  placeholder={t('name_placeholder')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {t('email')}
              </label>
              <div className="mt-1 relative">
                <Mail className={`absolute left-3 top-3 h-5 w-5 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' 
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                  }`}
                  placeholder={t('email_placeholder')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {t('password')}
              </label>
              <div className="mt-1 relative">
                <Lock className={`absolute left-3 top-3 h-5 w-5 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' 
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                  }`}
                  placeholder={t('password_placeholder')}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className={`border px-4 py-3 rounded-lg ${
              isDark 
                ? 'bg-red-900/50 border-red-500 text-red-200' 
                : 'bg-red-50 border-red-300 text-red-700'
            }`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              isDark ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-white'
            }`}
          >
            {isLoading ? t('creating_account') : t('create_account')}
          </button>

          <div className="text-center">
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {t('already_have_account')}{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300">
                {t('sign_in')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;