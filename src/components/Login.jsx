import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import DarkModeToggle from './DarkModeToggle';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Tambahkan state baru
  const [showPassword, setShowPassword] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e); // Login dengan Enter
    }
    if (e.key === "Delete") {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: "" // Kosongkan input yang aktif
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { authAPI } = await import('../utils/api');
      const response = await authAPI.login(formData.username, formData.password);

      const userData = {
        ...response.user,
        token: response.token
      };

      localStorage.setItem('user', JSON.stringify(userData));
      onLogin(userData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Username atau password salah');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 text-black relative overflow-hidden flex items-center justify-center transition-colors duration-300">
      {/* Dark Mode Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <DarkModeToggle />
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Neural Network Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1000 1000">
            <defs>
              <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isDarkMode ? "#06b6d4" : "#00ffff"} />
                <stop offset="100%" stopColor={isDarkMode ? "#3b82f6" : "#0080ff"} />
              </linearGradient>
            </defs>
            {/* Network nodes and connections */}
            <circle cx="100" cy="100" r="3" fill="url(#networkGradient)" className="animate-pulse" />
            <circle cx="300" cy="200" r="3" fill="url(#networkGradient)" className="animate-pulse" style={{ animationDelay: '1s' }} />
            <circle cx="500" cy="150" r="3" fill="url(#networkGradient)" className="animate-pulse" style={{ animationDelay: '2s' }} />
            <circle cx="700" cy="300" r="3" fill="url(#networkGradient)" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
            <circle cx="200" cy="400" r="3" fill="url(#networkGradient)" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
            <circle cx="600" cy="500" r="3" fill="url(#networkGradient)" className="animate-pulse" style={{ animationDelay: '2.5s' }} />
            <circle cx="800" cy="600" r="3" fill="url(#networkGradient)" className="animate-pulse" style={{ animationDelay: '1.2s' }} />
            <circle cx="1000" cy="100" r="3" fill="url(#networkGradient)" className="animate-pulse" style={{ animationDelay: '0.8s' }} />

            <line x1="100" y1="100" x2="300" y2="200" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.6" />
            <line x1="300" y1="200" x2="500" y2="150" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.6" />
            <line x1="500" y1="150" x2="700" y2="300" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.6" />
            <line x1="200" y1="400" x2="600" y2="500" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.6" />
            <line x1="600" y1="500" x2="800" y2="600" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.6" />
            <line x1="1000" y1="100" x2="200" y2="400" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.6" />
            <line x1="800" y1="600" x2="600" y2="500" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.6" />
            <line x1="500" y1="150" x2="800" y2="600" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.6" />
          </svg>
        </div>

        {/* Floating Data Streams */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-px bg-gradient-to-b from-transparent via-teal-600 dark:via-cyan-300 to-transparent opacity-40`}
            style={{
              left: `${(i * 12) + 10}%`,
              height: '100vh',
              animationDelay: `${i * 0.5}s`,
              animation: `dataStream ${4 + (i % 3)}s linear infinite`
            }}
          ></div>
        ))}

        {/* Matrix Rain Effect */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`matrix-${i}`}
            className="absolute text-cyan-400 dark:text-cyan-300 text-xs font-mono opacity-30 select-none"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animation: `matrixRain ${8 + Math.random() * 4}s linear infinite`
            }}
          >
            {Math.random().toString(36).substring(2, 8)}
          </div>
        ))}

        {/* Holographic Grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 204, 102, ${isDarkMode ? '0.2' : '0.3'}) 2px, transparent 2px),
              linear-gradient(90deg, rgba(0, 204, 102, ${isDarkMode ? '0.2' : '0.3'}) 2px, transparent 2px)
            `,
            backgroundSize: '40px 40px',
            animation: 'gridFlow 15s linear infinite'
          }}
        ></div>

        {/* Scanning Beams */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-teal-600 dark:via-cyan-300 to-transparent opacity-80 animate-scanHorizontal"></div>
        <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-transparent via-teal-600 dark:via-cyan-300 to-transparent opacity-80 animate-scanVertical"></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Hologram Effect Container */}
        <div className="relative">
          {/* Outer Glow */}
          <div className={`absolute -inset-4 bg-gradient-to-r ${isDarkMode
            ? 'from-cyan-400/20 via-blue-500/20 to-cyan-400/20'
            : 'from-cyan-900/30 via-blue-900/30 to-cyan-900/30'
            } rounded-2xl blur-xl animate-pulse`}></div>

          {/* Main Login Panel */}
          <div className={`relative ${isDarkMode
            ? 'bg-gray-800/90 border-gray-600/50'
            : 'bg-teal-50/80 border-cyan-400/30'
            } backdrop-blur-xl border rounded-2xl shadow-2xl shadow-cyan-500/20 p-8 overflow-hidden transition-colors duration-300`}>

            {/* Internal Scanning Lines */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-600 dark:via-cyan-300 to-transparent animate-scanInternal"></div>

            {/* Header Section */}
            <div className="text-center mb-8 relative">
              {/* Logo/Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${isDarkMode
                ? 'from-teal-400 to-blue-400'
                : 'from-teal-500 to-blue-500'
                } rounded-lg mb-4 animate-float`}>
                <div className="w-8 h-8 border-2 border-white dark:border-gray-800 rounded-sm animate-spin"></div>
              </div>

              <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r ${isDarkMode
                ? 'from-cyan-300 via-blue-300 to-cyan-300'
                : 'from-teal-600 via-blue-400 to-teal-400'
                } bg-clip-text text-transparent animate-shimmer`}>
                LOGIN SYSTEM
              </h1>
              <p className="text-teal-700 dark:text-cyan-300 font-mono text-sm uppercase tracking-[0.2em]">
                PT. Medianusa Permana
              </p>

              {/* Status Indicators */}
              <div className="flex justify-center space-x-2 mt-4">
                <div className="w-2 h-2 bg-green-400 dark:bg-green-300 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-cyan-400 dark:bg-cyan-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-2 h-2 bg-blue-400 dark:bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>

            {/* Login Form */}
            <div className="space-y-6">
              {/* Username Input */}
              <div className="group">
                <label className="block text-teal-700 dark:text-cyan-300 text-sm font-mono uppercase tracking-wider mb-3">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-teal-700 dark:bg-cyan-300 rounded-full mr-2 animate-pulse"></div>
                    User Identification
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}   // << Tambah ini
                    className={`w-full ${isDarkMode
                      ? 'bg-gray-700/50 border-gray-500 text-gray-100'
                      : 'bg-white/50 border-gray-500 text-black'
                      } border p-4 rounded-sm font-mono focus:border-cyan-400 dark:focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-400`}
                    placeholder="Enter username..."
                  />
                  <div className="absolute inset-0 border border-cyan-400/20 dark:border-cyan-300/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-cyan-400 dark:bg-cyan-300 rounded-full animate-ping opacity-50"></div>
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <label className="block text-teal-700 dark:text-cyan-300 text-sm font-mono uppercase tracking-wider mb-3">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-teal-700 dark:bg-cyan-300 rounded-full mr-2 animate-pulse"></div>
                    Security Key
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}   // toggle tipe input
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}   // enter + delete handler
                    className={`w-full ${isDarkMode
                      ? 'bg-gray-700/50 border-gray-500 text-gray-100'
                      : 'bg-white/50 border-gray-600 text-black'
                      } border p-4 rounded-sm font-mono focus:border-cyan-400 dark:focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-400`}
                    placeholder="Enter security key..."
                  />

                  {/* Toggle Show/Hide Password dengan Icon */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>

                  <div className="absolute inset-0 border border-cyan-400/20 dark:border-cyan-300/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-cyan-400 dark:bg-cyan-300 rounded-full animate-ping opacity-50"></div>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className={`${isDarkMode
                  ? 'bg-red-800/50 border-red-600/50 text-red-300'
                  : 'bg-red-900/50 border-red-500/100 text-red-700'
                  } border px-4 py-3 rounded-sm font-mono text-sm animate-shake`}>
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-red-700 dark:bg-red-300 rounded-full mr-2 animate-ping"></div>
                    ACCESS DENIED: {error}
                  </span>
                </div>
              )}

              {/* Login Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full group relative overflow-hidden bg-gradient-to-r ${isDarkMode
                  ? 'from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300'
                  : 'from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400'
                  } text-white py-4 px-6 rounded-sm font-mono uppercase tracking-wider font-bold transition-all duration-300 ${loading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-2xl hover:shadow-cyan-500/30 transform hover:scale-[1.02]'
                  }`}
              >
                <span className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">▶</span>
                      Initialize Access
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Demo Accounts Section */}
            <div className={`mt-8 p-4 ${isDarkMode
              ? 'bg-gray-700/30 border-gray-500/50'
              : 'bg-white/30 border-gray-600/50'
              } border rounded-sm`}>
              <p className="text-teal-700 dark:text-cyan-300 font-mono text-xs uppercase tracking-wider mb-3">
                Demo Access Credentials:
              </p>
              <div className="space-y-1 text-gray-400 dark:text-gray-400 font-mono text-xs">
                <p className="flex justify-between">
                  <span>ADMIN:</span>
                  <span className="text-teal-700 dark:text-cyan-300">admin / admin123</span>
                </p>
                <p className="flex justify-between">
                  <span>STAFF:</span>
                  <span className="text-teal-700 dark:text-cyan-300">staff / staff123</span>
                </p>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <button
                onClick={handleBackToHome}
                className="text-teal-800/80 dark:text-cyan-300/80 hover:text-teal-400 dark:hover:text-cyan-300 font-mono text-sm uppercase tracking-wider transition-colors duration-300"
              >
                ← Return to Main System
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes dataStream {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes matrixRain {
          0% { transform: translateY(-100vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        
        @keyframes gridFlow {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
        
        @keyframes scanHorizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        
        @keyframes scanVertical {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes scanInternal {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-scanHorizontal {
          animation: scanHorizontal 4s ease-in-out infinite;
        }
        
        .animate-scanVertical {
          animation: scanVertical 6s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-scanInternal {
          animation: scanInternal 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.5);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 255, 0.8);
        }
      `}</style>
    </div >
  );
};

export default Login;