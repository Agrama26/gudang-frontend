import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
    setUser(null);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }
    
    return user ? children : <Navigate to="/login" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {/* Logout button for authenticated users */}
        {user && (
          <div className="absolute bottom-4 right-4 z-50">
            <div className="bg-white rounded-lg shadow-md p-2 flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Welcome, {user.username} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Logout
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
              user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
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
  );
}

export default App;