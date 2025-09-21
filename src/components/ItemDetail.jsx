import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import DarkModeToggle from './DarkModeToggle';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [item, setItem] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newLokasi, setNewLokasi] = useState('');
  const [newKondisi, setNewKondisi] = useState('');
  const [newKeterangan, setNewKeterangan] = useState('');

  // Fetch data from API
  const fetchItemDetails = async () => {
    setLoading(true);
    try {
      const { barangAPI } = await import('../utils/api');
      const data = await barangAPI.getById(id);
      setItem(data.barang);
      setHistory(data.riwayat);
      setNewStatus(data.barang.status);
      setNewLokasi(data.barang.lokasi);
      setNewKondisi(data.barang.kondisi);
      setNewKeterangan(data.barang.keterangan);
    } catch (error) {
      console.error('Error fetching item details:', error);
      setItem(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (
      newStatus !== item.status ||
      newLokasi !== item.lokasi ||
      newKondisi !== item.kondisi ||
      newKeterangan !== item.keterangan
    ) {
      try {
        const { barangAPI } = await import('../utils/api');

        const changes = [];
        if (newStatus !== item.status) {
          changes.push(`Status diubah dari ${item.status} ke ${newStatus}`);
        }
        if (newLokasi !== item.lokasi) {
          changes.push(`Lokasi dipindah dari ${item.lokasi} ke ${newLokasi}`);
        }
        if (newKondisi !== item.kondisi) {
          changes.push(`Kondisi diubah dari ${item.kondisi} ke ${newKondisi}`);
        }
        if (newKeterangan !== item.keterangan) {
          changes.push(`Keterangan diubah dari ${item.keterangan} ke ${newKeterangan}`);
        }
        const Info = changes.join(', ');

        await barangAPI.updateStatus(id, {
          status: newStatus,
          lokasi: newLokasi,
          kondisi: newKondisi,
          keterangan: newKeterangan,
          info: Info
        });

        await fetchItemDetails();
        alert('Status dan lokasi berhasil diupdate!');
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Gagal mengupdate status. Silakan coba lagi.');
      }
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'READY':
        return isDarkMode 
          ? 'bg-green-800/50 text-green-300 border-green-300/30' 
          : 'bg-green-900/50 text-green-400 border-green-400/30';
      case 'TERPAKAI':
        return isDarkMode 
          ? 'bg-blue-800/50 text-blue-300 border-blue-300/30' 
          : 'bg-blue-900/50 text-blue-400 border-blue-400/30';
      case 'RUSAK':
        return isDarkMode 
          ? 'bg-red-800/50 text-red-300 border-red-300/30' 
          : 'bg-red-900/50 text-red-400 border-red-400/30';
      default:
        return isDarkMode 
          ? 'bg-gray-700/50 text-gray-300 border-gray-300/30' 
          : 'bg-gray-900/50 text-gray-400 border-gray-400/30';
    }
  };

  // Mock QR Code component
  const MockQRCode = ({ value, size }) => (
    <div
      className={`${isDarkMode ? 'bg-gray-100' : 'bg-white'} flex items-center justify-center font-mono text-xs text-center p-2 rounded`}
      style={{ width: size, height: size }}
    >
      <div className="grid grid-cols-8 gap-px">
        {[...Array(64)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 ${Math.random() > 0.5 ? (isDarkMode ? 'bg-gray-800' : 'bg-black') : (isDarkMode ? 'bg-gray-100' : 'bg-white')}`}
          />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-black'} text-white flex items-center justify-center relative overflow-hidden transition-colors duration-300`}>
        {/* Dark Mode Toggle */}
        <div className="fixed top-6 right-6 z-50">
          <DarkModeToggle />
        </div>

        {/* Loading Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 255, ${isDarkMode ? '0.2' : '0.3'}) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, ${isDarkMode ? '0.2' : '0.3'}) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px',
              animation: 'gridScan 3s linear infinite'
            }}
          />

          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 ${isDarkMode ? 'bg-cyan-300' : 'bg-cyan-400'} rounded-full animate-ping`}
              style={{
                left: `${20 + (i * 10)}%`,
                top: `${30 + (i * 5)}%`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center">
          <div className="relative">
            <div className={`w-16 h-16 border-4 ${isDarkMode ? 'border-cyan-300/30 border-t-cyan-300' : 'border-cyan-400/30 border-t-cyan-400'} rounded-full animate-spin mx-auto mb-4`}></div>
            <div className={`absolute inset-0 w-16 h-16 border-4 ${isDarkMode ? 'border-blue-300/20 border-b-blue-300' : 'border-blue-400/20 border-b-blue-400'} rounded-full animate-spin mx-auto`} style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
          </div>
          <p className={`${isDarkMode ? 'text-cyan-300' : 'text-cyan-400'} font-mono uppercase tracking-wider`}>Scanning Item Data...</p>
          <div className="mt-4 flex justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 ${isDarkMode ? 'bg-cyan-300' : 'bg-cyan-400'} rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes gridScan {
            0% { transform: translate(0, 0); }
            100% { transform: translate(30px, 30px); }
          }
        `}</style>
      </div>
    );
  }

  if (!item) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-black'} text-white flex items-center justify-center transition-colors duration-300`}>
        {/* Dark Mode Toggle */}
        <div className="fixed top-6 right-6 z-50">
          <DarkModeToggle />
        </div>

        <div className="text-center">
          <div className={`text-6xl ${isDarkMode ? 'text-red-300' : 'text-red-400'} mb-4`}>⚠</div>
          <p className={`${isDarkMode ? 'text-red-300' : 'text-red-400'} font-mono text-xl mb-6`}>ITEM NOT FOUND</p>
          <button
            onClick={handleBack}
            className={`bg-gradient-to-r ${
              isDarkMode 
                ? 'from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300' 
                : 'from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400'
            } text-black px-6 py-3 rounded-sm font-mono uppercase tracking-wider transition-all duration-300`}
          >
            ← Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-black'} text-white relative overflow-hidden transition-colors duration-300`}>
      {/* Dark Mode Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <DarkModeToggle />
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Hexagonal Grid */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="hexPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <polygon points="5,1 8.66,3 8.66,7 5,9 1.34,7 1.34,3" fill="none" stroke={isDarkMode ? "#06b6d4" : "#00ffff"} strokeWidth="0.2" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#hexPattern)" className="animate-pulse" />
          </svg>
        </div>

        {/* Data Flow Lines */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-px bg-gradient-to-b from-transparent via-cyan-400 dark:via-cyan-300 to-transparent opacity-40`}
            style={{
              left: `${15 + (i * 15)}%`,
              height: '100vh',
              animation: `dataFlow ${3 + i}s linear infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}

        {/* Scanning Beams */}
        <div className={`absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 dark:via-cyan-300 to-transparent opacity-60 animate-scanBeam`}></div>
      </div>

      {/* Header */}
      <div className={`relative z-10 ${isDarkMode ? 'bg-gray-800/80' : 'bg-gray-900/80'} backdrop-blur-sm border-b border-cyan-500/30 dark:border-cyan-400/30`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 bg-gradient-to-br ${isDarkMode ? 'from-cyan-300 to-blue-400' : 'from-cyan-400 to-blue-500'} rounded-sm animate-pulse`}></div>
              <h1 className={`text-2xl font-bold bg-gradient-to-r ${
                isDarkMode 
                  ? 'from-cyan-300 to-blue-300' 
                  : 'from-cyan-400 to-blue-400'
              } bg-clip-text text-transparent font-mono`}>
                ITEM ANALYSIS MODULE
              </h1>
            </div>
            <button
              onClick={handleBack}
              className={`group bg-transparent border ${
                isDarkMode 
                  ? 'border-cyan-300 text-cyan-300 hover:bg-cyan-300' 
                  : 'border-cyan-400 text-cyan-400 hover:bg-cyan-400'
              } hover:text-black px-6 py-2 rounded-sm transition-all duration-300 font-mono uppercase tracking-wider relative overflow-hidden`}
            >
              <span className={`absolute inset-0 ${isDarkMode ? 'bg-cyan-300' : 'bg-cyan-400'} transform translate-x-full group-hover:translate-x-0 transition-transform duration-300`}></span>
              <span className="relative z-10">← RETURN TO DASHBOARD</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Item Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className={`${
              isDarkMode ? 'bg-gray-800/80' : 'bg-gray-900/80'
            } backdrop-blur-md rounded-lg border border-cyan-500/30 dark:border-cyan-400/30 shadow-2xl shadow-cyan-500/20 p-8 relative overflow-hidden`}>
              
              {/* Header with status indicator */}
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-cyan-300' : 'text-cyan-400'} font-mono uppercase tracking-wider`}>Device Information</h2>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 ${isDarkMode ? 'bg-green-300' : 'bg-green-400'} rounded-full animate-ping`}></div>
                  <span className={`${isDarkMode ? 'text-green-300' : 'text-green-400'} text-xs font-mono`}>ACTIVE</span>
                </div>
              </div>

              {/* Scanning line animation */}
              <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 dark:via-cyan-300 to-transparent animate-scanInternal`}></div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { label: 'Device Name', value: item.nama },
                  { label: 'Type/Model', value: item.type },
                  { label: 'MAC Address', value: item.mac_address, mono: true },
                  { label: 'Serial Number', value: item.serial_number, mono: true },
                  { label: 'Condition', value: item.kondisi, mono: true },
                  { label: 'Kota', value: item.kota, mono: true },
                  { label: 'Current Location', value: item.lokasi },
                  { label: 'Notes', value: item.keterangan, span: true }
                ].map((field, index) => (
                  <div key={index} className={`group ${field.span ? 'md:col-span-2' : ''}`}>
                    <label className={`block text-sm font-mono uppercase tracking-wider ${isDarkMode ? 'text-cyan-300/80' : 'text-cyan-400/80'} mb-2`}>
                      <span className="flex items-center">
                        <div className={`w-2 h-2 ${isDarkMode ? 'bg-cyan-300' : 'bg-cyan-400'} rounded-full mr-2 animate-pulse`}></div>
                        {field.label}
                      </span>
                    </label>
                    <div className="relative">
                      <p className={`p-3 ${
                        isDarkMode ? 'bg-gray-700/50 border-gray-500' : 'bg-black/50 border-gray-600'
                      } border rounded-sm text-white transition-all duration-300 group-hover:border-cyan-400/50 ${field.mono ? 'font-mono' : ''}`}>
                        {field.value || 'N/A'}
                      </p>
                      <div className="absolute inset-0 border border-cyan-400/20 dark:border-cyan-300/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                ))}

                {/* Status with special styling */}
                <div className="group">
                  <label className={`block text-sm font-mono uppercase tracking-wider ${isDarkMode ? 'text-cyan-300/80' : 'text-cyan-400/80'} mb-2`}>
                    <span className="flex items-center">
                      <div className={`w-2 h-2 ${isDarkMode ? 'bg-cyan-300' : 'bg-cyan-400'} rounded-full mr-2 animate-pulse`}></div>
                      Status
                    </span>
                  </label>
                  <div className="relative">
                    <span className={`inline-flex px-4 py-2 text-sm font-mono font-bold rounded-sm border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status & Location Update */}
            <div className={`${
              isDarkMode ? 'bg-gray-800/80' : 'bg-gray-900/80'
            } backdrop-blur-md rounded-lg border border-cyan-500/30 dark:border-cyan-400/30 shadow-2xl shadow-cyan-500/20 p-8 relative overflow-hidden`}>
              
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-cyan-300' : 'text-cyan-400'} font-mono uppercase tracking-wider`}>System Update Module</h2>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 ${isDarkMode ? 'bg-yellow-300' : 'bg-yellow-400'} rounded-full animate-ping`}></div>
                  <span className={`${isDarkMode ? 'text-yellow-300' : 'text-yellow-400'} text-xs font-mono`}>STANDBY</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className={`block text-sm font-mono uppercase tracking-wider ${isDarkMode ? 'text-cyan-300' : 'text-cyan-400'} mb-3`}>
                      <span className="flex items-center">
                        <div className={`w-2 h-2 ${isDarkMode ? 'bg-cyan-300' : 'bg-cyan-400'} rounded-full mr-2 animate-pulse`}></div>
                        New Status
                      </span>
                    </label>
                    <div className="relative">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className={`w-full p-4 ${
                          isDarkMode ? 'bg-gray-700/50 border-gray-500' : 'bg-black/50 border-gray-600'
                        } border rounded-sm text-white font-mono focus:border-cyan-400 dark:focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 hover:border-gray-400`}
                      >
                        <option value="READY" className={isDarkMode ? "bg-gray-800" : "bg-gray-900"}>READY</option>
                        <option value="TERPAKAI" className={isDarkMode ? "bg-gray-800" : "bg-gray-900"}>TERPAKAI</option>
                        <option value="RUSAK" className={isDarkMode ? "bg-gray-800" : "bg-gray-900"}>RUSAK</option>
                      </select>
                      <div className="absolute inset-0 border border-cyan-400/20 dark:border-cyan-300/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  <div className="group">
                    <label className={`block text-sm font-mono uppercase tracking-wider ${isDarkMode ? 'text-cyan-300' : 'text-cyan-400'} mb-3`}>
                      <span className="flex items-center">
                        <div className={`w-2 h-2 ${isDarkMode ? 'bg-cyan-300' : 'bg-cyan-400'} rounded-full mr-2 animate-pulse`}></div>
                        New Location
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newLokasi}
                        onChange={(e) => setNewLokasi(e.target.value)}
                        className={`w-full p-4 ${
                          isDarkMode ? 'bg-gray-700/50 border-gray-500' : 'bg-black/50 border-gray-600'
                        } border rounded-sm text-white font-mono focus:border-cyan-400 dark:focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 hover:border-gray-400`}
                        placeholder="Enter new location..."
                      />
                      <div className="absolute inset-0 border border-cyan-400/20 dark:border-cyan-300/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  <div className="group">
                    <label className={`block text-sm font-mono uppercase tracking-wider ${isDarkMode ? 'text-cyan-300' : 'text-cyan-400'} mb-3`}>
                      <span className="flex items-center">
                        <div className={`w-2 h-2 ${isDarkMode ? 'bg-cyan-300' : 'bg-cyan-400'} rounded-full mr-2 animate-pulse`}></div>
                        Kondisi
                      </span>
                    </label>
                    <div className="relative">
                      <select
                        value={newKondisi}
                        onChange={(e) => setNewKondisi(e.target.value)}
                        className={`w-full p-4 ${
                          isDarkMode ? 'bg-gray-700/50 border-gray-500' : 'bg-black/50 border-gray-600'
                        } border rounded-sm text-white font-mono focus:border-cyan-400 dark:focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 hover:border-gray-400`}
                      >
                        <option value="Baru" className={isDarkMode ? "bg-gray-800" : "bg-gray-900"}>Baru</option>
                        <option value="Baik" className={isDarkMode ? "bg-gray-800" : "bg-gray-900"}>Baik</option>
                        <option value="Rusak Ringan" className={isDarkMode ? "bg-gray-800" : "bg-gray-900"}>Rusak Ringan</option>
                        <option value="Rusak Berat" className={isDarkMode ? "bg-gray-800" : "bg-gray-900"}>Rusak Berat</option>
                      </select>
                      <div className="absolute inset-0 border border-cyan-400/20 dark:border-cyan-300/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  <div className="group">
                    <label className={`block text-sm font-mono uppercase tracking-wider ${isDarkMode ? 'text-cyan-300' : 'text-cyan-400'} mb-3`}>
                      <span className="flex items-center">
                        <div className={`w-2 h-2 ${isDarkMode ? 'bg-cyan-300' : 'bg-cyan-400'} rounded-full mr-2 animate-pulse`}></div>
                        Notes
                      </span>
                    </label>
                    <div className="relative">
                      <textarea
                        rows="1"
                        value={newKeterangan}
                        onChange={(e) => setNewKeterangan(e.target.value)}
                        className={`w-full p-4 ${
                          isDarkMode ? 'bg-gray-700/50 border-gray-500' : 'bg-black/50 border-gray-600'
                        } border rounded-sm text-white font-mono focus:border-cyan-400 dark:focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 hover:border-gray-400`}
                        placeholder="Enter additional notes (optional)..."
                      ></textarea>
                      <div className="absolute inset-0 border border-cyan-400/20 dark:border-cyan-300/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleStatusUpdate}
                  disabled={newStatus === item.status && newLokasi === item.lokasi && newKondisi === item.kondisi && newKeterangan === item.keterangan}
                  className={`w-full group relative overflow-hidden py-4 px-6 rounded-sm font-mono uppercase tracking-wider font-bold transition-all duration-300 ${
                    newStatus !== item.status || newLokasi !== item.lokasi || newKondisi !== item.kondisi || newKeterangan !== item.keterangan
                      ? `bg-gradient-to-r ${
                          isDarkMode 
                            ? 'from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300' 
                            : 'from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400'
                        } text-black hover:shadow-2xl hover:shadow-cyan-500/30`
                      : `${isDarkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-700 text-gray-400'} cursor-not-allowed`
                  }`}
                >
                  <span className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                  <span className="relative z-10">
                    {newStatus !== item.status || newLokasi !== item.lokasi || newKondisi !== item.kondisi || newKeterangan !== item.keterangan ? '▶ Execute Update' : '✓ No Changes Detected'}
                  </span>
                </button>

                {(newStatus !== item.status || newLokasi !== item.lokasi || newKondisi !== item.kondisi || newKeterangan !== item.keterangan) && (
                  <div className={`p-4 ${
                    isDarkMode ? 'bg-blue-800/30 border-blue-300/30' : 'bg-blue-900/30 border-blue-400/30'
                  } border rounded-sm`}>
                    <p className={`${isDarkMode ? 'text-blue-300' : 'text-blue-400'} font-mono text-sm uppercase tracking-wider mb-2`}>
                      <span className="flex items-center">
                        <div className={`w-2 h-2 ${isDarkMode ? 'bg-blue-300' : 'bg-blue-400'} rounded-full mr-2 animate-ping`}></div>
                        Pending Changes:
                      </span>
                    </p>
                    {newStatus !== item.status && (
                      <p className={`${isDarkMode ? 'text-blue-200' : 'text-blue-300'} font-mono text-sm`}>
                        • Status: {item.status} → {newStatus}
                      </p>
                    )}
                    {newLokasi !== item.lokasi && (
                      <p className={`${isDarkMode ? 'text-blue-200' : 'text-blue-300'} font-mono text-sm`}>
                        • Location: {item.lokasi} → {newLokasi}
                      </p>
                    )}
                    {newKondisi !== item.kondisi && (
                      <p className={`${isDarkMode ? 'text-blue-200' : 'text-blue-300'} font-mono text-sm`}>
                        • Kondisi: {item.kondisi} → {newKondisi}
                      </p>
                    )}
                    {newKeterangan !== item.keterangan && (
                      <p className={`${isDarkMode ? 'text-blue-200' : 'text-blue-300'} font-mono text-sm`}>
                        • Notes: {item.keterangan || 'N/A'} → {newKeterangan || 'N/A'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* History */}
            <div className={`${
              isDarkMode ? 'bg-gray-800/80' : 'bg-gray-900/80'
            } backdrop-blur-md rounded-lg border border-cyan-500/30 dark:border-cyan-400/30 shadow-2xl shadow-cyan-500/20 p-8`}>
              
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-cyan-300' : 'text-cyan-400'} font-mono uppercase tracking-wider`}>Usage History Log</h2>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 ${isDarkMode ? 'bg-cyan-300' : 'bg-cyan-400'} rounded-full animate-ping`}></div>
                  <span className={`${isDarkMode ? 'text-cyan-300' : 'text-cyan-400'} text-xs font-mono`}>TRACKING</span>
                </div>
              </div>

              <div className="space-y-4">
                {history.map((entry, index) => (
                  <div key={entry.id} className="relative group">
                    <div className={`border-l-4 ${
                      isDarkMode ? 'border-cyan-300/50' : 'border-cyan-400/50'
                    } pl-6 py-4 ${
                      isDarkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-black/30 hover:bg-black/50'
                    } rounded-r-sm transition-all duration-300`}>
                      <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-3 h-3 ${isDarkMode ? 'bg-cyan-300' : 'bg-cyan-400'} rounded-full animate-pulse`}></div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`${isDarkMode ? 'text-cyan-300' : 'text-cyan-400'} font-mono text-sm`}>STATUS:</span>
                            <span className={`px-3 py-1 text-xs font-mono font-bold rounded-sm border ${getStatusColor(entry.status)}`}>
                              {entry.status}
                            </span>
                          </div>
                          <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-300'} font-mono text-sm`}>
                            <span className={`${isDarkMode ? 'text-cyan-300' : 'text-cyan-400'}`}>LOCATION:</span> {entry.lokasi}
                          </p>
                          <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-300'} font-mono text-sm mt-1`}>
                            <span className={`${isDarkMode ? 'text-cyan-300' : 'text-cyan-400'}`}>INFO:</span> {entry.keterangan}
                          </p>
                        </div>
                        <span className={`${isDarkMode ? 'text-cyan-300/60' : 'text-cyan-400/60'} font-mono text-xs`}>
                          {entry.tanggal}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="space-y-8">
            {/* QR Code Display */}
            <div className={`${
              isDarkMode ? 'bg-gray-800/80' : 'bg-gray-900/80'
            } backdrop-blur-md rounded-lg border border-cyan-500/30 dark:border-cyan-400/30 shadow-2xl shadow-cyan-500/20 p-8 relative overflow-hidden`}>
              
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-cyan-300' : 'text-cyan-400'} font-mono uppercase tracking-wider`}>QR Identity</h2>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 ${isDarkMode ? 'bg-green-300' : 'bg-green-400'} rounded-full animate-ping`}></div>
                  <span className={`${isDarkMode ? 'text-green-300' : 'text-green-400'} text-xs font-mono`}>ENCODED</span>
                </div>
              </div>

              <div className="text-center">
                <div className={`${isDarkMode ? 'bg-gray-100' : 'bg-white'} p-6 rounded-sm inline-block relative`}>
                  <div className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 ${isDarkMode ? 'border-gray-800' : 'border-black'}`}></div>
                  <div className={`absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 ${isDarkMode ? 'border-gray-800' : 'border-black'}`}></div>
                  <div className={`absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 ${isDarkMode ? 'border-gray-800' : 'border-black'}`}></div>

                  <MockQRCode
                    value={JSON.stringify({
                      id: item.id,
                      serial: item.serial_number,
                      nama: item.nama
                    })}
                    size={200}
                  />
                </div>
                <p className={`mt-4 ${isDarkMode ? 'text-cyan-300/80' : 'text-cyan-400/80'} font-mono text-sm`}>
                  SCAN FOR INSTANT ACCESS
                </p>
              </div>
            </div>

            {/* QR Scanner */}
            <div className={`${
              isDarkMode ? 'bg-gray-800/80' : 'bg-gray-900/80'
            } backdrop-blur-md rounded-lg border border-cyan-500/30 dark:border-cyan-400/30 shadow-2xl shadow-cyan-500/20 p-8`}>
              
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-cyan-300' : 'text-cyan-400'} font-mono uppercase tracking-wider`}>QR Scanner</h2>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full animate-ping ${
                    showQRScanner 
                      ? (isDarkMode ? 'bg-red-300' : 'bg-red-400')
                      : (isDarkMode ? 'bg-gray-300' : 'bg-gray-400')
                  }`}></div>
                  <span className={`text-xs font-mono ${
                    showQRScanner 
                      ? (isDarkMode ? 'text-red-300' : 'text-red-400')
                      : (isDarkMode ? 'text-gray-300' : 'text-gray-400')
                  }`}>
                    {showQRScanner ? 'SCANNING' : 'STANDBY'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowQRScanner(!showQRScanner)}
                className={`w-full group relative overflow-hidden py-4 px-6 rounded-sm font-mono uppercase tracking-wider font-bold transition-all duration-300 ${
                  showQRScanner
                    ? `bg-gradient-to-r ${
                        isDarkMode 
                          ? 'from-red-400 to-orange-400 hover:from-red-300 hover:to-orange-300' 
                          : 'from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400'
                      } text-white`
                    : `bg-gradient-to-r ${
                        isDarkMode 
                          ? 'from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300' 
                          : 'from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400'
                      } text-black`
                } hover:shadow-2xl`}
              >
                <span className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                <span className="relative z-10">
                  {showQRScanner ? '■ Deactivate Scanner' : '▶ Activate Scanner'}
                </span>
              </button>

              {showQRScanner && (
                <div className={`mt-6 p-6 ${
                  isDarkMode ? 'bg-gray-700/50 border-red-300/30' : 'bg-black/50 border-red-400/30'
                } border rounded-sm text-center relative`}>
                  <div className={`absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 ${isDarkMode ? 'border-red-300' : 'border-red-400'} animate-pulse`}></div>
                  <div className={`absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 ${isDarkMode ? 'border-red-300' : 'border-red-400'} animate-pulse`}></div>
                  <div className={`absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 ${isDarkMode ? 'border-red-300' : 'border-red-400'} animate-pulse`}></div>
                  <div className={`absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 ${isDarkMode ? 'border-red-300' : 'border-red-400'} animate-pulse`}></div>

                  <div className={`w-32 h-32 border-2 ${isDarkMode ? 'border-red-300/50' : 'border-red-400/50'} rounded-sm mx-auto mb-4 relative`}>
                    <div className={`absolute inset-0 border ${isDarkMode ? 'border-red-300' : 'border-red-400'} animate-pulse`}></div>
                    <div className={`absolute top-1/2 left-0 w-full h-0.5 ${isDarkMode ? 'bg-red-300' : 'bg-red-400'} animate-scanBeam`}></div>
                  </div>

                  <p className={`${isDarkMode ? 'text-red-300' : 'text-red-400'} font-mono text-sm uppercase tracking-wider`}>
                    Camera Module Required
                  </p>
                  <p className={`${isDarkMode ? 'text-red-300/60' : 'text-red-400/60'} font-mono text-xs mt-2`}>
                    Browser camera access needed for QR scanning
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes dataFlow {
          0% { transform: translateY(-100vh) scaleY(0); opacity: 0; }
          10% { opacity: 1; scaleY: 1; }
          90% { opacity: 1; scaleY: 1; }
          100% { transform: translateY(100vh) scaleY(0); opacity: 0; }
        }
        
        @keyframes scanBeam {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes scanInternal {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        .animate-scanBeam {
          animation: scanBeam 2s linear infinite;
        }
        
        .animate-scanInternal {
          animation: scanInternal 4s ease-in-out infinite;
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
          background: rgba(0, 255, 255, 0.7);
        }
      `}</style>
    </div>
  );
};

export default ItemDetail;