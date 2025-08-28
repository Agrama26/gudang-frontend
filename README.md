# Warehouse Management System

Sistem manajemen stok gudang modern yang menggantikan pencatatan Excel dengan database yang powerful dan user-friendly.

## 🚀 Fitur Utama

### 1. Landing Page
- Hero Section dengan judul "Warehouse Management System"
- Tombol "Get Started" menuju Dashboard
- Penjelasan fitur lengkap
- Footer dengan copyright

### 2. Dashboard
- Tabel daftar barang dengan informasi lengkap
- Data real-time dari database MySQL
- Status dengan color coding:
  - **READY** = hijau
  - **TERPAKAI** = biru  
  - **RUSAK** = merah
- Statistik dashboard
- Tombol akses ke detail barang dan form tambah barang

### 3. Detail Barang
- Informasi lengkap barang
- Riwayat penggunaan barang dengan timeline
- Update status barang real-time
- Generate QR code otomatis
- Scan QR code (fitur kamera)

### 4. Input Data Barang
- Form input lengkap dengan validasi
- Otomatis generate QR code setelah simpan
- Data langsung tersimpan ke database

### 5. Authentication System
- Multi-user authentication (admin/staff)
- JWT-based authentication
- Role-based access control

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - Modern UI framework
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React QR Code** - QR code generation & scanning

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **QRCode** - Server-side QR generation

## 🎨 Design System

- **Warna Utama**: Biru (#1D4ED8), Cyan (#06B6D4), Putih (#FFFFFF)
- **Typography**: Inter font family
- **UI**: Clean, modern, responsive design
- **Animations**: Smooth hover effects dan transitions

## 📱 Demo Accounts

Untuk testing aplikasi:

- **Admin**: `admin` / `admin123`
- **Staff**: `staff` / `staff123`

## 🗄️ Database Schema

### Table: users
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: barang
```sql
CREATE TABLE barang (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  mac_address VARCHAR(17),
  serial_number VARCHAR(255) UNIQUE NOT NULL,
  kondisi VARCHAR(50) NOT NULL,
  status ENUM('READY', 'TERPAKAI', 'RUSAK') NOT NULL,
  keterangan TEXT,
  lokasi VARCHAR(255) NOT NULL,
  qr_code TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Table: riwayat_barang
```sql
CREATE TABLE riwayat_barang (
  id INT AUTO_INCREMENT PRIMARY KEY,
  barang_id INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  lokasi VARCHAR(255) NOT NULL,
  keterangan TEXT,
  tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (barang_id) REFERENCES barang(id) ON DELETE CASCADE
);
```

## 🚀 Instalasi & Setup

### Frontend Setup
```bash
cd frontend
pnpm install
pnpm run dev
```

### Backend Setup
```bash
cd backend
npm install

# Setup database
cp .env.example .env
# Edit .env dengan konfigurasi database Anda

# Jalankan server
npm run dev
```

### Database Setup
1. Buat database MySQL: `warehouse_db`
2. Konfigurasi koneksi di file `.env`
3. Tables akan dibuat otomatis saat server pertama kali dijalankan

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user

### Barang Management
- `GET /api/barang` - Get all items
- `GET /api/barang/:id` - Get item detail + history
- `POST /api/barang` - Add new item
- `PUT /api/barang/:id/status` - Update item status
- `DELETE /api/barang/:id` - Delete item (admin only)

### QR Code & Stats
- `GET /api/qr/:id` - Get QR code
- `GET /api/stats` - Dashboard statistics

## 🔧 Development

### Frontend Development
- Modify components di `src/components/`
- Styling menggunakan TailwindCSS
- State management dengan React hooks
- Routing dengan React Router

### Backend Development
- REST API dengan Express.js
- MySQL dengan mysql2 driver
- JWT authentication middleware
- Automatic QR code generation

## 📈 Future Enhancements

- [ ] Barcode scanning integration
- [ ] Export data to Excel/PDF
- [ ] Email notifications
- [ ] Advanced search & filtering
- [ ] Mobile responsive improvements
- [ ] Real-time notifications
- [ ] Inventory alerts
- [ ] Multi-warehouse support

## 📄 License

MIT License - Lihat file LICENSE untuk detail lengkap.

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

**Warehouse Management System** - Solusi modern untuk manajemen inventori gudang Anda! 🏭📦