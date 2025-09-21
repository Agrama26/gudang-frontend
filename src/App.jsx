import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DarkModeProvider } from './contexts/DarkModeContext';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ItemDetail from './components/ItemDetail';
import AddItem from './components/Additem';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 dark:border-teal-400 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      );
    }
    
    return user ? children : <Navigate to="/login" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 dark:border-teal-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <DarkModeProvider>
      <Router>
        <div className="App min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/landingpage" element={<LandingPage />} />
            <Route 
              path="/login" 
              element={
                user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard user={user} onLogout={handleLogout} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/item/:id" 
              element={
                <ProtectedRoute>
                  <ItemDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-item" 
              element={
                <ProtectedRoute>
                  <AddItem />
                </ProtectedRoute>
              } 
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </DarkModeProvider>
  );
}

export default App;