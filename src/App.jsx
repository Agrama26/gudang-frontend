import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import ItemDetail from './components/ItemDetail';
import AddItem from './components/Additem';
import Login from './components/Login';
import { DarkModeProvider, useDarkMode } from './contexts/DarkModeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// Toast Container Wrapper to apply dark mode and language
const ToastContainerWrapper = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <ToastContainer
      position="top-center"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={isDarkMode ? "dark" : "light"}
      toastStyle={{
        fontSize: '14px',
        borderRadius: '12px',
        boxShadow: isDarkMode
          ? '0 10px 25px rgba(0, 0, 0, 0.5)'
          : '0 10px 25px rgba(0, 0, 0, 0.15)',
        border: isDarkMode
          ? '1px solid rgba(75, 85, 99, 0.3)'
          : '1px solid rgba(209, 213, 219, 0.3)',
        backdropFilter: 'blur(10px)',
        background: isDarkMode
          ? 'rgba(31, 41, 55, 0.95)'
          : 'rgba(255, 255, 255, 0.95)'
      }}
      progressStyle={{
        background: isDarkMode
          ? 'linear-gradient(90deg, #06b6d4, #3b82f6)'
          : 'linear-gradient(90deg, #14b8a6, #06b6d4)'
      }}
    />
  );
};

// Loading Component yang tidak depend on translation
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 dark:border-teal-400 mx-auto"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
    </div>
  </div>
);

// Protected Route Component yang tidak depend on translation
const ProtectedRoute = ({ children, adminOnly = false, user, loading }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Gunakan string langsung untuk menghindari dependency
    toast.error('Please login to access this page', {
      icon: '🔒',
      duration: 4000
    });
    return <Navigate to="/login" />;
  }

  // Check admin access
  if (adminOnly && user.role !== 'admin') {
    toast.error('Access denied. Admin privileges required.', {
      icon: '⛔',
      duration: 4000
    });
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// Main App Component with Language Support
const AppContent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, isIndonesian } = useLanguage();

  // ✅ FIX: useEffect hanya dijalankan saat mount
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // ✅ FIX: Hanya show welcome toast saat pertama kali load
        // Tidak show saat language toggle
        const welcomeMsg = isIndonesian 
          ? `Selamat datang kembali, ${userData.username}!` 
          : `Welcome back, ${userData.username}!`;
        
        toast.success(welcomeMsg, {
          icon: '👋',
          duration: 3000
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []); // ✅ Empty dependency array - hanya run sekali saat mount

  // ✅ FIX: Update toast messages when language changes
  useEffect(() => {
    // Effect ini hanya untuk handle perubahan language
    // Tidak melakukan toast baru, hanya update state jika diperlukan
  }, [isIndonesian]);

  const handleLogin = (userData) => {
    setUser(userData);
    
    // ✅ FIX: Gunakan string langsung berdasarkan current language state
    const loginMsg = isIndonesian 
      ? `Login berhasil! Selamat datang, ${userData.username}`
      : `Login successful! Welcome, ${userData.username}`;
    
    toast.success(loginMsg, {
      icon: '✅',
      duration: 4000
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    
    // ✅ FIX: Gunakan string langsung berdasarkan current language state
    const logoutMsg = isIndonesian 
      ? 'Anda telah berhasil logout'
      : 'You have been logged out successfully';
    
    toast.info(logoutMsg, {
      icon: '👋',
      duration: 3000
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="App">
        {/* User info bar for authenticated users */}
        {user && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 flex items-center space-x-3 transition-all duration-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {isIndonesian ? 'Selamat datang,' : 'Welcome back,'}{' '}
                  <span className="font-semibold text-teal-600 dark:text-teal-400">{user.username}</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs border ${user.role === 'admin'
                    ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700'
                    : 'bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 border-teal-200 dark:border-teal-700'
                    }`}>
                    {user.role}
                  </span>
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                title={isIndonesian ? 'Keluar' : 'Logout'}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>
        )}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              user ? <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} />
                : <Login onLogin={handleLogin} />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Dashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/item/:id"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <ItemDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-item"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <AddItem />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} loading={loading} adminOnly={true}>
                <AdminDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* Toast Container */}
        <ToastContainerWrapper />
      </div>
    </Router>
  );
};

function App() {
  return (
    <DarkModeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </DarkModeProvider>
  );
}

export default App;