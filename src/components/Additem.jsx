import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { barangAPI } from '../utils/api'; // sesuaikan path

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
    lokasi: ''
  });
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Tambah Barang Baru</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Input fields */}
                <div>
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Barang *
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    required
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama barang"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Type/Model *
                  </label>
                  <input
                    type="text"
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan type/model"
                  />
                </div>

                <div>
                  <label htmlFor="mac_address" className="block text-sm font-medium text-gray-700 mb-2">
                    MAC Address
                  </label>
                  <input
                    type="text"
                    id="mac_address"
                    name="mac_address"
                    value={formData.mac_address}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    placeholder="00:1B:44:11:3A:B7"
                    pattern="([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})"
                  />
                </div>

                <div>
                  <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700 mb-2">
                    Serial Number *
                  </label>
                  <input
                    type="text"
                    id="serial_number"
                    name="serial_number"
                    required
                    value={formData.serial_number}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    placeholder="Masukkan serial number"
                  />
                </div>

                <div>
                  <label htmlFor="kondisi" className="block text-sm font-medium text-gray-700 mb-2">
                    Kondisi *
                  </label>
                  <select
                    id="kondisi"
                    name="kondisi"
                    required
                    value={formData.kondisi}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="READY">READY</option>
                    <option value="TERPAKAI">TERPAKAI</option>
                    <option value="RUSAK">RUSAK</option>
                  </select>
                </div>
              </div>

              {/* Lokasi */}
              <div>
                <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi/Terpasang di *
                </label>
                <input
                  type="text"
                  id="lokasi"
                  name="lokasi"
                  required
                  value={formData.lokasi}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan lokasi barang"
                />
              </div>

              {/* Keterangan */}
              <div>
                <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-2">
                  Keterangan
                </label>
                <textarea
                  id="keterangan"
                  name="keterangan"
                  rows="3"
                  value={formData.keterangan}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Keterangan tambahan (opsional)"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors ${loading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-700'
                    }`}
                >
                  {loading ? 'Menyimpan...' : 'Simpan Barang'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
