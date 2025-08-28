import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newLokasi, setNewLokasi] = useState('');

  // Fetch data from API
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const { barangAPI } = await import('../utils/api');
        const data = await barangAPI.getById(id);
        setItem(data.barang);
        setHistory(data.riwayat);
        setNewStatus(data.barang.status);
        setNewLokasi(data.barang.lokasi);
      } catch (error) {
        console.error('Error fetching item details:', error);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (newStatus !== item.status || newLokasi !== item.lokasi) {
      try {
        const { barangAPI } = await import('../utils/api');
        
        let keterangan = '';
        if (newStatus !== item.status && newLokasi !== item.lokasi) {
          keterangan = `Status diubah dari ${item.status} ke ${newStatus}, lokasi dipindah dari ${item.lokasi} ke ${newLokasi}`;
        } else if (newStatus !== item.status) {
          keterangan = `Status diubah dari ${item.status} ke ${newStatus}`;
        } else if (newLokasi !== item.lokasi) {
          keterangan = `Lokasi dipindah dari ${item.lokasi} ke ${newLokasi}`;
        }

        await barangAPI.updateStatus(id, {
          status: newStatus,
          lokasi: newLokasi,
          keterangan
        });

        // Refresh data
        const data = await barangAPI.getById(id);
        setItem(data.barang);
        setHistory(data.riwayat);
        alert('Status dan lokasi berhasil diupdate!');
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Gagal mengupdate status. Silakan coba lagi.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'READY':
        return 'bg-green-100 text-green-800';
      case 'TERPAKAI':
        return 'bg-blue-100 text-blue-800';
      case 'RUSAK':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Item not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Detail Barang</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Item Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Barang</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Barang</label>
                  <p className="mt-1 text-sm text-gray-900">{item.nama}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type/Model</label>
                  <p className="mt-1 text-sm text-gray-900">{item.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">MAC Address</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{item.mac_address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{item.serial_number}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kondisi</label>
                  <p className="mt-1 text-sm text-gray-900">{item.kondisi}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lokasi</label>
                  <p className="mt-1 text-sm text-gray-900">{item.lokasi}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Keterangan</label>
                  <p className="mt-1 text-sm text-gray-900">{item.keterangan}</p>
                </div>
              </div>
            </div>

            {/* Status & Location Update */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Status & Lokasi</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Baru
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="READY">READY</option>
                      <option value="TERPAKAI">TERPAKAI</option>
                      <option value="RUSAK">RUSAK</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi Baru
                    </label>
                    <input
                      type="text"
                      value={newLokasi}
                      onChange={(e) => setNewLokasi(e.target.value)}
                      list="lokasi-suggestions"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan lokasi baru"
                    />
                    <datalist id="lokasi-suggestions">
                      <option value="Warehouse A-1" />
                      <option value="Warehouse A-2" />
                      <option value="Warehouse B-1" />
                      <option value="Warehouse B-2" />
                      <option value="Gedung A Lt.1" />
                      <option value="Gedung A Lt.2" />
                      <option value="Gedung A Lt.3" />
                      <option value="Gedung B Lt.1" />
                      <option value="Gedung B Lt.2" />
                      <option value="Gedung B Lt.3" />
                      <option value="Server Room" />
                      <option value="Network Center" />
                      <option value="Ruang IT" />
                      <option value="Maintenance Room" />
                      <option value="Storage Room" />
                    </datalist>
                  </div>
                </div>
                <button
                  onClick={handleStatusUpdate}
                  disabled={newStatus === item.status && newLokasi === item.lokasi}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    newStatus !== item.status || newLokasi !== item.lokasi
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Update Status & Lokasi
                </button>
                {(newStatus !== item.status || newLokasi !== item.lokasi) && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Perubahan yang akan dilakukan:</strong>
                    </p>
                    {newStatus !== item.status && (
                      <p className="text-sm text-blue-600">
                        • Status: {item.status} → {newStatus}
                      </p>
                    )}
                    {newLokasi !== item.lokasi && (
                      <p className="text-sm text-blue-600">
                        • Lokasi: {item.lokasi} → {newLokasi}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* History */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Riwayat Penggunaan</h2>
              <div className="space-y-4">
                {history.map((entry) => (
                  <div key={entry.id} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          Status: <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(entry.status)}`}>
                            {entry.status}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">Lokasi: {entry.lokasi}</p>
                        <p className="text-sm text-gray-600">{entry.keterangan}</p>
                      </div>
                      <span className="text-sm text-gray-500">{entry.tanggal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">QR Code</h2>
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg inline-block">
                  <QRCode
                    value={JSON.stringify({
                      id: item.id,
                      serial: item.serial_number,
                      nama: item.nama
                    })}
                    size={200}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Scan QR code ini untuk akses cepat
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Scan QR Code</h2>
              <button
                onClick={() => setShowQRScanner(!showQRScanner)}
                className="w-full bg-cyan-600 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 transition-colors"
              >
                {showQRScanner ? 'Tutup Scanner' : 'Buka QR Scanner'}
              </button>
              {showQRScanner && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
                  <p className="text-gray-600">QR Scanner akan tersedia setelah implementasi kamera</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Fitur ini memerlukan akses kamera browser
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;