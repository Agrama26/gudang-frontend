import { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo.png';
import teknisi from '../assets/teknisi.png'
import 'tailwindcss/tailwind.css';
import '../index.css';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [isVisible, setIsVisible] = useState({});
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const observerRef = useRef();

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
              {/* <div>
                <h1 className={`text-xl font-bold transition-all duration-500 ${
                  isScrolled 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : 'text-white drop-shadow-lg'
                }`}>
                  PT. Medianusa Permana
                </h1>
              </div> */}
            </div>

            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              <button
                onClick={() => navigate('/login')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-500 ${isScrolled
                    ? 'text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-gray-700'
                    : 'text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-6 py-2 rounded-xl font-semibold shadow-lg transition-all duration-500 transform hover:scale-105 ${isScrolled
                    ? 'bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-500 dark:to-blue-500 text-white hover:shadow-teal-500/50'
                    : 'bg-white text-teal-600 hover:shadow-white/50'
                  }`}
              >
                Dashboard
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
                  Menghadirkan<br />
                  <span className="bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
                    Keunggulan Inovasi
                  </span><br />
                  <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                    Solusi dan Teknologi
                  </span>
                </h1>
                <p className="text-white/90 text-xl leading-relaxed max-w-2xl">
                  untuk Meningkatkan Management Barang
                </p>
              </div>

              <div className="sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="group bg-white text-teal-600 px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-gray-50 transform hover:scale-105 hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>Start</span>
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
                  <div className="w-full h-full bg-white/10 rounded-full animate-pulse"></div>
                </div>

                {/* Placeholder for woman image - you'll need to add the actual image */}
                <div className="relative z-10 bg-white/20 backdrop-blur-sm rounded-3xl p-8 border border-white/30">
                  <div className="h-500 w-500 bg-gradient-to-br from-white/30 to-white/10 rounded-2xl flex items-center justify-center">
                    <div className="text-center text-white/80">
                      <div className="group relative px-3 py-2 rounded-xl shadow-lg hover:shadow-teal-300 dark:hover:shadow-teal-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
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

        {/* Stats Section */}
        <section
          className={`mt-32 transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          data-animate="stats"
        >
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
              {[
                { number: '1000+', label: 'Barang Terdaftar', gradient: 'from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400' },
                { number: '5', label: 'Cabang', gradient: 'from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400' },
                { number: '24/7', label: 'Monitoring', gradient: 'from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400' },
                { number: '99.9%', label: 'Akurasi Data', gradient: 'from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400' }
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`space-y-2 transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.number}
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
                Tentang PT. Medianusa Permana
              </h3>
              <p className="text-xl leading-relaxed max-w-4xl mx-auto mb-8">
                PT. Medianusa Permana adalah perusahaan yang bergerak di bidang pelayanan jaringan
                dengan 5 cabang di Indonesia: Medan, Batam, Pekan Baru, Tarutung, dan Jakarta.
                Kami mengelola inventori peralatan jaringan seperti Mikrotik dan TP-Link dengan
                sistem digital yang modern dan efisien.
              </p>
              <div className="grid md:grid-cols-5 gap-6 mt-12">
                {[
                  { city: 'Batam', status: 'Kantor Pusat' },
                  { city: 'Medan', status: 'Kantor Cabang' },
                  { city: 'Pekan Baru', status: 'Kantor Cabang' },
                  { city: 'Tarutung', status: 'Cabang Regional' },
                  { city: 'Jakarta', status: 'Cabang Metropolitan' }
                ].map((office, index) => (
                  <div
                    key={index}
                    className={`bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-xl p-6 transition-all duration-1000 hover:scale-105 hover:bg-white/30 ${isVisible.company ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <h4 className="font-bold text-lg mb-2">{office.city}</h4>
                    <p className="text-sm opacity-90">{office.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

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

// Add missing import for DarkModeToggle at the top of the file
import DarkModeToggle from './DarkModeToggle';

export default LandingPage;