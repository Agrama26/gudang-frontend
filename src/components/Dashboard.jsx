import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { barangAPI } from '../utils/api'; // Sesuaikan path
import logo from '../assets/logo.png';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // Data barang
  const [filteredItems, setFilteredItems] = useState([]); // Barang yang sudah difilter
  const [loading, setLoading] = useState(true); // Status loading
  const [error, setError] = useState(null); // Status error

  const [searchQuery, setSearchQuery] = useState(''); // Query pencarian
  const [statusFilter, setStatusFilter] = useState(''); // Filter status
  const [kotaFilter, setKotaFilter] = useState(''); // Filter kota

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleKotaFilterChange = (e) => {
    setKotaFilter(e.target.value);
  };

  // Fetch data barang
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await barangAPI.getAll(); // Memanggil API untuk mendapatkan barang
        setItems(data); // Menyimpan data barang ke state
      } catch (err) {
        setError('Gagal memuat data barang'); // Menangani error jika API gagal
        console.error(err);
      } finally {
        setLoading(false); // Menghentikan loading
      }
    };

    fetchItems();
  }, []); // Efek dijalankan hanya sekali saat pertama kali komponen dimuat

  // Filter berdasarkan pencarian, status, dan kota
  useEffect(() => {
    let result = items;

    // Filter berdasarkan nama, serial number, dan lokasi
    if (searchQuery) {
      result = result.filter((item) =>
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.serial_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lokasi.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter berdasarkan status
    if (statusFilter) {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Filter berdasarkan kota
    if (kotaFilter) {
      result = result.filter((item) => item.kota === kotaFilter);
    }

    setFilteredItems(result); // Set filtered items
  }, [searchQuery, statusFilter, kotaFilter, items]); // Dependensi filter kota, status, dan pencarian

  const getStatusColor = (status) => {
    switch (status) {
      case 'READY':
        return 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-lg shadow-green-500/30';
      case 'TERPAKAI':
        return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-lg shadow-blue-500/30';
      case 'RUSAK':
        return 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg shadow-red-500/30';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-500/30';
    }
  };

  const statusCounts = useMemo(() => {
    return {
      READY: filteredItems.filter(item => item.status === 'READY').length,
      TERPAKAI: filteredItems.filter(item => item.status === 'TERPAKAI').length,
      RUSAK: filteredItems.filter(item => item.status === 'RUSAK').length,
    };
  }, [filteredItems]);

  // Simple pie chart component using SVG
  const PieChart = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return (
      <div className="w-48 h-48 flex items-center justify-center text-stone-600">
        No data available
      </div>
    );

    let cumulativePercentage = 0;
    const radius = 60;
    const strokeWidth = 40;

    return (
      <div className="w-48 h-48 flex flex-col items-center">
        <svg width="200" height="160" viewBox="0 0 200 160" className="mb-4">
          <circle
            cx="100"
            cy="80"
            r={radius}
            fill="none"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth={strokeWidth}
          />
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${percentage * 2.51} 628`;
            const strokeDashoffset = -cumulativePercentage * 2.51;
            cumulativePercentage += percentage;

            return (
              <circle
                key={index}
                cx="100"
                cy="80"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 100 80)"
                className="transition-all duration-1000 ease-out"
              />
            );
          })}
          <text x="100" y="85" textAnchor="middle" className="fill-black text-lg font-bold">
            {total}
          </text>
          <text x="100" y="100" textAnchor="middle" className="fill-stone-600 text-sm">
            Total
          </text>
        </svg>
        <div className="flex flex-wrap gap-2 text-xs">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-black">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const chartData = [
    { label: 'READY', value: statusCounts.READY, color: '#22C55E' },
    { label: 'TERPAKAI', value: statusCounts.TERPAKAI, color: '#3B82F6' },
    { label: 'RUSAK', value: statusCounts.RUSAK, color: '#EF4444' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-100 via-teal-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin h-16 w-16 border-4 border-transparent bg-gradient-to-r from-blue-600 to-teal-400 rounded-full"></div>
            <div className="h-16 w-16 border-4 border-transparent bg-gradient-to-r from-blue-600 to-teal-400 rounded-full absolute top-0 left-0 animate-pulse"></div>
          </div>
          <p className="mt-6 text-black font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-100 via-teal-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-sm border border-red-500/50 rounded-2xl p-8 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
            </div>
            <p className="text-red-300 font-semibold text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="relative backdrop-blur-xl bg-white/50 border-b border-teal-300 shadow-2xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-100 h-100 group relative bg-gradient-to-r from-blue-900 to-teal-400 px-3 py-2 rounded-xl shadow-lg hover:shadow-blue-200/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <img src={logo} alt="Logo" width="150" height="150" className="w-100 h-100 object-contain drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-teal-500 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                {user && (
                  <p className="text-sm text-blue-900 mt-1">
                    Welcome back, <span className="font-semibold text-blue-300">{user.username}</span>
                    <span className="ml-2 px-2 py-1 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full text-xs border border-blue-400/30">
                      {user.role}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/add-item')}
                className="group relative bg-gradient-to-r from-blue-900 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="relative z-10">+ Tambah Barang</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={() => navigate('/')}
                className="bg-white/10 backdrop-blur-sm text-black px-6 py-3 rounded-xl font-semibold border border-black/20 hover:bg-black/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                Home
              </button>

              {user && onLogout && (
                <button
                  onClick={onLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-red-400/30"
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

        {/* Header Section */}

        {/* Statistics Cards and Chart */}
        <div className="grid lg:grid-cols-5 gap-6 mb-8">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <div className="group bg-white backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-teal-300 h-full hover:bg-teal-300/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-black mb-4 text-center">Status Distribution</h3>
              <div className="flex justify-center">
                <PieChart data={chartData} />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="lg:col-span-3 grid md:grid-cols-2 xl:grid-cols-2 gap-4">
            {/* Total Items Card */}
            <div className="group bg-white backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-teal-300 hover:bg-teal-300/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="transform hover:rotate-45 hover:-translate-y-1 p-3 rounded-xl bg-gradient-to-r from-sky-400 to-blue-400 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-20 h-20 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-black mb-1">Total Items</p>
                  <p className="text-3xl font-bold text-black">{filteredItems.length}</p>
                </div>
              </div>
            </div>

            {/* Ready Card */}
            <div className="group bg-white backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-teal-300 hover:bg-teal-300/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="transform hover:rotate-45 hover:-translate-y-1 p-3 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-green-500/30 group-hover:shadow-green-500/50 transition-all duration-300">
                  <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-black mb-1">Ready</p>
                  <p className="text-3xl font-bold text-black">{statusCounts.READY}</p>
                </div>
              </div>
            </div>

            {/* Terpakai Card */}
            <div className="group bg-white backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-teal-300 hover:bg-teal-300/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="transform hover:rotate-45 hover:-translate-y-1 p-3 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
                  <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-black mb-1">Terpakai</p>
                  <p className="text-3xl font-bold text-black">{statusCounts.TERPAKAI}</p>
                </div>
              </div>
            </div>

            {/* Rusak Card */}
            <div className="group bg-white backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-teal-300 hover:bg-teal-300/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="transform hover:rotate-45 hover:-translate-y-1 p-3 rounded-xl bg-gradient-to-r from-red-400 to-pink-500 shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 transition-all duration-300">
                  <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-black mb-1">Rusak</p>
                  <p className="text-3xl font-bold text-black">{statusCounts.RUSAK}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-teal-300 mb-8">
          <div className="flex flex-col md:flex-row gap-4">

            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-stone-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                </svg>
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-teal-500/20 rounded-xl text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all duration-300"
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
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-teal-500/20 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="" className="bg-white/20">Semua Kota</option>
                <option value="Medan" className="bg-white/20">Medan</option>
                <option value="Pekan Baru" className="bg-white/20">Pekan Baru</option>
                <option value="Jakarta" className="bg-white/20">Jakarta</option>
                <option value="Tarutung" className="bg-white/20">Tarutung</option>
              </select>
              {/* Tampilkan barang yang telah difilter */}
              {/* <div>
                {filteredItems.map((item) => (
                  <div key={item.id}>
                    <p>{item.nama}</p>
                    <p>{item.kota}</p> 
                  </div>
                ))}
              </div> */}
            </div>

            {/* Status Filter */}
            <div className="md:w-64">
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-teal-500/20 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="" className="bg-white/20">Semua Status</option>
                <option value="READY" className="bg-white/20">READY</option>
                <option value="TERPAKAI" className="bg-white/20">TERPAKAI</option>
                <option value="RUSAK" className="bg-white/20">RUSAK</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white backdrop-blur-sm rounded-2xl shadow-2xl border border-teal-600/30 overflow-hidden">
          <div className="px-8 py-6 border-b border-teal-500/30">
            <h2 className="text-2xl font-bold text-black">Daftar Barang</h2>
            <p className="text-stone-400 mt-1">Menampilkan {filteredItems.length} dari {items.length} item</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-black/20 border-teal-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600 uppercase tracking-wider">
                    Nama Barang
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600 uppercase tracking-wider">
                    Type/Model
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600 uppercase tracking-wider">
                    MAC Address
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600 uppercase tracking-wider">
                    Serial Number
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600 uppercase tracking-wider">
                    Kondisi
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-600/40">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-teal-500/10 transition-all duration-300 group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                        {item.nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                        {item.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 font-mono">
                        <span className="bg-teal-300/50 px-2 py-1 rounded-lg border border-black/10">
                          {item.mac_address}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 font-mono">
                        <span className="bg-teal-300/50 px-2 py-1 rounded-lg border border-teal-300/10">
                          {item.serial_number}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                        {item.kondisi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-2 text-xs font-bold rounded-xl ${getStatusColor(item.status)} transform transition-all duration-300 hover:scale-110`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                        {item.lokasi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => navigate(`/item/${item.id}`)}
                          className="text-blue-400 hover:text-blue-300 font-semibold hover:bg-blue-500/10 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-stone-600">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 mb-4 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <footer className="relative mt-20 backdrop-blur-xl bg-white/50 border-t border-teal-500/30">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-100 h-100 px-3 py-2 bg-gradient-to-r from-blue-900 to-teal-400 rounded-lg flex items-center justify-center">
                <div className="w-100 h-100 ">
                  <img src={logo} alt="Logo" width="150" height="150" className="w-100 h-100 object-contain drop-shadow-lg" />
                </div>
              </div>
              {/* <span className="text-xl font-bold text-blue-900 ">PT. Medianusa Permana</span> */}
            </div>
            <p className="text-stone-600">
              &copy; 2025 PT. Medianusa Permana. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;