// src/components/LanguageToggle.jsx - Simple Text Version
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle = ({ className = "" }) => {
  const { isIndonesian, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={`relative inline-flex items-center justify-center w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-md ${className}`}
      aria-label={isIndonesian ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
      title={isIndonesian ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
    >
      {/* Background gradient animation */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 opacity-0 transition-opacity duration-300 ${isIndonesian ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 transition-opacity duration-300 ${!isIndonesian ? 'opacity-100' : 'opacity-0'}`}></div>
      
      {/* Toggle circle */}
      <div className={`relative z-10 flex items-center justify-center w-7 h-7 bg-white dark:bg-gray-100 rounded-full shadow-lg transform transition-all duration-300 ${
        isIndonesian ? '-translate-x-3.5' : 'translate-x-3.5'
      }`}>
        {/* ID Text - Indonesian */}
        <span
          className={`absolute inset-0 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            isIndonesian 
              ? 'opacity-100 scale-100 text-teal-600' 
              : 'opacity-0 scale-0 text-transparent'
          }`}
        >
          ID
        </span>
        
        {/* EN Text - English */}
        <span
          className={`absolute inset-0 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            !isIndonesian 
              ? 'opacity-100 scale-100 text-blue-600' 
              : 'opacity-0 scale-0 text-transparent'
          }`}
        >
          EN
        </span>
      </div>
      
      {/* Language labels on track */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <span className={`text-[10px] font-semibold transition-all duration-300 ${
          isIndonesian 
            ? 'text-white opacity-100' 
            : 'text-gray-500 dark:text-gray-400 opacity-50'
        }`}>
          ID
        </span>
        <span className={`text-[10px] font-semibold transition-all duration-300 ${
          !isIndonesian 
            ? 'text-white opacity-100' 
            : 'text-gray-500 dark:text-gray-400 opacity-50'
        }`}>
          EN
        </span>
      </div>
      
      {/* Screen reader text */}
      <span className="sr-only">
        {isIndonesian ? 'Bahasa Indonesia aktif, klik untuk ganti ke English' : 'English active, click to switch to Bahasa Indonesia'}
      </span>
    </button>
  );
};

export default LanguageToggle;