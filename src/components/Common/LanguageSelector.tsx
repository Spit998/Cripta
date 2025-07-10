import React, { useState } from 'react';
import { ChevronDown, Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { LANGUAGES } from '../../constants';

const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, setLanguage } = useLanguage();
  const { isDark } = useTheme();

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
        <Languages className="h-4 w-4" />
        <span>{currentLanguage.flag}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute top-full right-0 mt-1 w-48 rounded-lg shadow-lg z-50 border ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                currentLanguage.code === lang.code
                  ? isDark 
                    ? 'bg-slate-700 text-blue-400' 
                    : 'bg-slate-100 text-blue-600'
                  : isDark
                    ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </button>
          ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;