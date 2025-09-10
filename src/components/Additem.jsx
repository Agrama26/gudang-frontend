import { useNavigate } from 'react-router-dom';
import { barangAPI } from '../utils/api'; // sesuaikan path
import { useState } from 'react';
import { QrReader } from 'react-qr-reader';  // Use named import

const AddItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    type: '',
    mac_address: '',
    serial_number: '',
    kondisi: 'Baik',
    status: 'READY',
    keterangan: '',
    lokasi: '',
    kota: ''
  });
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false); // State untuk kontrol scanning barcode


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Pastikan backend menerima data dengan format yang tepat
      const response = await barangAPI.create(formData);

      if (response && response.id) {
        alert('Barang berhasil ditambahkan!');
        navigate('/dashboard');
      } else {
        // Jika response tidak ada atau tidak sesuai
        throw new Error('Gagal menambahkan barang. Periksa input atau coba lagi nanti.');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Terjadi kesalahan saat menambahkan barang. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Replace with actual navigation: navigate('/dashboard');
    navigate('/dashboard');
  };

  const handleScan = (data) => {
    if (data) {
      // Mengambil data dari barcode (misalnya nama dan MAC address)
      const barcodeData = JSON.parse(data); // Anggap data dalam format JSON, bisa disesuaikan
      setFormData({
        ...formData,
        nama: barcodeData.nama || '',
        mac_address: barcodeData.mac_address || '',
      });
      setScanning(false); // Menutup scanner setelah data dipindai
    }
  };

  const handleError = (err) => {
    console.error(err);
    alert("Failed to scan barcode");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: `
                 linear-gradient(rgba(0, 255, 255, 0.5) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0, 255, 255, 0.5) 1px, transparent 1px)
               `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}>
        </div>

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-teal-500 rounded-full opacity-60"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 10 + 's',
              animation: `float ${8 + Math.random() * 4}s ease-in-out infinite alternate`
            }}
          ></div>
        ))}

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>

        {/* Scanning Lines */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scan"></div>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/80 backdrop-blur-sm border-b border-cyan-500/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-cyan-400 rounded-sm animate-pulse"></div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ADD NEW ITEM
              </h1>
            </div>
            <button
              onClick={handleBack}
              className="group bg-transparent border border-cyan-400 text-cyan-400 px-6 py-2 rounded-sm hover:bg-cyan-400 hover:text-black transition-all duration-300 font-mono uppercase tracking-wider relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-cyan-400 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              <span className="relative z-10">← BACK TO DASHBOARD</span>
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/80 backdrop-blur-md rounded-lg border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 p-8">
            {/* Form Header */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center space-x-2 text-cyan-400 mb-4">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                <span className="font-mono uppercase tracking-wider text-sm">Data Input Module</span>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
              </div>
            </div>

            <div onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Input fields */}
                <div className="group">
                  <label htmlFor="nama" className="block text-sm font-mono uppercase tracking-wider text-cyan-400 mb-3">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                      Item Name *
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="nama"
                      name="nama"
                      required
                      value={formData.nama}
                      onChange={handleChange}
                      className="w-full p-4 bg-black/50 border border-gray-600 rounded-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-mono transition-all duration-300 hover:border-gray-400"
                      placeholder="Enter item name..."
                    />
                    <div className="absolute inset-0 border border-cyan-400/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="type" className="block text-sm font-mono uppercase tracking-wider text-cyan-400 mb-3">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                      Type/Model *
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="type"
                      name="type"
                      required
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full p-4 bg-black/50 border border-gray-600 rounded-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-mono transition-all duration-300 hover:border-gray-400"
                      placeholder="Enter type/model..."
                    />
                    <div className="absolute inset-0 border border-cyan-400/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="mac_address" className="block text-sm font-mono uppercase tracking-wider text-cyan-400 mb-3">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                      MAC Address
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="mac_address"
                      name="mac_address"
                      value={formData.mac_address}
                      onChange={handleChange}
                      className="w-full p-4 bg-black/50 border border-gray-600 rounded-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-mono transition-all duration-300 hover:border-gray-400"
                      placeholder="00:1B:44:11:3A:B7"
                      pattern="([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})"
                    />
                    <div className="absolute inset-0 border border-cyan-400/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="serial_number" className="block text-sm font-mono uppercase tracking-wider text-cyan-400 mb-3">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                      Serial Number *
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="serial_number"
                      name="serial_number"
                      required
                      value={formData.serial_number}
                      onChange={handleChange}
                      className="w-full p-4 bg-black/50 border border-gray-600 rounded-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-mono transition-all duration-300 hover:border-gray-400"
                      placeholder="Enter serial number..."
                    />
                    <div className="absolute inset-0 border border-cyan-400/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="kondisi" className="block text-sm font-mono uppercase tracking-wider text-cyan-400 mb-3">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                      Condition *
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id="kondisi"
                      name="kondisi"
                      required
                      value={formData.kondisi}
                      onChange={handleChange}
                      className="w-full p-4 bg-black/50 border border-gray-600 rounded-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-mono transition-all duration-300 hover:border-gray-400 cursor-pointer"
                    >
                      <option value="Baik" className="bg-gray-900">Baik</option>
                      <option value="Rusak Ringan" className="bg-gray-900">Rusak Ringan</option>
                      <option value="Rusak Berat" className="bg-gray-900">Rusak Berat</option>
                    </select>
                    <div className="absolute inset-0 border border-cyan-400/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="status" className="block text-sm font-mono uppercase tracking-wider text-cyan-400 mb-3">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                      Status *
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id="status"
                      name="status"
                      required
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full p-4 bg-black/50 border border-gray-600 rounded-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-mono transition-all duration-300 hover:border-gray-400 cursor-pointer"
                    >
                      <option value="READY" className="bg-gray-900">READY</option>
                      <option value="TERPAKAI" className="bg-gray-900">TERPAKAI</option>
                      <option value="RUSAK" className="bg-gray-900">RUSAK</option>
                    </select>
                    <div className="absolute inset-0 border border-cyan-400/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Kota */}
                <div className="group">
                  <label htmlFor="kota" className="block text-sm font-mono uppercase tracking-wider text-cyan-400 mb-3">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                      Kota *
                    </span>
                  </label>
                  <select
                    id="kota"
                    name="kota"
                    required
                    value={formData.kota}
                    onChange={handleChange}
                    className="w-full p-4 bg-black/50 border border-gray-600 rounded-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-mono transition-all duration-300"
                  >
                    <option value="">Select Kota</option>
                    <option value="Medan">Medan</option>
                    <option value="Batam">Pekan Baru</option>
                    <option value="Riau">Jakarta</option>
                    <option value="Riau">Tarutung</option>
                  </select>
                </div>
              </div>

              {/* Lokasi */}
              <div className="group">
                <label htmlFor="lokasi" className="block text-sm font-mono uppercase tracking-wider text-cyan-400 mb-3">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                    Location/Installed at *
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="lokasi"
                    name="lokasi"
                    required
                    value={formData.lokasi}
                    onChange={handleChange}
                    className="w-full p-4 bg-black/50 border border-gray-600 rounded-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-mono transition-all duration-300 hover:border-gray-400"
                    placeholder="Enter item location..."
                  />
                  <div className="absolute inset-0 border border-cyan-400/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Keterangan */}
              <div className="group">
                <label htmlFor="keterangan" className="block text-sm font-mono uppercase tracking-wider text-cyan-400 mb-3">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                    Additional Notes
                  </span>
                </label>
                <div className="relative">
                  <textarea
                    id="keterangan"
                    name="keterangan"
                    rows="4"
                    value={formData.keterangan}
                    onChange={handleChange}
                    className="w-full p-4 bg-black/50 border border-gray-600 rounded-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-mono transition-all duration-300 hover:border-gray-400 resize-none"
                    placeholder="Enter additional notes (optional)..."
                  ></textarea>
                  <div className="absolute inset-0 border border-cyan-400/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-6 pt-8">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`flex-1 group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-500 text-black py-4 px-8 rounded-sm font-mono uppercase tracking-wider font-bold transition-all duration-300 ${loading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-cyan-400 hover:to-blue-400 hover:shadow-2xl hover:shadow-cyan-500/30'
                    }`}
                >
                  <span className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-3"></div>
                        Processing...
                      </>
                    ) : (
                      '► Save'
                    )}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 group bg-transparent border-2 border-red-500 text-red-400 py-4 px-8 rounded-sm font-mono uppercase tracking-wider font-bold hover:bg-red-500 hover:text-black transition-all duration-300 relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-red-500 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  <span className="relative z-10">✕ Abort</span>
                </button>
              </div>
            </div>
            {/* Barcode Scanner */}
            {scanning ? (
              <div className="group">
                <QrReader
                  delay={300}
                  style={{ width: '100%' }}
                  onScan={handleScan}
                  onError={handleError}
                />
                <button
                  type="button"
                  onClick={() => setScanning(false)}
                  className="text-red-500 mt-4"
                >
                  Stop Scanning
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setScanning(true)}
                className="mt-6 text-cyan-400"
              >
                Scan Barcode
              </button>
            )}

            <div className="flex space-x-6 pt-8">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-black py-4 px-8 rounded-sm font-mono uppercase tracking-wider font-bold ${loading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:from-cyan-400 hover:to-blue-400 hover:shadow-2xl'
                  }`}
              >
                {loading ? 'Processing...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 bg-transparent border-2 border-red-500 text-red-400 py-4 px-8 rounded-sm font-mono uppercase tracking-wider font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(360deg); }
        }
        
        @keyframes scan {
          0% { top: 0%; opacity: 1; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        
        .animate-scan {
          animation: scan 3s linear infinite;
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
          background: rgba(0, 255, 255, 0.8);
        }
      `}</style>
    </div>
  );
};

export default AddItem;