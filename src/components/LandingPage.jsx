import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Tambah Barang",
      description: "Tambahkan barang baru dengan mudah ke dalam sistem inventori",
      icon: "📦"
    },
    {
      title: "Update Status",
      description: "Perbarui status barang secara real-time dengan tracking otomatis",
      icon: "🔄"
    },
    {
      title: "Riwayat Barang",
      description: "Lihat riwayat lengkap penggunaan dan perpindahan barang",
      icon: "📊"
    },
    {
      title: "Monitoring Kondisi",
      description: "Monitor kondisi barang dengan sistem peringatan otomatis",
      icon: "🔍"
    },
    {
      title: "Barcode/QR System",
      description: "Generate dan scan QR code untuk identifikasi barang yang cepat",
      icon: "📱"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Warehouse Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistem manajemen stok gudang modern yang menggantikan pencatatan Excel dengan database yang powerful dan user-friendly
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transform hover:scale-105 transition-all duration-300"
            >
              Demo Dashboard
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Fitur Unggulan
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 hover:transform hover:scale-105"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 Warehouse Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;