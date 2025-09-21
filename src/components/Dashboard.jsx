import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { barangAPI } from '../utils/api';
import logo from '../assets/logo.png';
import { useDarkMode } from '../contexts/DarkModeContext';
import DarkModeToggle from './DarkModeToggle';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { PolarArea, Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [kotaFilter, setKotaFilter] = useState('');

  // Animation states
  const [isVisible, setIsVisible] = useState({});
  const [chartAnimated, setChartAnimated] = useState(false);
  const observerRef = useRef();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleKotaFilterChange = (e) => {
    setKotaFilter(e.target.value);
  };

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-animate');
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [id]: true }));
          } else {
            setIsVisible(prev => ({ ...prev, [id]: false }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [filteredItems]);

  // Fetch data barang
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await barangAPI.getAll();
        setItems(data);
      } catch (err) {
        setError('Gagal memuat data barang');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Filter berdasarkan pencarian, status, dan kota
  useEffect(() => {
    let result = items;

    if (searchQuery) {
      result = result.filter((item) =>
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.serial_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lokasi.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      result = result.filter((item) => item.status === statusFilter);
    }

    if (kotaFilter) {
      result = result.filter((item) => item.kota === kotaFilter);
    }

    setFilteredItems(result);
    setChartAnimated(true);
  }, [chartAnimated, searchQuery, statusFilter, kotaFilter, items]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'READY':
        return 'bg-emerald-500 text-white shadow-emerald-500/30';
      case 'TERPAKAI':
        return 'bg-blue-500 text-white shadow-blue-500/30';
      case 'RUSAK':
        return 'bg-red-500 text-white shadow-red-500/30';
      default:
        return 'bg-gray-500 text-white shadow-gray-500/30';
    }
  };

  // Data untuk PolarArea Chart
  const statusCounts = useMemo(() => {
    return {
      READY: filteredItems.filter(item => item.status === 'READY').length,
      TERPAKAI: filteredItems.filter(item => item.status === 'TERPAKAI').length,
      RUSAK: filteredItems.filter(item => item.status === 'RUSAK').length,
    };
  }, [filteredItems]);

  // Data untuk kota (untuk radar chart)
  const kotaCounts = useMemo(() => {
    const counts = {};
    filteredItems.forEach(item => {
      counts[item.kota] = (counts[item.kota] || 0) + 1;
    });
    return counts;
  }, [filteredItems]);

  // Kondisi counts untuk radar chart
  const kondisiCounts = useMemo(() => {
    const counts = {};
    filteredItems.forEach(item => {
      counts[item.kondisi] = (counts[item.kondisi] || 0) + 1;
    });
    return counts;
  }, [filteredItems]);

  // Chart.js Polar Area Chart Data
  const PolarAreaData = useMemo(() => ({
    labels: ['READY', 'TERPAKAI', 'RUSAK'],
    datasets: [
      {
        data: [statusCounts.READY, statusCounts.TERPAKAI, statusCounts.RUSAK],
        backgroundColor: [
          '#22C55E',
          '#3B82F6',
          '#EF4444',
        ],
        borderColor: [
          '#16A34A',
          '#2563EB',
          '#DC2626',
        ],
        borderWidth: 2,
        hoverOffset: 4,
        hoverBorderWidth: 3,
      },
    ],
  }), [statusCounts]);

  const PolarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: 'bold',
          },
          color: isDarkMode ? '#e5e7eb' : '#374151',
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#22C55E',
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((sum, current) => sum + current, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  // Radar Chart Data
  const radarChartData = {
    labels: ['Medan', 'Batam', 'Pekan Baru', 'Jakarta', 'Tarutung'],
    datasets: [
      {
        label: 'Items by City',
        data: [
          kotaCounts['Medan'] || 0,
          kotaCounts['Batam'] || 0,
          kotaCounts['Pekan Baru'] || 0,
          kotaCounts['Jakarta'] || 0,
          kotaCounts['Tarutung'] || 0,
        ],
        fill: true,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: '#22C55E',
        pointBackgroundColor: '#22C55E',
        pointBorderColor: '#16A34A',
        pointHoverBackgroundColor: '#16A34A',
        pointHoverBorderColor: '#22C55E',
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
      },
      {
        label: 'Ready Items',
        data: [
          filteredItems.filter(item => item.kota === 'Medan' && item.status === 'READY').length,
          filteredItems.filter(item => item.kota === 'Batam' && item.status === 'READY').length,
          filteredItems.filter(item => item.kota === 'Pekan Baru' && item.status === 'READY').length,
          filteredItems.filter(item => item.kota === 'Jakarta' && item.status === 'READY').length,
          filteredItems.filter(item => item.kota === 'Tarutung' && item.status === 'READY').length,
        ],
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3B82F6',
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#2563EB',
        pointHoverBackgroundColor: '#2563EB',
        pointHoverBorderColor: '#3B82F6',
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
      },
      {
        label: 'Kondisi Items',
        data: [
          kondisiCounts['Baru'] || 0,
          kondisiCounts['Baik'] || 0,
          kondisiCounts['Rusak Ringan'] || 0,
          kondisiCounts['Rusak Berat'] || 0,
        ],
        fill: true,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: '#EF4444',
        pointBackgroundColor: '#EF4444',
        pointBorderColor: '#DC2626',
        pointHoverBackgroundColor: '#DC2626',
        pointHoverBorderColor: '#EF4444',
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
      }
    ],
  };

  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: 'bold',
          },
          color: isDarkMode ? '#e5e7eb' : '#374151',
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#22C55E',
        borderWidth: 1,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(0, 0, 0, 0.1)',
        },
        angleLines: {
          color: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 12,
          },
          color: isDarkMode ? '#9ca3af' : '#374151',
          backdropColor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        },
        pointLabels: {
          font: {
            size: 14,
            weight: 'bold',
          },
          color: isDarkMode ? '#e5e7eb' : '#374151',
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin h-16 w-16 border-4 border-teal-200 dark:border-gray-600 border-t-teal-600 dark:border-t-teal-400 rounded-full"></div>
          </div>
          <p className="mt-6 text-gray-700 dark:text-gray-300 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
            </div>
            <p className="text-red-600 dark:text-red-400 font-semibold text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 dark:bg-teal-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-emerald-200 dark:bg-emerald-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      {/* Header */}
      <div
        className={`relative backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-teal-200 dark:border-gray-700 shadow-lg transition-all duration-1000 ${isVisible.header ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        data-animate="header"
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-100 h-100 group relative bg-teal-600 dark:bg-teal-700 px-3 py-2 rounded-xl shadow-lg hover:shadow-teal-300 dark:hover:shadow-teal-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <img src={logo} alt="Logo" width="150" height="150" className="w-100 h-100 object-contain drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                  Dashboard
                </h1>
                {user && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Welcome back, <span className="font-semibold text-teal-600 dark:text-teal-400">{user.username}</span>
                    <span className="ml-2 px-2 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full text-xs border border-teal-200 dark:border-teal-700">
                      {user.role}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <DarkModeToggle />

              <button
                onClick={() => navigate('/add-item')}
                className="group relative bg-teal-600 dark:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="relative z-10">+ Tambah Barang</span>
                <div className="absolute inset-0 bg-teal-700 dark:bg-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={() => navigate('/')}
                className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-semibold border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                Home
              </button>

              {user && onLogout && (
                <button
                  onClick={onLogout}
                  className="bg-red-500 dark:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-red-400 dark:border-red-500"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path>
                    </svg>
                    <span>Logout</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Polar Area Chart */}
          <div
            className={`transition-all duration-1000 ${isVisible['pie-chart'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            data-animate="pie-chart"
          >
            <div className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-teal-100 dark:border-gray-700 h-full hover:bg-teal-50 dark:hover:bg-gray-750 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">Status Distribution</h3>
              <div className="h-80">
                <PolarArea data={PolarAreaData} options={PolarOptions} />
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <div
            className={`transition-all duration-1000 ${isVisible['radar-chart'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            data-animate="radar-chart"
          >
            <div className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-teal-100 dark:border-gray-700 h-full hover:bg-teal-50 dark:hover:bg-gray-750 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">Distribution by City</h3>
              <div className="h-80">
                <Radar data={radarChartData} options={radarChartOptions} />
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-6 mb-8">
            {/* Total Items Card */}
            <div
              className={`group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-teal-100 dark:border-gray-700 hover:bg-teal-50 dark:hover:bg-gray-750 transition-all duration-1000 transform hover:scale-105 hover:-translate-y-2 ${isVisible['stat-total'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              data-animate="stat-total"
            >
              <div className="flex items-center">
                <div className="transform hover:rotate-12 hover:-translate-y-1 p-3 rounded-xl bg-blue-500 shadow-lg transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Items</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{filteredItems.length}</p>
                </div>
              </div>
            </div>

            {/* Ready Card */}
            <div
              className={`group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-teal-100 dark:border-gray-700 hover:bg-teal-50 dark:hover:bg-gray-750 transition-all duration-1000 transform hover:scale-105 hover:-translate-y-2 ${isVisible['stat-ready'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              data-animate="stat-ready"
              style={{ transitionDelay: '100ms' }}
            >
              <div className="flex items-center">
                <div className="transform hover:rotate-12 hover:-translate-y-1 p-3 rounded-xl bg-emerald-500 shadow-lg transition-all duration-300">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Ready</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{statusCounts.READY}</p>
                </div>
              </div>
            </div>

            {/* Terpakai Card */}
            <div
              className={`group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-teal-100 dark:border-gray-700 hover:bg-teal-50 dark:hover:bg-gray-750 transition-all duration-1000 transform hover:scale-105 hover:-translate-y-2 ${isVisible['stat-terpakai'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              data-animate="stat-terpakai"
              style={{ transitionDelay: '100ms' }}
            >
              <div className="flex items-center">
                <div className="transform hover:rotate-12 hover:-translate-y-1 p-3 rounded-xl bg-blue-500 shadow-lg transition-all duration-300">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Terpakai</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{statusCounts.TERPAKAI}</p>
                </div>
              </div>
            </div>

            {/* Rusak Card */}
            <div
              className={`group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-teal-100 dark:border-gray-700 hover:bg-teal-50 dark:hover:bg-gray-750 transition-all duration-1000 transform hover:scale-105 hover:-translate-y-2 ${isVisible['stat-rusak'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              data-animate="stat-rusak"
              style={{ transitionDelay: '100ms' }}
            >
              <div className="flex items-center">
                <div className="transform hover:rotate-12 hover:-translate-y-1 p-3 rounded-xl bg-red-500 shadow-lg transition-all duration-300">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Rusak</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{statusCounts.RUSAK}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div
          className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-teal-100 dark:border-gray-700 mb-8 transition-all duration-1000 ${isVisible.filters ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          data-animate="filters"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                </svg>
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                placeholder="Cari barang..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {/* Kota Filter */}
            <div>
              <select
                value={kotaFilter}
                onChange={handleKotaFilterChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="">Semua Kota</option>
                <option value="Medan">Medan</option>
                <option value="Batam">Batam</option>
                <option value="Pekan Baru">Pekan Baru</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Tarutung">Tarutung</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="md:w-64">
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="">Semua Status</option>
                <option value="READY">READY</option>
                <option value="TERPAKAI">TERPAKAI</option>
                <option value="RUSAK">RUSAK</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-teal-100 dark:border-gray-700 overflow-hidden transition-all duration-1000 ${isVisible.table ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          data-animate="table"
        >
          <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Daftar Barang</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Menampilkan {filteredItems.length} dari {items.length} item</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Nama Barang
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Type/Model
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    MAC Address
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Serial Number
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Kondisi
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group ${isVisible.table ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                        }`}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                        {item.nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {item.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-mono">
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600">
                          {item.mac_address}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-mono">
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600">
                          {item.serial_number}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {item.kondisi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-2 text-xs font-bold rounded-xl ${getStatusColor(item.status)} transform transition-all duration-300 hover:scale-110 shadow-lg`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {item.lokasi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => navigate(`/item/${item.id}`)}
                          className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/30 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 mb-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.908-6.06 2.39l-.993-.993A9.953 9.953 0 0112 13c2.59 0 4.973.982 6.76 2.593l-.993.993A7.962 7.962 0 0112 15z" />
                        </svg>
                        <p className="text-lg font-medium">Tidak ada data yang ditemukan</p>
                        <p className="text-sm">Coba ubah kata kunci pencarian atau filter</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`relative mt-20 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-t border-teal-200 dark:border-gray-700 transition-all duration-1000 ${isVisible.footer ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        data-animate="footer"
      >
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-100 h-100 px-3 py-2 bg-teal-600 dark:bg-teal-700 rounded-lg flex items-center justify-center transform hover:scale-105 transition-all duration-300">
                <div className="w-100 h-100">
                  <img src={logo} alt="Logo" width="150" height="150" className="w-100 h-100 object-contain drop-shadow-lg" />
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              &copy; 2025 PT. Medianusa Permana. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;