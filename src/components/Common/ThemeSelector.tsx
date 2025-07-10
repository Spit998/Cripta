import React, { useState } from 'react';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const ThemeSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { themeMode, setThemeMode, isDark } = useTheme();
  const { t } = useLanguage();

  const themes = [
    { mode: 'light' as const, icon: Sun, label: t('light_theme') },
    { mode: 'dark' as const, icon: Moon, label: t('dark_theme') },
    { mode: 'system' as const, icon: Monitor, label: t('system_theme') },
  ];

  const currentTheme = themes.find(theme => theme.mode === themeMode) || themes[2];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 text-sm transition-colors rounded-lg ${
          isDark 
            ? 'text-slate-300 hover:text-white hover:bg-slate-700' 
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        <currentTheme.icon className="h-4 w-4" />
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute top-full right-0 mt-1 w-48 rounded-lg shadow-lg z-50 border ${
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200'
          }`}>
            {themes.map((theme) => (
              <button
                key={theme.mode}
                onClick={() => {
                  setThemeMode(theme.mode);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center space-x-3 ${
                  themeMode === theme.mode
                    ? isDark 
                      ? 'bg-slate-700 text-blue-400' 
                      : 'bg-slate-100 text-blue-600'
                    : isDark
                      ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                } ${theme === themes[0] ? 'rounded-t-lg' : ''} ${theme === themes[themes.length - 1] ? 'rounded-b-lg' : ''}`}
              >
                <theme.icon className="h-4 w-4" />
                <span>{theme.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;