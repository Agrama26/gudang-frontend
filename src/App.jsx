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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin h-16 w-16 border-4 border-transparent bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              <div className="h-16 w-16 border-4 border-transparent bg-gradient-to-r from-purple-400 to-pink-400 rounded-full absolute top-0 left-0 animate-pulse"></div>
            </div>
            <p className="mt-6 text-white font-medium">Loading...</p>
          </div>
        </div>
      );
    }

    return user ? children : <Navigate to="/login" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin h-16 w-16 border-4 border-transparent bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            <div className="h-16 w-16 border-4 border-transparent bg-gradient-to-r from-purple-400 to-pink-400 rounded-full absolute top-0 left-0 animate-pulse"></div>
          </div>
          <p className="mt-6 text-white font-medium">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
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
  );
}

export default App;