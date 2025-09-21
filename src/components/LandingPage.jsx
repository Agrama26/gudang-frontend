import { useState } from 'react';
import logo from '../assets/logo.png';
import 'tailwindcss/tailwind.css';
import '../index.css';
import '../App.css';
import { useNavigate } from 'react-router-dom'; 
import { useDarkMode } from '../contexts/DarkModeContext';
import DarkModeToggle from './DarkModeToggle';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const features = [
    {
      title: "Tambah Barang",
      description: "Tambahkan barang baru dengan mudah ke dalam sistem inventori dengan validasi data yang akurat",
      icon: (
        <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-110">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"></path>
          </svg>
        </div>
      )
    },
    {
      title: "Update Status",
      description: "Perbarui status barang secara real-time dengan sistem tracking otomatis dan riwayat lengkap",
      icon: (
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-110">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"></path>
          </svg>
        </div>
      )
    },
    {
      title: "Riwayat Barang",
      description: "Lihat riwayat lengkap penggunaan dan perpindahan barang dengan timeline yang detail",
      icon: (
        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-110">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
          </svg>
        </div>
      )
    },
    {
      title: "Monitoring Kondisi",
      description: "Monitor kondisi barang dengan sistem peringatan otomatis dan laporan maintenance",
      icon: (
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-110">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
          </svg>
        </div>
      )
    },
    {
      title: "Barcode/QR System",
      description: "Generate dan scan QR code untuk identifikasi barang yang cepat dan akurat",
      icon: (
        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-110">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zm2 2V5h1v1h-1z" clipRule="evenodd"></path>
          </svg>
        </div>
      )
    },
    {
      title: "Analytics Dashboard",
      description: "Analisis mendalam data inventori dengan visualisasi interaktif dan laporan komprehensif",
      icon: (
        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-110">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
          </svg>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 dark:bg-teal-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-emerald-200 dark:bg-emerald-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-teal-200 dark:border-gray-700 shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-100 h-100 group relative bg-teal-600 dark:bg-teal-700 px-3 py-2 rounded-xl shadow-lg hover:shadow-teal-300 dark:hover:shadow-teal-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <div className="">
                  <img src={logo} alt="Logo" width="150" height="150" className="w-100 h-100 object-contain drop-shadow-lg" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                  PT. Medianusa Permana
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Sistem Manajemen Inventori
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              <button
                onClick={() => navigate('/login')}
                className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:bg-teal-50 dark:hover:bg-gray-700"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-500 dark:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative container mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-teal-600 via-blue-600 to-teal-600 dark:from-teal-400 dark:via-blue-400 dark:to-teal-400 bg-clip-text text-transparent leading-tight">
              Data Barang
            </h1>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-blue-600 dark:from-blue-400 dark:via-teal-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
              PT. Medianusa Permana
            </h1>
            <div className="flex justify-center space-x-2 mt-6">
              <div className="w-3 h-3 bg-teal-600 dark:bg-teal-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>

          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Sistem manajemen inventori modern untuk peralatan jaringan Mikrotik dan TP-Link
            di 5 cabang PT. Medianusa Permana (Medan, Batam, Pekan Baru, Tarutung, Jakarta)
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/login')}
              className="group relative bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-500 dark:to-blue-500 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 hover:from-teal-700 hover:to-blue-700 dark:hover:from-teal-400 dark:hover:to-blue-400 transform hover:scale-105 overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 transform skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
              <span className="relative z-10 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 102 0V4a1 1 0 011-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path>
                </svg>
                <span>Mulai Sekarang</span>
              </span>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="group bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 border-2 border-teal-600 dark:border-teal-400 px-10 py-4 rounded-xl text-lg font-bold hover:bg-teal-50 dark:hover:bg-gray-700 hover:border-teal-700 dark:hover:border-teal-300 transition-all duration-300 backdrop-blur-sm shadow-lg transform hover:scale-105"
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                </svg>
                <span>Lihat Demo</span>
              </span>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Kelola inventori peralatan jaringan Anda dengan mudah menggunakan fitur-fitur canggih yang kami sediakan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-teal-100 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-gray-700 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-32">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-12 border border-teal-100 dark:border-gray-700 shadow-2xl">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Dipercaya untuk Mengelola Inventori Jaringan
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Statistik penggunaan sistem di PT. Medianusa Permana
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
                  1000+
                </div>
                <div className="text-gray-600 dark:text-gray-300">Barang Terdaftar</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  5
                </div>
                <div className="text-gray-600 dark:text-gray-300">Cabang</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  24/7
                </div>
                <div className="text-gray-600 dark:text-gray-300">Monitoring</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
                  99.9%
                </div>
                <div className="text-gray-600 dark:text-gray-300">Akurasi Data</div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Info Section */}
        <div className="mt-32">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-700 dark:to-blue-700 rounded-2xl p-12 text-white shadow-2xl">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-6">
                Tentang PT. Medianusa Permana
              </h3>
              <p className="text-xl leading-relaxed max-w-4xl mx-auto mb-8">
                PT. Medianusa Permana adalah perusahaan yang bergerak di bidang pelayanan jaringan
                dengan 4 cabang di Indonesia: Medan, Pekan Baru, Tarutung, dan Jakarta.
                Kami mengelola inventori peralatan jaringan seperti Mikrotik dan TP-Link dengan
                sistem digital yang modern dan efisien.
              </p>
              <div className="grid md:grid-cols-5 gap-6 mt-12">
                <div className="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-2">Batam</h4>
                  <p className="text-sm opacity-90">Kantor Pusat</p>
                </div>
                <div className="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-2">Medan</h4>
                  <p className="text-sm opacity-90">Kantor Cabang</p>
                </div>
                <div className="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-2">Pekan Baru</h4>
                  <p className="text-sm opacity-90">Kantor Cabang</p>
                </div>
                <div className="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-2">Tarutung</h4>
                  <p className="text-sm opacity-90">Cabang Regional</p>
                </div>
                <div className="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-2">Jakarta</h4>
                  <p className="text-sm opacity-90">Cabang Metropolitan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-teal-200 dark:border-gray-700 rounded-2xl p-12 shadow-2xl shadow-teal-500/20">
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Siap Mengoptimalkan Inventori Anda?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan sistem manajemen inventori modern yang telah dipercaya
              untuk mengelola ribuan peralatan jaringan
            </p>
            <button
              onClick={() => navigate('/login')}
              className="group bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-500 dark:to-blue-500 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 hover:from-teal-700 hover:to-blue-700 dark:hover:from-teal-400 dark:hover:to-blue-400 transform hover:scale-105 relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 transform skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
              <span className="relative z-10 flex items-center space-x-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>Mulai Sekarang</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative mt-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-teal-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-100 h-100 px-3 py-2 bg-teal-600 dark:bg-teal-700 rounded-lg flex items-center justify-center transform hover:scale-105 transition-all duration-300">
                <div className="">
                  <img src={logo} alt="Logo" width="150" height="150" className="w-100 h-100 object-contain drop-shadow-lg" />
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              © 2025 PT. Medianusa Permana. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;