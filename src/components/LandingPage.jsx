import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const LandingPage = () => {
  const [isFuturisticMode, setIsFuturisticMode] = useState(false);
  const navigate = useNavigate();

  // Toggle futuristic mode
  const toggleFuturisticMode = () => {
    setIsFuturisticMode(!isFuturisticMode);
  };

  const features = [
    {
      title: "Tambah Barang",
      description: "Tambahkan barang baru dengan mudah ke dalam sistem inventori",
      icon: (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${isFuturisticMode
          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/50'
          : 'bg-gradient-to-r from-purple-400 to-pink-400'
          }`}>
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
          </svg>
        </div>
      )
    },
    {
      title: "Update Status",
      description: "Perbarui status barang secara real-time dengan tracking otomatis",
      icon: (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${isFuturisticMode
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-blue-500/50'
          : 'bg-gradient-to-r from-blue-400 to-cyan-400'
          }`}>
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"></path>
          </svg>
        </div>
      )
    },
    {
      title: "Riwayat Barang",
      description: "Lihat riwayat lengkap penggunaan dan perpindahan barang",
      icon: (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${isFuturisticMode
          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-emerald-500/50'
          : 'bg-gradient-to-r from-emerald-400 to-green-400'
          }`}>
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
          </svg>
        </div>
      )
    },
    {
      title: "Monitoring Kondisi",
      description: "Monitor kondisi barang dengan sistem peringatan otomatis",
      icon: (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${isFuturisticMode
          ? 'bg-gradient-to-r from-yellow-500 to-orange-600 shadow-yellow-500/50'
          : 'bg-gradient-to-r from-yellow-400 to-orange-400'
          }`}>
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
          </svg>
        </div>
      )
    },
    {
      title: "Barcode/QR System",
      description: "Generate dan scan QR code untuk identifikasi barang yang cepat",
      icon: (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${isFuturisticMode
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-indigo-500/50'
          : 'bg-gradient-to-r from-indigo-400 to-purple-400'
          }`}>
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zm2 2V5h1v1h-1z" clipRule="evenodd"></path>
          </svg>
        </div>
      )
    },
    {
      title: "Analytics Dashboard",
      description: "Analisis mendalam data inventori dengan visualisasi interaktif",
      icon: (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${isFuturisticMode
          ? 'bg-gradient-to-r from-pink-500 to-red-600 shadow-pink-500/50'
          : 'bg-gradient-to-r from-red-400 to-pink-400'
          }`}>
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
          </svg>
        </div>
      )
    }
  ];

  if (isFuturisticMode) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Futuristic Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Neural Network Grid */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }}
          />

          {/* Data Streams */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-40"
              style={{
                left: `${(i * 8) + 5}%`,
                height: '100vh',
                animationDelay: `${i * 0.5}s`,
                animation: `dataStream ${6 + (i % 4)}s linear infinite`
              }}
            />
          ))}

          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animation: `float ${8 + Math.random() * 4}s ease-in-out infinite alternate`
              }}
            />
          ))}

          {/* Glowing Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>

          {/* Scanning Lines */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanHorizontal"></div>
          <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-scanVertical"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 bg-gray-900/80 backdrop-blur-xl border-b border-cyan-500/30 shadow-2xl">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-sm flex items-center justify-center shadow-lg animate-pulse">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono">
                  MEDIANUSA.PERMANA.SYS
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/login')}
                  className="text-cyan-400 hover:text-cyan-300 px-4 py-2 rounded-sm transition-all duration-300 font-mono uppercase tracking-wider border border-cyan-400/30 hover:border-cyan-400"
                >
                  Access Login
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-6 py-2 rounded-sm font-mono uppercase tracking-wider shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:from-cyan-400 hover:to-blue-400"
                >
                  ► Dashboard
                </button>
                <button
                  onClick={toggleFuturisticMode}
                  className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-sm font-mono text-sm hover:from-purple-400 hover:to-pink-400 transition-all duration-300"
                >
                  DEFAULT MODE
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent leading-tight font-mono animate-shimmer">
                DATA.BARANG
              </h1>
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight font-mono">
                PERMANA.MEDAN
              </h1>
              <div className="flex justify-center space-x-2 mt-6">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>

            <p className="text-xl text-cyan-100/80 max-w-4xl mx-auto leading-relaxed font-mono">
              [SYSTEM INITIALIZED] Advanced warehouse management protocol replacing legacy Excel databases
              with quantum-enhanced inventory tracking architecture
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/login')}
                className="group relative bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-10 py-4 rounded-sm text-lg font-bold font-mono uppercase tracking-wider shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:from-cyan-400 hover:to-blue-400 overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                <span className="relative z-10 flex items-center space-x-2">
                  <span>► Initialize Access</span>
                </span>
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="group bg-transparent border-2 border-cyan-400 text-cyan-400 px-10 py-4 rounded-sm text-lg font-bold font-mono uppercase tracking-wider hover:bg-cyan-400 hover:text-black transition-all duration-300 overflow-hidden relative"
              >
                <span className="absolute inset-0 bg-cyan-400 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                <span className="relative z-10">Demo Interface</span>
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4 font-mono uppercase tracking-wider">
                System Modules
              </h2>
              <p className="text-cyan-400/80 text-lg max-w-2xl mx-auto font-mono">
                [PROTOCOL ACTIVE] Advanced inventory management with neural processing capabilities
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-gray-900/80 backdrop-blur-md p-8 rounded-sm shadow-2xl border border-cyan-500/30 hover:border-cyan-400/70 hover:shadow-cyan-500/20 transition-all duration-500 transform hover:scale-105 relative overflow-hidden"
                >
                  {/* Internal scanning line */}
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanInternal"></div>

                  <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-4 font-mono uppercase tracking-wider group-hover:text-cyan-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Status indicator */}
                  <div className="absolute top-4 right-4 flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                    <span className="text-green-400 text-xs font-mono">ACTIVE</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-32 text-center">
            <div className="bg-gray-900/80 backdrop-blur-md border border-cyan-500/30 rounded-sm p-12 shadow-2xl shadow-cyan-500/20 relative overflow-hidden">
              {/* Internal effects */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanInternal"></div>

              <h3 className="text-3xl font-bold text-cyan-400 mb-4 font-mono uppercase tracking-wider">
                Ready to Initialize?
              </h3>
              <p className="text-cyan-100/80 text-lg mb-8 max-w-2xl mx-auto font-mono">
                Join thousands of enterprises who trust our neural inventory management system
                for their warehouse operations
              </p>
              <button
                onClick={() => navigate('/login')}
                className="group bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-12 py-4 rounded-sm text-xl font-bold font-mono uppercase tracking-wider shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:from-cyan-300 hover:to-blue-400 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                <span className="relative z-10">► Execute Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 mt-20 bg-gray-900/80 backdrop-blur-xl border-t border-cyan-500/30">
          <div className="container mx-auto px-6 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-sm flex items-center justify-center animate-pulse">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                  </svg>
                </div>
                <span className="text-xl font-bold text-cyan-400 font-mono">MEDIANUSA.PERMANA.SYS</span>
              </div>
              <p className="text-cyan-400/60 font-mono">
                © 2025 PT. MEDIANUSA PERMANA. ALL SYSTEMS OPERATIONAL.
              </p>
            </div>
          </div>
        </footer>

        {/* Optimized CSS Animations */}
        <style jsx>{`
          * {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            transform-style: preserve-3d;
          }
          
          @keyframes gridMove {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(50px, 50px, 0); }
          }
          
          @keyframes dataStream {
            0% { 
              transform: translate3d(0, -100vh, 0) scaleY(0); 
              opacity: 0; 
            }
            10% { 
              opacity: 1; 
              transform: translate3d(0, -80vh, 0) scaleY(1); 
            }
            90% { 
              opacity: 1; 
              transform: translate3d(0, 80vh, 0) scaleY(1); 
            }
            100% { 
              transform: translate3d(0, 100vh, 0) scaleY(0); 
              opacity: 0; 
            }
          }
          
          @keyframes float {
            0% { transform: translate3d(0, 0, 0) rotate(0deg); }
            50% { transform: translate3d(0, -20px, 0) rotate(180deg); }
            100% { transform: translate3d(0, 0, 0) rotate(360deg); }
          }
          
          @keyframes scanHorizontal {
            0% { transform: translate3d(-100%, 0, 0); }
            100% { transform: translate3d(100vw, 0, 0); }
          }
          
          @keyframes scanVertical {
            0% { transform: translate3d(0, -100%, 0); }
            100% { transform: translate3d(0, 100vh, 0); }
          }
          
          @keyframes scanInternal {
            0% { 
              transform: translate3d(-100%, 0, 0); 
              opacity: 0; 
            }
            50% { 
              opacity: 1; 
            }
            100% { 
              transform: translate3d(100%, 0, 0); 
              opacity: 0; 
            }
          }
          
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          
          @keyframes pulse-smooth {
            0%, 100% { 
              transform: scale(1);
              opacity: 1;
            }
            50% { 
              transform: scale(1.05);
              opacity: 0.8;
            }
          }
          
          .animate-scanHorizontal {
            animation: scanHorizontal 8s ease-in-out infinite;
            will-change: transform;
          }
          
          .animate-scanVertical {
            animation: scanVertical 6s ease-in-out infinite;
            animation-delay: 3s;
            will-change: transform;
          }
          
          .animate-scanInternal {
            animation: scanInternal 4s ease-in-out infinite;
            will-change: transform, opacity;
          }
          
          .animate-shimmer {
            background-size: 200% auto;
            animation: shimmer 3s linear infinite;
            will-change: background-position;
          }
          
          .animate-float {
            animation: float 8s ease-in-out infinite;
            will-change: transform;
          }
          
          .animate-pulse-smooth {
            animation: pulse-smooth 3s ease-in-out infinite;
            will-change: transform, opacity;
          }
          
          /* Performance optimizations */
          .gpu-accelerated {
            transform: translateZ(0);
            will-change: transform;
          }
          
          .backdrop-blur-xl, .backdrop-blur-md {
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
          }
        `}</style>
      </div>
    );
  }

  // Default Mode (Original Design)
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-teal-50 to-teal-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-stone-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative backdrop-blur-xl bg-white/50 border-b border-teal/20 shadow-2xl hover:shadow-blue-900/50 transition-all duration-300 hover:from-white hover:to-teal-400">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-100 h-100 group relative bg-gradient-to-r from-blue-900 to-teal-400 px-3 py-2 rounded-xl shadow-lg hover:shadow-blue-200/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <img src={logo} alt="Logo" width="150" height="150" className="w-100 h-100 object-contain drop-shadow-lg" />
              </div>
              {/* <span className="text-xl font-bold text-white">PT. Medianusa Permana</span> */}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="text-black hover:text-blue-300 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:blue-purple-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Dashboard
              </button>
              <button
                onClick={toggleFuturisticMode}
                className="px-6 py-2 bg-gradient-to-r from-stone-900 to-stone-700 text-white font-semibold rounded-lg hover:from-teal-400 hover:to-blue-400 transition-all duration-300"
              >
                Futuristic
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative container mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-teal-900 via-blue-900 to-teal-900 bg-clip-text text-transparent leading-tight">
              Data Barang
            </h1>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-teal-300 via-teal-700 to-teal-900 bg-clip-text text-transparent leading-tight">
              Permana Medan
            </h1>
            <div className="flex justify-center space-x-2 mt-6">
              <div className="w-3 h-3 bg-blue-900 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-stone-700 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>

          <p className="text-xl text-black/80 max-w-4xl mx-auto leading-relaxed">
            Sistem manajemen inventori modern yang menggantikan spreadsheet Excel dengan
            teknologi cloud-based yang lebih efisien dan akurat
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/login')}
              className="group relative bg-gradient-to-r from-blue-900 to-teal-500 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-2xl hover:shadow-blue-900/50 transition-all duration-300 hover:from-blue-900 hover:to-teal-400 transform hover:scale-105 overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 transform skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
              <span className="relative z-10">Mulai Sekarang</span>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="group bg-transparent border-2 border-black/30 text-black px-10 py-4 rounded-xl text-lg font-bold hover:bg-black/10 hover:border-black/50 transition-all duration-300 backdrop-blur-sm"
            >
              Lihat Demo
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-black/70 text-lg max-w-2xl mx-auto">
              Kelola inventori Anda dengan mudah menggunakan fitur-fitur canggih yang kami sediakan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-teal-300/20 hover:border-teal-500/30 hover:bg-blue-900/40 transition-all duration-500 transform hover:scale-105"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-blue-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-black/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-32">
          <div className="bg-white backdrop-blur-md rounded-2xl p-12 border border-teal-300/20 shadow-2xl">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-teal-500 bg-clip-text text-transparent">
                  1000+
                </div>
                <div className="text-black/70">Barang Terdaftar</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  Banyak
                </div>
                <div className="text-black/70">Pengguna Aktif</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-teal-300 to-teal-500 bg-clip-text text-transparent">
                  99.9%
                </div>
                <div className="text-black/70">Akurasi Data</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative mt-20 bg-white/40 backdrop-blur-xl border-t border-teal-300/20">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            {/* <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-100 h-100 group relative bg-teal-500 px-3 py-2 rounded-xl shadow-lg hover:shadow-blue-900/50 hover:bg-blue-900/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                  <img src={logo} alt="Logo" width="150" height="150" className="w-100 h-100 object-contain drop-shadow-lg" />
                </div>
              </div>
            </div> */}
            <p className="text-black/60">
              © 2025 PT. Medianusa Permana. Semua hak dilindungi.
            </p>
            <div className="mt-6 flex justify-center space-x-6">
              <a href="#" className="text-black/60 hover:text-black transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-black/60 hover:text-black transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-black/60 hover:text-black transition-colors duration-300">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;