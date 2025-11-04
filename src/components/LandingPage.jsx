import { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo.png';
import teknisi from '../assets/teknisi.png'
import 'tailwindcss/tailwind.css';
import '../index.css';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import DarkModeToggle from './DarkModeToggle';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { barangAPI } from '../utils/api';
import Footer from './Footer';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [isVisible, setIsVisible] = useState({});
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const observerRef = useRef();
  const { t, isIndonesian } = useLanguage();

  // ✅ State untuk stats
  const [stats, setStats] = useState({
    totalBarang: 0,
    branches: 5,
    monitoring: '24/7',
    accuracy: 99.9
  });

  // ✅ State untuk animasi counter
  const [animatedStats, setAnimatedStats] = useState({
    totalBarang: 0,
    branches: 0,
    accuracy: 0
  });

  const [statsLoaded, setStatsLoaded] = useState(false);

  // ✅ Fetch data dari database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await barangAPI.getAll();
        setStats(prev => ({
          ...prev,
          totalBarang: data.length
        }));
        setStatsLoaded(true);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback ke data default jika error
        setStats(prev => ({
          ...prev,
          totalBarang: 1000
        }));
        setStatsLoaded(true);
      }
    };

    fetchStats();
  }, []);

  // ✅ Animasi counter dengan easing
  useEffect(() => {
    if (!statsLoaded || !isVisible.stats) return;

    const duration = 2000; // 2 detik
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameRate);

    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      // Easing function (easeOutQuart untuk smooth finish)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setAnimatedStats({
        totalBarang: Math.round(easeOutQuart * stats.totalBarang),
        branches: Math.round(easeOutQuart * stats.branches),
        accuracy: +(easeOutQuart * stats.accuracy).toFixed(1)
      });

      if (frame === totalFrames) {
        clearInterval(counter);
        // Set nilai final untuk memastikan presisi
        setAnimatedStats({
          totalBarang: stats.totalBarang,
          branches: stats.branches,
          accuracy: stats.accuracy
        });
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [statsLoaded, isVisible.stats, stats]);

  // Data kantor dengan koordinat peta
  const offices = [
    {
      city: 'Batam',
      status: t('headOffice'),
      coordinates: { lat: 1.132552595250969, lng: 104.0441689865064 },
      address: 'PT. Medianusa Permana Komp.Ruko Graha Kadin Blok F No.5 Kel.Teluk Tering , Kec.Batam Kota. Kepulauan Riau'
    },
    {
      city: 'Medan',
      status: t('branchOffice'),
      coordinates: { lat: 3.562563262081525, lng: 98.63902825767093 },
      address: 'Komp. Setia Budi Point B-03 Jl. Setia Budi Kel. Tanjung Sari Kec. Medan Selayang Medan, Sumatera Utara'
    },
    {
      city: 'Pekan Baru',
      status: t('branchOffice'),
      coordinates: { lat: 0.5086526529919154, lng: 101.43260122469819 },
      address: 'Jl. Balam Ujung No.46 A, Kp. Melayu, Kec. Sukajadi, Kota Pekanbaru, Riau'
    },
    {
      city: 'Tarutung',
      status: t('regionalBranch'),
      coordinates: { lat: 2.028112153851156, lng: 98.96079752051374 },
      address: 'Jl. Patuan Anggi No.22, Hutagalung Siwaluompu, Kec. Tarutung, Kabupaten Tapanuli Utara, Sumatera Utara'
    },
    {
      city: 'Jakarta',
      status: t('metropolitanBranch'),
      coordinates: { lat: -6.179238908641331, lng: 106.8127684325257 },
      address: 'Jl. Cideng Barat No.21B, RT.11/RW.1, Cideng, Kecamatan Gambir, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta'
    }
  ];

  // Handle scroll animation and navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Change navbar style when scrolled more than 50px
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-animate');
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [id]: true }));
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
  }, []);

  // Fungsi untuk menampilkan map
  const handleOfficeClick = (office) => {
    setSelectedOffice(office);
    setShowMap(true);
    // Scroll ke section map
    setTimeout(() => {
      document.getElementById('office-map-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  // Fungsi untuk menutup map
  const handleCloseMap = () => {
    setShowMap(false);
    setSelectedOffice(null);
  };

  // Generate Google Maps URL
  const getGoogleMapsUrl = (office) => {
    return `https://www.google.com/maps?q=${office.coordinates.lat},${office.coordinates.lng}&z=15&output=embed`;
  };

  const features = [
    {
      title: { en: "Add New Item", id: "Tambah Barang Baru" }[isIndonesian ? 'id' : 'en'],
      description: { en: "Easily add new inventory items with detailed specifications and categories", id: "Tambah barang inventori dengan spesifikasi dan kategori lengkap" }[isIndonesian ? 'id' : 'en'],
      icon: (
        <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-110">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"></path>
          </svg>
        </div>
      )
    },
    {
      title: { en: "Real-time Tracking", id: "Pelacakan waktu nyata" }[isIndonesian ? 'id' : 'en'],
      description: { en: "Update item status in real-time with automatic tracking and complete history", id: "Perbarui status barang secara real-time dengan sistem tracking otomatis dan riwayat lengkap" }[isIndonesian ? 'id' : 'en'],
      icon: (
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-110">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"></path>
          </svg>
        </div>
      )
    },
    {
      title: { en: "History Tracking", id: "Riwayat Barang" }[isIndonesian ? 'id' : 'en'],
      description: { en: "View complete history of item usage and movement with a detailed timeline", id: "Lihat riwayat lengkap penggunaan dan perpindahan barang dengan timeline yang detail" }[isIndonesian ? 'id' : 'en'],
      icon: (
        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-110">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
          </svg>
        </div>
      )
    },
    {
      title: { en: "Condition Monitoring", id: "Monitoring Kondisi" }[isIndonesian ? 'id' : 'en'],
      description: { en: "Monitor item conditions with automated alerts and maintenance reports", id: "Monitor kondisi barang dengan sistem peringatan otomatis dan laporan maintenance" }[isIndonesian ? 'id' : 'en'],
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
      title: { en: "Barcode Scanner", id: "Pemindai Kode Batang" }[isIndonesian ? 'id' : 'en'],
      description: { en: "Generate and scan QR codes for fast and accurate item identification", id: "Generate dan scan QR code untuk identifikasi barang yang cepat dan akurat" }[isIndonesian ? 'id' : 'en'],
      icon: (
        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-110">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zm2 2V5h1v1h-1z" clipRule="evenodd"></path>
          </svg>
        </div>
      )
    },
    {
      title: { en: "Analytics & Reporting", id: "Analisis & Pelaporan" }[isIndonesian ? 'id' : 'en'],
      description: { en: "Deep dive into inventory data with interactive visualizations and comprehensive reports", id: "Analisis mendalam data inventori dengan visualisasi interaktif dan laporan komprehensif" }[isIndonesian ? 'id' : 'en'],
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

      {/* Navigation - Dynamic Transparency */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
        ? 'backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-b border-teal-200 dark:border-gray-700 shadow-lg'
        : 'bg-transparent border-b border-transparent'
        }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="group relative">
                <img
                  src={logo}
                  alt="Logo"
                  width="150"
                  height="150"
                  className={`w-32 md:w-30 lg:w-40 object-contain drop-shadow-lg transition-all duration-500 ${isScrolled
                    ? 'filter invert dark:invert-0'
                    : 'filter invert-0 brightness-0 dark:invert'
                    }`}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <DarkModeToggle />
              <button
                onClick={() => navigate('/login')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-500 ${isScrolled
                  ? 'text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-gray-700'
                  : 'text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
              >
                {t('login')}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-6 py-2 rounded-xl font-semibold shadow-lg transition-all duration-500 transform hover:scale-105 ${isScrolled
                  ? 'bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-500 dark:to-blue-500 text-white hover:shadow-teal-500/50'
                  : 'bg-white text-teal-600 hover:shadow-white/50'
                  }`}
              >
                {t('dashboard')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="beranda" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background with parallax effect */}
        <div
          className="absolute inset-0 z-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            background: `linear-gradient(135deg, 
              ${isDarkMode ? '#0f766e' : '#14b8a6'} 0%, 
              ${isDarkMode ? '#0891b2' : '#0891b2'} 50%, 
              ${isDarkMode ? '#1d4ed8' : '#2563eb'} 100%)`
          }}
        >
          {/* Animated geometric shapes */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-bounce-slow"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-white/5 rounded-full animate-bounce-slow" style={{ animationDelay: '1s' }}></div>

            {/* Curved design element */}
            <div className="absolute top-0 right-0 w-1/2 h-full">
              <svg className="w-full h-full" viewBox="0 0 500 800" preserveAspectRatio="xMidYMid slice">
                <path
                  d="M0,400 C150,300 350,500 500,400 L500,800 L0,800 Z"
                  fill="rgba(255,255,255,0.1)"
                  className="animate-pulse"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div
              className={`space-y-8 transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                }`}
              data-animate="hero"
            >
              <div className="space-y-6">
                <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight">
                  {t('heroTitle')}<br />
                  <span className="bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
                    {t('heroSubtitle1')}
                  </span><br />
                  <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                    {t('heroSubtitle2')}
                  </span>
                </h1>
                <p className="text-white/90 text-xl leading-relaxed max-w-1xl">
                  {t('heroDescription')}
                </p>
              </div>

              <div className="sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="group bg-white text-teal-600 px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-gray-50 transform hover:scale-105 hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>{t('start')}</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {/* Right content - Woman illustration placeholder */}
            <div
              className={`relative transition-all duration-1000 delay-300 ${isVisible.hero ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                }`}
              data-animate="hero"
            >
              <div className="relative">
                {/* Decorative circle background */}
                <div className="absolute -inset-8">
                  <div className="w-full h-full bg-white/10 rounded-full"></div>
                </div>

                {/* Placeholder for woman image - you'll need to add the actual image */}
                <div className="relative z-10 ">
                  <div className="flex items-center justify-center">
                    <div className="text-center text-white/80">
                      <div className="group relative transition-all duration-300 transform">
                        <img src={teknisi} alt="Teknisi" width="400" height="400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <div className="container mx-auto px-6 py-20">
        {/* Features Section */}
        <section
          id="layanan"
          className={`mt-32 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          data-animate="features"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              {t('featuredFeatures')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              {t('featuresDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-teal-100 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-gray-700 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                data-animate="features"
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
        </section>

        {/*  Stats Section  */}
        <section
          className={`mt-32 transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          data-animate="stats"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-12 border border-teal-100 dark:border-gray-700 shadow-2xl">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                {t('trustedForInventory')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {t('usageStatistics')}
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                {
                  number: animatedStats.totalBarang,
                  label: t('registeredItems'),
                  gradient: 'from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400',
                  suffix: '+'
                },
                {
                  number: animatedStats.branches,
                  label: t('branches'),
                  gradient: 'from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400',
                  suffix: ''
                },
                {
                  number: '24/7',
                  label: t('monitoring'),
                  gradient: 'from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400',
                  suffix: '',
                  isText: true
                },
                {
                  number: animatedStats.accuracy,
                  label: t('dataAccuracy'),
                  gradient: 'from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400',
                  suffix: '%'
                }
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`space-y-2 transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.isText ? stat.number : `${stat.number}${stat.suffix}`}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Info Section */}
        <section
          id="tentang"
          className={`mt-32 transition-all duration-1000 ${isVisible.company ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          data-animate="company"
        >
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-700 dark:to-blue-700 rounded-2xl p-12 text-white shadow-2xl">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-6">
                {t('aboutCompany')}
              </h3>
              <p className="text-xl leading-relaxed max-w-4xl mx-auto mb-8">
                {t('companyDescription')}
              </p>
              <div className="grid md:grid-cols-5 gap-6 mt-12">
                {offices.map((office, index) => (
                  <div
                    key={index}
                    className={`bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-xl p-6 transition-all duration-1000 hover:scale-105 hover:bg-white/30 cursor-pointer group ${isVisible.company ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                    onClick={() => handleOfficeClick(office)}
                  >
                    <h4 className="font-bold text-lg mb-2 group-hover:text-teal-200 transition-colors duration-300">
                      {office.city}
                    </h4>
                    <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                      {office.status}
                    </p>
                    <div className="mt-2 flex items-center text-xs opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                      </svg>
                      {t('viewMap')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        {showMap && selectedOffice && (
          <section
            id="office-map-section"
            className={`mt-5 transition-all duration-1000 ${showMap ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 border border-teal-100 dark:border-gray-700 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {selectedOffice.city} - {selectedOffice.status}
                </h3>
                <button
                  onClick={handleCloseMap}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>{t('address')}:</strong> {selectedOffice.address}
                </p>
              </div>

              <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-600">
                <iframe
                  src={getGoogleMapsUrl(selectedOffice)}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${selectedOffice.city}`}
                ></iframe>
              </div>

              <div className="mt-4 flex justify-center">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedOffice.coordinates.lat},${selectedOffice.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                  {t('openInGoogleMaps')}
                </a>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-teal-200 dark:border-gray-700 rounded-2xl p-12 shadow-2xl shadow-teal-500/20">
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              {t('optimizeInventory')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              {t('optimizeDescription')}
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
                <span>{t('getStarted')}</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed left-6 bottom-6 z-50 group bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-500 dark:to-blue-500 text-white p-4 rounded-full shadow-2xl hover:shadow-teal-500/50 transition-all duration-500 transform ${isScrolled
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-10 scale-0 pointer-events-none'
          }`}
        aria-label="Scroll to top"
      >
        <svg
          className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>

        {/* Ripple effect on hover */}
        <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500"></span>

        {/* Tooltip */}
        <span className="absolute left-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Back to Top
          <span className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"></span>
        </span>
      </button>

      {/* Footer */}
      <Footer></Footer>
      {/* <footer className="relative mt-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-teal-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="group relative">
                <img
                  src={logo}
                  alt="Logo"
                  width="150"
                  height="150"
                  className="w-32 md:w-30 lg:w-40 object-contain drop-shadow-lg filter invert dark:invert-0"
                />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              © 2025 PT. Medianusa Permana. {t('allRightsReserved')}
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300">{t('privacyPolicy')}</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300">{t('termsOfService')}</a>
              <a href="./about" className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300">{t('contact')}</a>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default LandingPage;