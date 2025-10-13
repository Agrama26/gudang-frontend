import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import DarkModeToggle from './DarkModeToggle';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

const ItemDetail = () => {
  const [updating, setUpdating] = useState(false);

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

  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const { t, isIndonesian } = useLanguage();

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

  // Fetch data from API
  const fetchItemDetails = useCallback(async () => {
    setLoading(true);

    // Show loading toast
    const loadingToastId = toast.loading('Memuat detail barang...', {
      icon: '📦'
    });

    try {
      const { barangAPI } = await import('../utils/api');
      const data = await barangAPI.getById(id);
      setItem(data.barang);
      setHistory(data.riwayat);
      setNewStatus(data.barang.status);
      setNewLokasi(data.barang.lokasi);
      setNewKondisi(data.barang.kondisi);
      setNewKeterangan(data.barang.keterangan);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToastId);
      toast.success(`Detail barang ${data.barang.nama} berhasil dimuat`, {
        icon: '✅',
        duration: 3000
      });
    } catch (error) {
      console.error('Error fetching item details:', error);

      // Dismiss loading toast and show error
      toast.dismiss(loadingToastId);

      if (error.message.includes('404')) {
        toast.error('Barang tidak ditemukan', {
          icon: '❌',
          duration: 5000
        });
      } else if (error.message.includes('401') || error.message.includes('403')) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.', {
          icon: '🔐',
          duration: 5000
        });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error('Gagal memuat detail barang. Coba lagi nanti.', {
          icon: '⚠️',
          duration: 5000
        });
      }

      setItem(null);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]); // Add id and navigate as dependencies

  useEffect(() => {
    fetchItemDetails();
  }, [fetchItemDetails]); // Use the memoized fetchItemDetails here

  const handleStatusUpdate = async () => {
    const hasChanges = newStatus !== item.status ||
      newLokasi !== item.lokasi ||
      newKondisi !== item.kondisi ||
      newKeterangan !== item.keterangan;

    if (!hasChanges) {
      toast.info('Tidak ada perubahan yang perlu disimpan', {
        icon: 'ℹ️',
        duration: 3000
      });
      return;
    }

    setUpdating(true);

    // Show loading toast
    const updateToastId = toast.loading('Mengupdate data barang...', {
      icon: '🔄'
    });

    try {
      const { barangAPI } = await import('../utils/api');

      const changes = [];
      if (newStatus !== item.status) changes.push(`Status: ${item.status} → ${newStatus}`);
      if (newLokasi !== item.lokasi) changes.push(`Lokasi: ${item.lokasi} → ${newLokasi}`);
      if (newKondisi !== item.kondisi) changes.push(`Kondisi: ${item.kondisi} → ${newKondisi}`);
      if (newKeterangan !== item.keterangan) changes.push('Keterangan diperbarui');

      const changeInfo = changes.join(', ');

      await barangAPI.updateStatus(id, {
        status: newStatus,
        lokasi: newLokasi,
        kondisi: newKondisi,
        keterangan: newKeterangan,
        info: changeInfo
      });

      await fetchItemDetails();

      // Dismiss loading toast and show success
      toast.dismiss(updateToastId);
      toast.success(
        <>
          <div className="flex flex-col">
            <span className="font-semibold">Update berhasil!</span>
            <span className="text-sm opacity-80">
              {changes.length} perubahan telah disimpan
            </span>
          </div>
        </>,
        {
          icon: '✅',
          duration: 5000
        }
      );

      // Show detailed changes
      if (changes.length > 0) {
        setTimeout(() => {
          toast.info(
            <>
              <div className="flex flex-col">
                <span className="font-semibold">Perubahan yang disimpan:</span>
                {changes.map((change, index) => (
                  <span key={index} className="text-sm opacity-80">• {change}</span>
                ))}
              </div>
            </>,
            {
              icon: '📝',
              duration: 6000,
              style: {
                minHeight: '80px'
              }
            }
          );
        }, 1000);
      }

    } catch (error) {
      console.error('Error updating status:', error);

      // Dismiss loading toast and show error
      toast.dismiss(updateToastId);

      if (error.message.includes('404')) {
        toast.error('Barang tidak ditemukan', {
          icon: '❌',
          duration: 5000
        });
      } else if (error.message.includes('401') || error.message.includes('403')) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.', {
          icon: '🔐',
          duration: 5000
        });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error('Gagal mengupdate status. Silakan coba lagi.', {
          icon: '⚠️',
          duration: 5000
        });
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleBack = () => {
    const hasUnsavedChanges = newStatus !== item?.status ||
      newLokasi !== item?.lokasi ||
      newKondisi !== item?.kondisi ||
      newKeterangan !== item?.keterangan;

    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        { en: 'You have unsaved changes. Are you sure you want to leave without saving?', id: 'Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman tanpa menyimpan?' }[isIndonesian ? 'id' : 'en']
      );
      if (!confirmLeave) {
        return;
      }

      toast.info({en: 'Unsaved changes were discarded', id: 'Perubahan yang belum disimpan dibatalkan'}[isIndonesian ? 'id' : 'en'], {
        icon: '🗑️',
        duration: 3000
      });
    }

    navigate('/dashboard');
  };

  // QR Code generation
  const handleQRGeneration = () => {
    if (!item) return;

    toast.promise(
      // Simulate QR generation
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(`QR Code untuk ${item.nama} berhasil dibuat`);
        }, 2000);
      }),
      {
        pending: {
          render: 'Generating QR Code...',
          icon: '🔄'
        },
        success: {
          render: ({ data }) => data,
          icon: '📱'
        },
        error: {
          render: 'Gagal membuat QR Code',
          icon: '❌'
        }
      }
    );
  };

  const handleQRDownload = () => {
    toast.success('QR Code berhasil didownload!', {
      icon: '📥',
      duration: 3000
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'READY':
        return isDarkMode
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
          : 'bg-emerald-500 text-white shadow-emerald-500/30';
      case 'TERPAKAI':
        return isDarkMode
          ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
          : 'bg-blue-500 text-white shadow-blue-500/30';
      case 'RUSAK':
        return isDarkMode
          ? 'bg-red-500/20 text-red-300 border-red-400/30'
          : 'bg-red-500 text-white shadow-red-500/30';
      default:
        return isDarkMode
          ? 'bg-gray-500/20 text-gray-300 border-gray-400/30'
          : 'bg-gray-500 text-white shadow-gray-500/30';
    }
  };

  // Style classes
  const containerClass = isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-teal-50 to-blue-50';
  const headerClass = isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-teal-200';
  const cardClass = isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-teal-100';
  const inputClass = isDarkMode ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-700';
  const textPrimaryClass = isDarkMode ? 'text-teal-400' : 'text-teal-600';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const textMainClass = isDarkMode ? 'text-white' : 'text-gray-800';

  if (loading) {
    return (
      <div className={'min-h-screen flex items-center justify-center transition-all duration-300 ' + containerClass}>
        <div className="text-center">
          <div className="relative">
            <div className={'w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4 ' + (isDarkMode ? 'border-teal-400' : 'border-teal-600')}></div>
            <div className={'absolute inset-0 w-16 h-16 border-4 border-b-transparent rounded-full animate-spin mx-auto ' + (isDarkMode ? 'border-blue-400/20' : 'border-blue-600/20')} style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
          </div>
          <p className={'font-semibold uppercase tracking-wider transition-colors duration-300 ' + textPrimaryClass}>Loading Item Data...</p>
          <div className="mt-4 flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={'w-2 h-2 rounded-full animate-bounce ' + (isDarkMode ? 'bg-teal-400' : 'bg-teal-600')}
                style={{ animationDelay: (i * 0.2) + 's' }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className={'min-h-screen flex items-center justify-center transition-all duration-300 ' + containerClass}>
        <div className="text-center">
          <div className={'text-6xl mb-4 transition-colors duration-300 ' + (isDarkMode ? 'text-red-400' : 'text-red-500')}>⚠️</div>
          <p className={'text-xl mb-6 font-semibold transition-colors duration-300 ' + (isDarkMode ? 'text-red-400' : 'text-red-500')}>
            {t('itemNotFound')}
          </p>
          <button
            onClick={handleBack}
            className={'px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ' + (isDarkMode
              ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700'
              : 'bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600')}
          >
            ← {t('returnToDashboard')}
          </button>
        </div>
      </div>
    );
  }

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
                Detail {item?.nama}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle />
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
                  <span>{t('backToDashboard')}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Item Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className={'backdrop-blur-md rounded-2xl border shadow-xl p-8 transition-all duration-300 ' + cardClass}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={'text-xl font-bold transition-colors duration-300 ' + textPrimaryClass}>
                  {t('information')}
                </h2>
                <div className="flex items-center space-x-2">
                  <div className={'w-2 h-2 rounded-full animate-ping ' + (isDarkMode ? 'bg-green-400' : 'bg-green-500')}></div>
                  <span className={'text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ' + (isDarkMode ? 'text-green-400' : 'text-green-600')}>
                    {t('active')}
                  </span>
                </div>
              </div>

              <div className="text-left grid md:grid-cols-2 gap-6">
                {[
                  { label: t('itemName'), value: item.nama, icon: '🖧' },
                  { label: t('typeModel'), value: item.type, icon: '📦' },
                  { label: t('macAddress'), value: item.mac_address, mono: true, icon: '🏷️' },
                  { label: t('serialNumber'), value: item.serial_number, mono: true, icon: '#️⃣' },
                  { label: t('condition'), value: item.kondisi, icon: '🔧' },
                  { label: t('branch'), value: item.kota, icon: '🏢' },
                  { label: t('installationLocation'), value: item.lokasi, span: true, icon: '📍' },
                  { label: t('description'), value: item.keterangan, span: true, icon: '📝' }
                ].map((field, index) => (
                  <div key={index} className={`group ${field.span ? 'md:col-span-2' : ''}`}>
                    <label className={'block text-sm font-semibold uppercase tracking-wider mb-2 transition-colors duration-300 ' + textPrimaryClass}>
                      <span className="flex items-center">
                        <span className="mr-2">{field.icon}</span>
                        {field.label}
                      </span>
                    </label>
                    <div className="relative">
                      <p className={'p-3 border rounded-xl transition-all duration-300 group-hover:border-teal-400/50 ' +
                        (isDarkMode ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800') +
                        (field.mono ? ' font-mono' : '')}>
                        {field.value || 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Status dengan styling khusus */}
                <div className="group">
                  <label className={'block text-sm font-semibold uppercase tracking-wider mb-2 transition-colors duration-300 ' + textPrimaryClass}>
                    <span className="flex items-center">
                      <span className="mr-2">📊</span>
                      {t('status')}
                    </span>
                  </label>
                  <div className="relative">
                    <span className={'inline-flex px-4 py-2 text-sm font-bold rounded-xl border transition-all duration-300 ' + getStatusColor(item.status)}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Update Module */}
            <div className={'backdrop-blur-md rounded-2xl border shadow-xl p-8 transition-all duration-300 ' + cardClass}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={'text-xl font-bold transition-colors duration-300 ' + textPrimaryClass}>
                  {t('updateStatus')} & {t('location')}
                </h2>
                <div className="flex items-center space-x-2">
                  <div className={'w-2 h-2 rounded-full animate-ping ' + (isDarkMode ? 'bg-yellow-400' : 'bg-yellow-500')}></div>
                  <span className={'text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ' + (isDarkMode ? 'text-yellow-400' : 'text-yellow-600')}>
                    {t('standby')}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className={'block text-sm font-semibold uppercase tracking-wider mb-3 transition-colors duration-300 ' + textPrimaryClass}>
                      <span className="flex items-center">
                        <div className={'w-2 h-2 rounded-full mr-2 animate-pulse ' + (isDarkMode ? 'bg-teal-400' : 'bg-teal-600')}></div>
                        {t('newStatus')}
                      </span>
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className={'w-full p-4 border rounded-xl font-semibold focus:ring-2 focus:ring-teal-400/20 transition-all duration-300 ' + inputClass + ' focus:border-teal-400'}
                    >
                      <option value="READY">READY</option>
                      <option value="TERPAKAI">TERPAKAI</option>
                      <option value="RUSAK">RUSAK</option>
                    </select>
                  </div>

                  <div className="group">
                    <label className={'block text-sm font-semibold uppercase tracking-wider mb-3 transition-colors duration-300 ' + textPrimaryClass}>
                      <span className="flex items-center">
                        <div className={'w-2 h-2 rounded-full mr-2 animate-pulse ' + (isDarkMode ? 'bg-teal-400' : 'bg-teal-600')}></div>
                        {t('newLocation')}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={newLokasi}
                      onChange={(e) => setNewLokasi(e.target.value)}
                      className={'w-full p-4 border rounded-xl font-medium focus:ring-2 focus:ring-teal-400/20 transition-all duration-300 ' + inputClass + ' focus:border-teal-400'}
                      placeholder="Masukkan lokasi baru..."
                    />
                  </div>

                  <div className="group">
                    <label className={'block text-sm font-semibold uppercase tracking-wider mb-3 transition-colors duration-300 ' + textPrimaryClass}>
                      <span className="flex items-center">
                        <div className={'w-2 h-2 rounded-full mr-2 animate-pulse ' + (isDarkMode ? 'bg-teal-400' : 'bg-teal-600')}></div>
                        {t('condition')}
                      </span>
                    </label>
                    <select
                      value={newKondisi}
                      onChange={(e) => setNewKondisi(e.target.value)}
                      className={'w-full p-4 border rounded-xl font-semibold focus:ring-2 focus:ring-teal-400/20 transition-all duration-300 ' + inputClass + ' focus:border-teal-400'}
                    >
                      <option value="Baru">Baru</option>
                      <option value="Baik">Baik</option>
                      <option value="Rusak Ringan">Rusak Ringan</option>
                      <option value="Rusak Berat">Rusak Berat</option>
                    </select>
                  </div>

                  <div className="group">
                    <label className={'block text-sm font-semibold uppercase tracking-wider mb-3 transition-colors duration-300 ' + textPrimaryClass}>
                      <span className="flex items-center">
                        <div className={'w-2 h-2 rounded-full mr-2 animate-pulse ' + (isDarkMode ? 'bg-teal-400' : 'bg-teal-600')}></div>
                        {t('description')}
                      </span>
                    </label>
                    <textarea
                      rows="2"
                      value={newKeterangan}
                      onChange={(e) => setNewKeterangan(e.target.value)}
                      className={'w-full p-4 border rounded-xl font-medium focus:ring-2 focus:ring-teal-400/20 transition-all duration-300 resize-none ' + inputClass + ' focus:border-teal-400'}
                      placeholder={(isIndonesian ? 'Masukkan keterangan tambahan...' : 'Enter additional remarks...' )}
                    ></textarea>
                  </div>
                </div>

                <button
                  onClick={handleStatusUpdate}
                  disabled={updating || (newStatus === item.status && newLokasi === item.lokasi && newKondisi === item.kondisi && newKeterangan === item.keterangan)}
                  className={'w-full group relative overflow-hidden py-4 px-6 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 transform hover:scale-105 ' + (
                    updating || (newStatus === item.status && newLokasi === item.lokasi && newKondisi === item.kondisi && newKeterangan === item.keterangan)
                      ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-200'
                      : (isDarkMode
                        ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700 hover:shadow-teal-500/50'
                        : 'bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 hover:shadow-teal-500/50')
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {updating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        {t('updating')}...
                      </>
                    ) : (newStatus !== item.status || newLokasi !== item.lokasi || newKondisi !== item.kondisi || newKeterangan !== item.keterangan) ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        {t('executeUpdate')}
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        {t('noChangesDetected')}
                      </>
                    )}
                  </span>
                </button>

                {(newStatus !== item.status || newLokasi !== item.lokasi || newKondisi !== item.kondisi || newKeterangan !== item.keterangan) && (
                  <div className={'p-4 border rounded-xl transition-all duration-300 ' + (isDarkMode ? 'bg-blue-900/30 border-blue-600/50' : 'bg-blue-50 border-blue-200')}>
                    <p className={'font-semibold text-sm uppercase tracking-wider mb-2 transition-colors duration-300 ' + (isDarkMode ? 'text-blue-400' : 'text-blue-600')}>
                      <span className="flex items-center">
                        <div className={'w-2 h-2 rounded-full mr-2 animate-ping ' + (isDarkMode ? 'bg-blue-400' : 'bg-blue-500')}></div>
                        {t('pendingChanges')}:
                      </span>
                    </p>
                    {newStatus !== item.status && (
                      <p className={'text-sm font-mono transition-colors duration-300 ' + (isDarkMode ? 'text-blue-300' : 'text-blue-700')}>
                        • {t('newStatus')}: {item.status} → {newStatus}
                      </p>
                    )}
                    {newLokasi !== item.lokasi && (
                      <p className={'text-sm font-mono transition-colors duration-300 ' + (isDarkMode ? 'text-blue-300' : 'text-blue-700')}>
                        • {t('newLocation')}: {item.lokasi} → {newLokasi}
                      </p>
                    )}
                    {newKondisi !== item.kondisi && (
                      <p className={'text-sm font-mono transition-colors duration-300 ' + (isDarkMode ? 'text-blue-300' : 'text-blue-700')}>
                        • {t('condition')}: {item.kondisi} → {newKondisi}
                      </p>
                    )}
                    {newKeterangan !== item.keterangan && (
                      <p className={'text-sm font-mono transition-colors duration-300 ' + (isDarkMode ? 'text-blue-300' : 'text-blue-700')}>
                        • {t('description')}: Updated
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* History */}
            <div className={'backdrop-blur-md rounded-2xl border shadow-xl p-8 transition-all duration-300 ' + cardClass}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={'text-xl font-bold transition-colors duration-300 ' + textPrimaryClass}>
                  {t('historyKeluarMasuk')}
                </h2>
                <div className="flex items-center space-x-2">
                  <div className={'w-2 h-2 rounded-full animate-ping ' + (isDarkMode ? 'bg-teal-400' : 'bg-teal-600')}></div>
                  <span className={'text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ' + textPrimaryClass}>
                    {t('tracking')}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {history.map((entry, index) => (
                  <div key={entry.id} className="relative group">
                    <div className={'border-l-4 pl-6 py-4 rounded-r-xl transition-all duration-300 ' +
                      (isDarkMode ? 'border-teal-400/50 bg-gray-700/30 hover:bg-gray-700/50' : 'border-teal-600/50 bg-teal-50/30 hover:bg-teal-50/50')}>
                      <div className={'absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full animate-pulse ' + (isDarkMode ? 'bg-teal-400' : 'bg-teal-600')}></div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={'font-semibold text-sm transition-colors duration-300 ' + textPrimaryClass}>STATUS:</span>
                            <span className={'px-3 py-1 text-xs font-bold rounded-xl border transition-all duration-300 ' + getStatusColor(entry.status)}>
                              {entry.status}
                            </span>
                          </div>
                          <p className={'text-sm mb-1 text-left transition-colors duration-300 ' + textMainClass}>
                            <span className={'font-semibold ' + textPrimaryClass}>{t('condition')}:</span> {entry.kondisi}
                          </p>
                          <p className={'text-sm mb-1 text-left transition-colors duration-300 ' + textMainClass}>
                            <span className={'font-semibold ' + textPrimaryClass}>{t('location')}:</span> {entry.lokasi}
                          </p>
                          <p className={'text-sm text-left transition-colors duration-300 ' + textMainClass}>
                            <span className={'font-semibold ' + textPrimaryClass}>{t('info')}:</span> {entry.keterangan}
                          </p>
                        </div>
                        <span className={'text-xs font-mono transition-colors duration-300 ' + textSecondaryClass}>
                          {new Date(entry.tanggal).toLocaleString()}
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
            <div className={'backdrop-blur-md rounded-2xl border shadow-xl p-8 transition-all duration-300 ' + cardClass}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={'text-xl font-bold transition-colors duration-300 ' + textPrimaryClass}>
                  QR Identity
                </h2>
                <div className="flex items-center space-x-2">
                  <div className={'w-2 h-2 rounded-full animate-ping ' + (isDarkMode ? 'bg-green-400' : 'bg-green-500')}></div>
                  <span className={'text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ' + (isDarkMode ? 'text-green-400' : 'text-green-600')}>
                    ENCODED
                  </span>
                </div>
              </div>

              <div className="text-center">
                <div className={'p-6 rounded-xl inline-block relative transition-all duration-300 ' + (isDarkMode ? 'bg-white' : 'bg-white')}>
                  <div className={'absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 ' + (isDarkMode ? 'border-gray-800' : 'border-black')}></div>
                  <div className={'absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 ' + (isDarkMode ? 'border-gray-800' : 'border-black')}></div>
                  <div className={'absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 ' + (isDarkMode ? 'border-gray-800' : 'border-black')}></div>

                  {/* Mock QR Code */}
                  <div className={'w-48 h-48 flex items-center justify-center ' + (isDarkMode ? 'bg-gray-100' : 'bg-white')}>
                    <div className="grid grid-cols-8 gap-px">
                      {[...Array(64)].map((_, i) => (
                        <div
                          key={i}
                          className={'w-2 h-2 ' + (Math.random() > 0.5 ? (isDarkMode ? 'bg-gray-800' : 'bg-black') : (isDarkMode ? 'bg-gray-100' : 'bg-white'))}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className={'mt-4 text-sm font-semibold uppercase tracking-wider transition-colors duration-300 ' + textPrimaryClass}>
                  SCAN FOR INSTANT ACCESS
                </p>
                <p className={'mt-1 text-xs transition-colors duration-300 ' + textSecondaryClass}>
                  ID: {item.id} | MAC: {item.mac_address}
                </p>
              </div>

              {/* QR Actions */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleQRGeneration}
                  className={'w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ' + (isDarkMode
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/50'
                    : 'bg-indigo-500 text-white hover:bg-indigo-600 hover:shadow-indigo-500/50')}
                >
                  🔄 Regenerate QR
                </button>
                <button
                  onClick={handleQRDownload}
                  className={'w-full py-3 px-4 rounded-xl font-semibold border-2 transition-all duration-300 transform hover:scale-105 ' + (isDarkMode
                    ? 'border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-black'
                    : 'border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white')}
                >
                  📥 Download QR
                </button>
              </div>
            </div>

            {/* QR Scanner */}
            <div className={'backdrop-blur-md rounded-2xl border shadow-xl p-8 transition-all duration-300 ' + cardClass}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={'text-xl font-bold transition-colors duration-300 ' + textPrimaryClass}>
                  QR Scanner
                </h2>
                <div className="flex items-center space-x-2">
                  <div className={'w-2 h-2 rounded-full animate-ping ' + (
                    showQRScanner
                      ? (isDarkMode ? 'bg-red-400' : 'bg-red-500')
                      : (isDarkMode ? 'bg-gray-400' : 'bg-gray-500')
                  )}></div>
                  <span className={'text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ' + (
                    showQRScanner
                      ? (isDarkMode ? 'text-red-400' : 'text-red-500')
                      : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                  )}>
                    {showQRScanner ? 'SCANNING' : 'STANDBY'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowQRScanner(!showQRScanner);
                  if (!showQRScanner) {
                    toast.info('QR Scanner diaktifkan', {
                      icon: '📱',
                      duration: 2000
                    });
                  } else {
                    toast.info('QR Scanner dinonaktifkan', {
                      icon: '⏹️',
                      duration: 2000
                    });
                  }
                }}
                className={'w-full group relative overflow-hidden py-4 px-6 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 transform hover:scale-105 ' + (
                  showQRScanner
                    ? (isDarkMode
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700'
                      : 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600')
                    : (isDarkMode
                      ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700'
                      : 'bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600')
                ) + ' hover:shadow-2xl'}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {showQRScanner ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                      </svg>
                      Deactivate Scanner
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zm2 2V5h1v1h-1z" clipRule="evenodd"></path>
                      </svg>
                      Activate Scanner
                    </>
                  )}
                </span>
              </button>

              {showQRScanner && (
                <div className={'mt-6 p-6 border rounded-xl text-center relative transition-all duration-300 ' + (isDarkMode ? 'bg-gray-700/50 border-red-600/50' : 'bg-red-50 border-red-200')}>
                  <div className={'absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 animate-pulse ' + (isDarkMode ? 'border-red-400' : 'border-red-500')}></div>
                  <div className={'absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 animate-pulse ' + (isDarkMode ? 'border-red-400' : 'border-red-500')}></div>
                  <div className={'absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 animate-pulse ' + (isDarkMode ? 'border-red-400' : 'border-red-500')}></div>
                  <div className={'absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 animate-pulse ' + (isDarkMode ? 'border-red-400' : 'border-red-500')}></div>

                  <div className={'w-32 h-32 border-2 rounded-xl mx-auto mb-4 relative ' + (isDarkMode ? 'border-red-400/50' : 'border-red-500/50')}>
                    <div className={'absolute inset-0 border animate-pulse ' + (isDarkMode ? 'border-red-400' : 'border-red-500')}></div>
                    <div className={'absolute top-1/2 left-0 w-full h-0.5 animate-pulse ' + (isDarkMode ? 'bg-red-400' : 'bg-red-500')}></div>
                  </div>

                  <p className={'font-bold text-sm uppercase tracking-wider transition-colors duration-300 ' + (isDarkMode ? 'text-red-400' : 'text-red-500')}>
                    Camera Module Required
                  </p>
                  <p className={'text-xs mt-2 transition-colors duration-300 ' + (isDarkMode ? 'text-red-400/80' : 'text-red-600/80')}>
                    Browser camera access needed for QR scanning
                  </p>
                </div>
              )}
            </div>

            {/* Device Info Card */}
            <div className={'backdrop-blur-md rounded-2xl border shadow-xl p-6 transition-all duration-300 ' + cardClass}>
              <h3 className={'text-lg font-bold mb-4 transition-colors duration-300 ' + textPrimaryClass}>
                Network Info
              </h3>
              <div className="space-y-3">
                <div className={'flex justify-between items-center p-3 rounded-xl transition-all duration-300 ' + (isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50')}>
                  <span className={'text-sm font-semibold transition-colors duration-300 ' + textSecondaryClass}>Device ID</span>
                  <span className={'text-sm font-mono font-bold transition-colors duration-300 ' + textMainClass}>#{item.id}</span>
                </div>
                <div className={'flex justify-between items-center p-3 rounded-xl transition-all duration-300 ' + (isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50')}>
                  <span className={'text-sm font-semibold transition-colors duration-300 ' + textSecondaryClass}>Created</span>
                  <span className={'text-sm font-mono transition-colors duration-300 ' + textMainClass}>{new Date(item.created_at).toLocaleString()}</span>
                </div>
                <div className={'flex justify-between items-center p-3 rounded-xl transition-all duration-300 ' + (isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50')}>
                  <span className={'text-sm font-semibold transition-colors duration-300 ' + textSecondaryClass}>Last Update</span>
                  <span className={'text-sm font-mono transition-colors duration-300 ' + textMainClass}>{new Date(item.updated_at).toLocaleString()}</span>
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
    </div>
  );
};

export default ItemDetail;