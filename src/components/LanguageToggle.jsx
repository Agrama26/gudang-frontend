import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle = ({ className = "" }) => {
  const { isIndonesian, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={`relative inline-flex items-center justify-center w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${className}`}
      aria-label={isIndonesian ? "Switch to English" : "Switch to Indonesian"}
      title={isIndonesian ? "Switch to English" : "Switch to Indonesian"}
    >
      {/* Track background gradient for dark mode */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 transition-opacity duration-300 ${isIndonesian ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* Switch circle */}
      <div className={`relative z-10 flex items-center justify-center w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-lg transform transition-all duration-300 ${isIndonesian ? 'translate-x-3' : '-translate-x-3'
        }`}>

        {/* Indonesian flag icon - visible when Indonesian is active */}
        <span
          className={`w-4 h-4 rounded-full bg-red-600 transition-all duration-300 ${isIndonesian ? 'opacity-100' : 'opacity-0'
            }`}
        ></span>

        {/* English flag icon - visible when English is active */}
        <span
          className={`absolute w-4 h-4 rounded-full bg-blue-600 transition-all duration-300 ${isIndonesian ? 'opacity-0' : 'opacity-100'
            }`}
        ></span>
      </div>

      {/* Language indicator text - optional */}
      <span className="sr-only">
        {isIndonesian ? 'Indonesian active' : 'English active'}
      </span>
    </button>
  );
};

export default LanguageToggle;
