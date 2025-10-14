import { useNavigate } from 'react-router-dom';
import { barangAPI } from '../utils/api'; // sesuaikan path
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';
import { useDarkMode } from '../contexts/DarkModeContext';
import DarkModeToggle from './DarkModeToggle';
import ZXingBarcodeScanner from './BarcodeScanner';
import HardwareBarcodeScanner from '../contexts/HardwareBarcodeScanner';

const AddItem = () => {
  const { isDarkMode } = useDarkMode();
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
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.nama.trim()) {
      toast.error('Nama barang tidak boleh kosong!', {
        icon: '⚠️',
        duration: 4000
      });
      return;
    }

    if (!formData.type.trim()) {
      toast.error('Type/Model tidak boleh kosong!', {
        icon: '⚠️',
        duration: 4000
      });
      return;
    }

    if (!formData.serial_number.trim()) {
      toast.error('Serial number tidak boleh kosong!', {
        icon: '⚠️',
        duration: 4000
      });
      return;
    }

    if (!formData.lokasi.trim()) {
      toast.error('Lokasi tidak boleh kosong!', {
        icon: '⚠️',
        duration: 4000
      });
      return;
    }

    if (!formData.kota) {
      toast.error('Silakan pilih cabang!', {
        icon: '🏢',
        duration: 4000
      });
      return;
    }

    setLoading(true);

    // Show loading toast
    const loadingToastId = toast.loading('Menambahkan barang...', {
      icon: '⏳'
    });

    try {
      const response = await barangAPI.create(formData);

      if (response && response.id) {
        // Dismiss loading toast and show success
        toast.dismiss(loadingToastId);
        toast.success(
          <>
            <div className="flex flex-col">
              <span className="font-semibold">Barang berhasil ditambahkan!</span>
              <span className="text-sm opacity-80">
                {formData.nama} - ID: #{response.id}
              </span>
            </div>
          </>,
          {
            icon: '✅',
            duration: 5000,
            style: {
              minHeight: '60px'
            }
          }
        );

        // Show additional info toast
        setTimeout(() => {
          toast.info(
            `Barang disimpan di ${formData.lokasi}, ${formData.kota}`,
            {
              icon: '📍',
              duration: 4000
            }
          );
        }, 1000);

        // Reset form
        setFormData({
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

        // Navigate back to dashboard after showing success
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error('Gagal menambahkan barang. Periksa input atau coba lagi nanti.');
      }
    } catch (err) {
      // Dismiss loading toast and show error
      toast.dismiss(loadingToastId);

      console.error(err);

      if (err.message.includes('Serial number already exists')) {
        toast.error(
          <>
            <div className="flex flex-col">
              <span className="font-semibold">Serial number sudah ada!</span>
              <span className="text-sm opacity-80">
                {formData.serial_number} telah terdaftar dalam sistem
              </span>
            </div>
          </>,
          {
            icon: '🔄',
            duration: 5000
          }
        );
      } else if (err.message.includes('401') || err.message.includes('403')) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.', {
          icon: '🔐',
          duration: 5000
        });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(
          <>
            <div className="flex flex-col">
              <span className="font-semibold">Gagal menambahkan barang</span>
              <span className="text-sm opacity-80">
                {err.message || 'Terjadi kesalahan sistem. Coba lagi nanti.'}
              </span>
            </div>
          </>,
          {
            icon: '❌',
            duration: 6000
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Check if form has data
    const hasData = Object.values(formData).some(value =>
      value !== '' && value !== 'Baik' && value !== 'READY'
    );

    if (hasData) {
      const confirmLeave = window.confirm(
        'Anda memiliki data yang belum disimpan. Yakin ingin keluar?'
      );
      if (!confirmLeave) {
        return;
      }

      toast.info('Data yang belum disimpan telah diabaikan', {
        icon: '🗑️',
        duration: 3000
      });
    }

    navigate('/dashboard');
  };

  // Mock barcode scanner with better feedback
  const startScanning = () => {
    setScanning(true);
    setScanResult(null);

    // Show scanning toast
    const scanToastId = toast.loading(
      'Scanning barcode... Arahkan kamera ke barcode peralatan',
      {
        icon: '📱'
      }
    );

    // Simulate scanning process
    setTimeout(() => {
      const mockScanData = {
        nama: 'Mikrotik RouterBOARD RB750Gr3',
        mac_address: '4C:5E:0C:' + Math.random().toString(16).substr(2, 2).toUpperCase() + ':' +
          Math.random().toString(16).substr(2, 2).toUpperCase() + ':' +
          Math.random().toString(16).substr(2, 2).toUpperCase(),
        type: 'Network Router',
        serial_number: 'RB750-' + Math.random().toString(36).substr(2, 8).toUpperCase()
      };

      setScanResult(mockScanData);
      setFormData(prev => ({
        ...prev,
        ...mockScanData
      }));
      setScanning(false);

      // Dismiss scanning toast and show success
      toast.dismiss(scanToastId);
      toast.success(
        <>
          <div className="flex flex-col">
            <span className="font-semibold">Scan berhasil!</span>
            <span className="text-sm opacity-80">
              Data {mockScanData.nama} telah terisi otomatis
            </span>
          </div>
        </>,
        {
          icon: '📷',
          duration: 5000
        }
      );
    }, 3000);
  };

  const stopScanning = () => {
    setScanning(false);
    setScanResult(null);
    toast.info('Scanning dibatalkan', {
      icon: '⏹️',
      duration: 2000
    });
  };

  // Auto-save draft (optional feature)
  useEffect(() => {
    const draftData = localStorage.getItem('addItemDraft');
    if (draftData) {
      try {
        const parsedDraft = JSON.parse(draftData);
        setFormData(parsedDraft);
        toast.info('Draft terakhir telah dipulihkan', {
          icon: '📋',
          duration: 3000
        });
      } catch (error) {
        console.error('Error parsing draft:', error);
      }
    }
  }, []);

  // Save draft on form change
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasData = Object.values(formData).some(value =>
        value !== '' && value !== 'Baik' && value !== 'READY'
      );

      if (hasData) {
        localStorage.setItem('addItemDraft', JSON.stringify(formData));
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData]);

  // Clear draft on successful submit
  // const clearDraft = () => {
  //   localStorage.removeItem('addItemDraft');
  // };

  // Style classes
  const containerClass = isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-teal-50 to-blue-50';
  const headerClass = isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-teal-200';
  const cardClass = isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-teal-100';
  const inputClass = isDarkMode ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-700';
  const textPrimaryClass = isDarkMode ? 'text-teal-400' : 'text-teal-600';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={'min-h-screen transition-all duration-300 ' + containerClass}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={'absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse ' + (isDarkMode ? 'bg-teal-800' : 'bg-teal-200')}></div>
        <div className={'absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse ' + (isDarkMode ? 'bg-blue-800' : 'bg-blue-200')}></div>
      </div>

      {/* Header */}
      <div className={'relative backdrop-blur-xl border-b shadow-lg transition-all duration-300 ' + headerClass}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="group relative">
                <img
                  src={logo}
                  alt="Logo"
                  width="150"
                  height="150"
                  className="w-32 md:w-30 lg:w-40 object-contain drop-shadow-lg filter invert dark:invert-0"
                />
              </div>
              <h1 className={'text-2xl font-bold transition-colors duration-300 ' + textPrimaryClass}>
                Add Item
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <DarkModeToggle />

              <button
                onClick={handleBack}
                className={'group border px-6 py-2 rounded-xl transition-all duration-300 font-semibold transform hover:scale-105 ' + (isDarkMode
                  ? 'border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-black'
                  : 'border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white')}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                  </svg>
                  <span>Back</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Scanner Section */}
          <ZXingBarcodeScanner
            isDarkMode={isDarkMode}
            onScanSuccess={(scannedData) => {
              // Auto-fill form
              setFormData(prev => ({
                ...prev,
                nama: scannedData.nama || prev.nama,
                type: scannedData.model || prev.type,
                mac_address: scannedData.mac_address || prev.mac_address,
                serial_number: scannedData.serial_number || prev.serial_number
              }));

              // Show success notification
              toast.success(
                <>
                  <div className="flex flex-col">
                    <span className="font-semibold">✅ Data berhasil terisi!</span>
                    <span className="text-sm opacity-80">
                      {scannedData.manufacturer} {scannedData.model || 'Network Device'}
                    </span>
                  </div>
                </>,
                { duration: 5000 }
              );

              // Clear draft jika ada
              localStorage.removeItem('addItemDraft');
            }}
          />

          <HardwareBarcodeScanner
            isDarkMode={isDarkMode}
            onScanSuccess={(scannedData) => {
              // Auto-fill form
              setFormData(prev => ({
                ...prev,
                nama: scannedData.nama || prev.nama,
                type: scannedData.model || prev.type,
                mac_address: scannedData.mac_address || prev.mac_address,
                serial_number: scannedData.serial_number || prev.serial_number
              }));

              toast.success(
                <>
                  <div className="flex flex-col">
                    <span className="font-semibold">✅ Barcode Scanned!</span>
                    <span className="text-sm opacity-80">
                      {scannedData.manufacturer} - {scannedData.serial_number}
                    </span>
                  </div>
                </>,
                { duration: 4000 }
              );
            }}
          />

          {/* Form Fields */}
          <div className={'backdrop-blur-md rounded-2xl border shadow-xl p-8 transition-all duration-300 ' + cardClass}>
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className={'w-2 h-2 rounded-full animate-ping ' + (isDarkMode ? 'bg-teal-400' : 'bg-teal-600')}></div>
                <span className={'font-semibold uppercase tracking-wider text-sm transition-colors duration-300 ' + textPrimaryClass}>
                  Data Input Form
                </span>
                <div className={'w-2 h-2 rounded-full animate-ping ' + (isDarkMode ? 'bg-teal-400' : 'bg-teal-600')}></div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Nama Barang */}
                <div className="group">
                  <label htmlFor="nama" className={'block text-sm font-semibold uppercase tracking-wider mb-3 transition-colors duration-300 ' + textPrimaryClass}>
                    <span className="flex items-center">
                      <div className={'w-2 h-2 rounded-full mr-2 animate-pulse ' + (isDarkMode ? 'bg-teal-400' : 'bg-teal-600')}></div>
                      Item Name *
                    </span>
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    required
                    value={formData.nama}
                    onChange={handleChange}
                    className={'w-full p-4 border rounded-xl font-medium focus:ring-2 focus:ring-teal-400/20 transition-all duration-300 ' + inputClass + ' focus:border-teal-400'}
                    placeholder="Masukkan nama peralatan jaringan..."
                  />
                </div>

                {/* Type/Model */}
                <div className="group">
                  <label htmlFor="type" className={'block text-sm font-semibold uppercase tracking-wider mb-3 transition-colors duration-300 ' + textPrimaryClass}>
                    <span className="flex items-center">
                      <div className={'w-2 h-2 rounded-full mr-2 animate-pulse ' + (isDarkMode ? 'bg-teal-400' : 'bg-teal-600')}></div>
                      Type/Model *
                    </span>
                  </label>
                  <input
                    type="text"
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className={'w-full p-4 border rounded-xl font-medium focus:ring-2 focus:ring-teal-400/20 transition-all duration-300 ' + inputClass + ' focus:border-teal-400'}
                    placeholder="Contoh: RouterBOARD RB750Gr3"
                  />
                </div>

                {/* MAC Address */}
                <div className="group">
                  <label htmlFor="mac_address" className={'block text-sm font-semibold uppercase tracking-wider mb-3 transition-colors duration-300 ' + textPrimaryClass}>
                    <span className="flex items-center">
                      <div className={'w-2 h-2 rounded-full mr-2 animate-pulse ' + (isDarkMode ? 'bg-teal-400' : 'bg-teal-600')}></div>
                      MAC Address
                      <span className={'ml-2 text-xs px-2 py-1 rounded-full ' + (isDarkMode ? 'bg-indigo-600 text-indigo-200' : 'bg-indigo-100 text-indigo-700')}>
                        Auto From Scanner
                      </span>
                    </span>
                  </label>
                  <input
                    type="text"
                    id="mac_address"
                    name="mac_address"
                    value={formData.mac_address}
                    onChange={handleChange}
                    className={'w-full p-4 border rounded-xl font-mono font-medium focus:ring-2 focus:ring-teal-400/20 transition-all duration-300 ' + inputClass + ' focus:border-teal-400'}
                    placeholder="00:1B:44:11:3A:B7 (akan terisi otomatis dari scanner)"
                    pattern="([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})"
                  />
                </div>

                {/* Serial Number */}
                <div className="group">
                  <label htmlFor="serial_number" className={'block text-sm font-semibold uppercase tracking-wider mb-3 transition-colors duration-300 ' + textPrimaryClass}>
                    <span className="flex items-center">
                      <div className={'w-2 h-2 rounded-full mr-2 animate-pulse ' + (isDarkMode ? 'bg-teal-400' : 'bg-teal-600')}></div>
                      Serial Number *
                    </span>
                  </label>
                  <input
                    type="text"
                    id="serial_number"
                    name="serial_number"
                    required
                    value={formData.serial_number}
                    onChange={handleChange}
                    className={'w-full p-4 border rounded-xl font-mono font-medium focus:ring-2 focus:ring-teal-400/20 transition-all duration-300 ' + inputClass + ' focus:border-teal-400'}
                    placeholder="Masukkan serial number peralatan"
                  />
                </div>

                {/* Kondisi */}
                <div className="group">
                  <label htmlFor="kondisi" className={'block text-sm font-semibold uppercase tracking-wider mb-3 transition-colors duration-300 ' + textPrimaryClass}>
                    <span className="flex items-center">
                      <div className={'w-2 h-2 rounded-full mr-2 animate-pulse ' + (isDarkMode ? 'bg-teal-400' : 'bg-teal-600')}></div>
                      Item Condition *
                    </span>
                  </label>
                  <select
                    id="kondisi"
                    name="kondisi"
                    required
                    value={formData.kondisi}
                    onChange={handleChange}
                    className={'w-full p-4 border rounded-xl font-medium focus:ring-2 focus:ring-teal-400/20 transition-all duration-300 cursor-pointer ' + inputClass + ' focus:border-teal-400'}
                  >
                    <option value="Baru">New</option>
                    <option value="Baik">Good</option>
                    <option value="Rusak Ringan">Slightly Damaged</option>
                    <option value="Rusak Berat">Heavily Damaged</option>
                  </select>
                </div>

                {/* Status */}
                <div className="group">
                  <label htmlFor="status" className={'block text-sm font-semibold uppercase tracking-wider mb-3 transition-colors duration-300 ' + textPrimaryClass}>
                    <span className="flex items-center">
                      <div className={'w-2 h-2 rounded-full mr-2 animate-pulse ' + (isDarkMode ? 'bg-teal-400' : 'bg-teal-600')}></div>
                      Status *
                    </span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleChange}
                    className={'w-full p-4 border rounded-xl font-medium focus:ring-2 focus:ring-teal-400/20 transition-all duration-300 cursor-pointer ' + inputClass + ' focus:border-teal-400'}
                  >
                    <option value="READY">READY</option>
                    <option value="TERPAKAI">TERPAKAI</option>
                    <option value="RUSAK">RUSAK</option>
                  </select>
                </div>

                {/* Kota */}
                <div className="group md:col-span-2">
                  <label htmlFor="kota" className={'block text-sm font-semibold uppercase tracking-wider mb-3 transition-colors duration-300 ' + textPrimaryClass}>
                    <span className="flex items-center">
                      <div className={'w-2 h-2 rounded-full mr-2 animate-pulse ' + (isDarkMode ? 'bg-teal-400' : 'bg-teal-600')}></div>
                      Cabang PT. Medianusa Permana *
                    </span>
                  </label>
                  <select
                    id="kota"
                    name="kota"
                    required
                    value={formData.kota}
                    onChange={handleChange}
                    className={'w-full p-4 border rounded-xl font-medium focus:ring-2 focus:ring-teal-400/20 transition-all duration-300 cursor-pointer ' + inputClass + ' focus:border-teal-400'}
                  >
                    <option value="">Select Branch</option>
                    <option value="Medan">Medan</option>
                    <option value="Batam">Batam (Kantor Pusat)</option>
                    <option value="Pekan Baru">Pekan Baru</option>
                    <option value="Jakarta">Jakarta</option>
                    <option value="Tarutung">Tarutung</option>
                  </select>
                </div>
              </div>

              {/* Lokasi */}
              <div className="group">
                <label htmlFor="lokasi" className={'block text-sm font-semibold uppercase tracking-wider mb-3 transition-colors duration-300 ' + textPrimaryClass}>
                  <span className="flex items-center">
                    <div className={'w-2 h-2 rounded-full mr-2 animate-pulse ' + (isDarkMode ? 'bg-teal-400' : 'bg-teal-600')}></div>
                    Lokasi Penempatan/Instalasi *
                  </span>
                </label>
                <input
                  type="text"
                  id="lokasi"
                  name="lokasi"
                  required
                  value={formData.lokasi}
                  onChange={handleChange}
                  className={'w-full p-4 border rounded-xl font-medium focus:ring-2 focus:ring-teal-400/20 transition-all duration-300 ' + inputClass + ' focus:border-teal-400'}
                  placeholder="Contoh: Server Room A-1, Lantai 3 Ruang Network"
                />
              </div>

              {/* Keterangan */}
              <div className="group">
                <label htmlFor="keterangan" className={'block text-sm font-semibold uppercase tracking-wider mb-3 transition-colors duration-300 ' + textPrimaryClass}>
                  <span className="flex items-center">
                    <div className={'w-2 h-2 rounded-full mr-2 animate-pulse ' + (isDarkMode ? 'bg-teal-400' : 'bg-teal-600')}></div>
                    Keterangan Tambahan
                  </span>
                </label>
                <textarea
                  id="keterangan"
                  name="keterangan"
                  rows="4"
                  value={formData.keterangan}
                  onChange={handleChange}
                  className={'w-full p-4 border rounded-xl font-medium focus:ring-2 focus:ring-teal-400/20 transition-all duration-300 resize-none ' + inputClass + ' focus:border-teal-400'}
                  placeholder="Catatan tambahan, spesifikasi khusus, atau informasi penting lainnya..."
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex space-x-6 pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className={'flex-1 group relative overflow-hidden py-4 px-8 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 transform hover:scale-105 ' + (loading
                    ? 'opacity-50 cursor-not-allowed bg-gray-400'
                    : (isDarkMode
                      ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700 hover:shadow-teal-500/50'
                      : 'bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 hover:shadow-teal-500/50'))}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className={'w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mr-3 ' + (isDarkMode ? 'border-white' : 'border-white')}>
                        </div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        Simpan Barang
                      </>
                    )}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleBack}
                  className={'flex-1 group border-2 py-4 px-8 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 transform hover:scale-105 ' + (isDarkMode
                    ? 'border-red-500 text-red-400 hover:bg-red-500 hover:text-white'
                    : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white')}
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                    Batal
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <div className={'mt-8 backdrop-blur-md rounded-2xl border shadow-xl p-6 transition-all duration-300 ' + cardClass}>
            <div className="text-center">
              <h3 className={'text-lg font-bold mb-4 transition-colors duration-300 ' + textPrimaryClass}>
                Bantuan Penggunaan Scanner
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className={'p-4 rounded-xl transition-all duration-300 ' + (isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50')}>
                  <div className={'w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ' + (isDarkMode ? 'bg-blue-600' : 'bg-blue-500')}>
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <p className={'font-semibold mb-1 transition-colors duration-300 ' + (isDarkMode ? 'text-white' : 'text-gray-800')}>Posisikan Barcode</p>
                  <p className={'transition-colors duration-300 ' + textSecondaryClass}>
                    Arahkan kamera ke barcode pada peralatan jaringan
                  </p>
                </div>
                <div className={'p-4 rounded-xl transition-all duration-300 ' + (isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50')}>
                  <div className={'w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ' + (isDarkMode ? 'bg-green-600' : 'bg-green-500')}>
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <p className={'font-semibold mb-1 transition-colors duration-300 ' + (isDarkMode ? 'text-white' : 'text-gray-800')}>Scan Otomatis</p>
                  <p className={'transition-colors duration-300 ' + textSecondaryClass}>
                    MAC address dan info peralatan terisi otomatis
                  </p>
                </div>
                <div className={'p-4 rounded-xl transition-all duration-300 ' + (isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50')}>
                  <div className={'w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ' + (isDarkMode ? 'bg-purple-600' : 'bg-purple-500')}>
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <p className={'font-semibold mb-1 transition-colors duration-300 ' + (isDarkMode ? 'text-white' : 'text-gray-800')}>Lengkapi Form</p>
                  <p className={'transition-colors duration-300 ' + textSecondaryClass}>
                    Isi data tambahan dan simpan barang
                  </p>
                </div>
              </div>
              <div className={'mt-4 p-3 rounded-xl transition-all duration-300 ' + (isDarkMode ? 'bg-teal-900/30 text-teal-400' : 'bg-teal-50 text-teal-700')}>
                <p className="text-xs">
                  <strong>Tips:</strong> Pastikan barcode dalam kondisi bersih dan pencahayaan cukup untuk hasil scan yang optimal
                </p>
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
        </div>
      </div>
    </div>
  );
};

export default AddItem;