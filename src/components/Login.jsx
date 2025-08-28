import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="geometric-bg">
        <div className="geometric-shape shape-1"></div>
        <div className="geometric-shape shape-2"></div>
        <div className="geometric-shape shape-3"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      <div className="floating-shapes"></div>
      
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md animate-fade-in-up hover:shadow-xl transition-all duration-500 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent animate-fade-in-up">
            WMS Login
          </h1>
          <p className="text-gray-600 mt-2 animate-fade-in-up delay-200">Warehouse Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan password"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold transition-all ${
              loading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600 font-semibold">Demo Accounts:</p>
          <p className="text-sm text-gray-600">Admin: admin / admin123</p>
          <p className="text-sm text-gray-600">Staff: staff / staff123</p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;