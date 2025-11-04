import { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translations object
const translations = {
  id: {
    // Navigation & General
    dashboard: 'Dashboard',
    login: 'Masuk',
    logout: 'Keluar',
    home: 'Beranda',
    back: 'Kembali',
    save: 'Simpan',
    cancel: 'Batal',
    delete: 'Hapus',
    edit: 'Edit',
    add: 'Tambah',
    search: 'Cari',
    loading: 'Memuat...',
    success: 'Berhasil',
    error: 'Error',
    warning: 'Peringatan',
    info: 'Informasi',
    adminPanel: 'Panel Admin',
    viewMap: 'Lihat Peta',
    address: 'Alamat',
    openInGoogleMaps: 'Buka di Google Maps',

    // Modal Hapus
    confirmDelete: 'Konfirmasi Hapus Barang',
    deleteMessage: 'Apakah Anda yakin ingin menghapus barang ini?',
    deleteWarning: 'Tindakan ini tidak dapat dibatalkan!',
    deleting: 'Menghapus...',
    deleteConfirmButton: 'Ya, Hapus',
    deleteCancelButton: 'Batal',

    // Authentication
    loginSystem: 'SISTEM LOGIN',
    username: 'Nama Pengguna',
    password: 'Kata Sandi',
    userIdentification: 'Identifikasi Pengguna',
    securityKey: 'Kunci Keamanan',
    initializeAccess: 'Inisialisasi Akses',
    authenticating: 'Mengautentikasi...',
    accessDenied: 'AKSES DITOLAK',
    invalidCredentials: 'Nama pengguna atau kata sandi salah',
    sessionExpired: 'Sesi Anda telah berakhir. Silakan login kembali.',
    returnToMainSystem: 'Kembali ke Sistem Utama',
    demoAccessCredentials: 'Kredensial Akses Demo:',
    welcomeBack: 'Selamat datang kembali',
    loginSuccessful: 'Login berhasil! Selamat datang',
    loggedOutSuccessfully: 'Anda telah berhasil logout',
    pleaseLoginToAccess: 'Silakan login untuk mengakses halaman ini',

    // Dashboard
    totalItems: 'Total Barang',
    ready: 'Siap',
    inUse: 'Terpakai',
    broken: 'Rusak',
    statusDistribution: 'Distribusi Status',
    distributionByCity: 'Distribusi Berdasarkan Kota',
    itemsList: 'Daftar Barang',
    showing: 'Menampilkan',
    of: 'dari',
    items: 'barang',
    noDataFound: 'Tidak ada data yang ditemukan',
    tryChangingSearchFilters: 'Coba ubah kata kunci pencarian atau filter',
    allStatus: 'Semua Status',
    allCities: 'Semua Kota',
    allConditions: 'Semua Kondisi',

    // Item Management
    addItem: 'Tambah Barang',
    itemName: 'Nama Barang',
    typeModel: 'Tipe/Model',
    macAddress: 'Alamat MAC',
    serialNumber: 'Nomor Seri',
    condition: 'Kondisi',
    status: 'Status',
    location: 'Lokasi',
    branch: 'Cabang',
    description: 'Keterangan',
    itemDetail: 'Detail Barang',
    updateStatus: 'Update Status',
    history: 'Riwayat',
    newCondition: 'Baru',
    goodCondition: 'Baik',
    lightDamage: 'Rusak Ringan',
    heavyDamage: 'Rusak Berat',
    backToDashboard: 'Kembali ke Dashboard',
    information: 'Informasi Peralatan Jaringan',
    newStatus: 'Status Baru',
    newLocation: 'Lokasi Baru',
    historyKeluarMasuk: 'Sejarah Keluar Masuk',

    // Scanner & QR
    barcodeScanner: 'Scanner Barcode',
    qrCodeScanner: 'Scanner QR Code',
    startScanning: 'Mulai Scan',
    stopScanning: 'Berhenti Scan',
    scanning: 'Sedang Scan...',
    scanSuccessful: 'Scan berhasil!',
    scanCancelled: 'Scanning dibatalkan',
    generateQR: 'Generate QR',
    downloadQR: 'Download QR',
    qrCodeGenerated: 'QR Code berhasil dibuat',
    qrCodeDownloaded: 'QR Code berhasil didownload!',
    scanBarcode: 'Mulai Scan Barcode',
    autoFromScanner: 'Auto dari Scanner',
    aimCameraToBarcode: 'Arahkan kamera ke barcode peralatan',
    supportsMikrotikTpLink: 'Mendukung barcode Mikrotik, TP-Link, dan peralatan jaringan lainnya',

    // Forms
    enterItemName: 'Masukkan nama peralatan jaringan...',
    enterTypeModel: 'Contoh: RouterBOARD RB750Gr3',
    enterSerialNumber: 'Masukkan serial number peralatan',
    selectBranch: 'Pilih Cabang',
    enterInstallationLocation: 'Contoh: Server Room A-1, Lantai 3 Ruang Network',
    additionalNotes: 'Catatan tambahan, spesifikasi khusus, atau informasi penting lainnya...',
    fieldCannotBeEmpty: 'tidak boleh kosong!',
    pleaseSelectBranch: 'Silakan pilih cabang!',

    // Cities/Branches
    medan: 'Medan',
    batam: 'Batam',
    pekanBaru: 'Pekan Baru',
    jakarta: 'Jakarta',
    tarutung: 'Tarutung',
    headOffice: 'Kantor Pusat',
    branchOffice: 'Kantor Cabang',
    regionalBranch: 'Cabang Regional',
    metropolitanBranch: 'Cabang Metropolitan',

    // Messages & Notifications
    itemAddedSuccessfully: 'Barang berhasil ditambahkan!',
    itemUpdatedSuccessfully: 'Update berhasil!',
    itemDeletedSuccessfully: 'Barang berhasil dihapus',
    noChangesDetected: 'Tidak ada perubahan yang terdeteksi',
    noChangesToSave: 'Tidak ada perubahan yang perlu disimpan',
    unsavedChanges: 'Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar?',
    unsavedChangesIgnored: 'Perubahan yang belum disimpan telah diabaikan',
    dataAutoFilled: 'Data telah terisi otomatis',
    draftRestored: 'Draft terakhir telah dipulihkan',
    changesSaved: 'perubahan telah disimpan',
    pendingChanges: 'Perubahan Tertunda:',
    serialNumberExists: 'Serial number sudah ada!',
    alreadyRegistered: 'telah terdaftar dalam sistem',
    failedToAdd: 'Gagal menambahkan barang',
    systemError: 'Terjadi kesalahan sistem. Coba lagi nanti.',
    itemNotFound: 'Barang tidak ditemukan',
    failedToLoad: 'Gagal memuat detail barang. Coba lagi nanti.',
    failedToUpdate: 'Gagal mengupdate status. Silakan coba lagi.',
    successLoad: 'Berhasil memuat',

    // Company Info
    companyName: 'PT. Medianusa Permana',
    companyDescription: 'PT. Medianusa Permana adalah perusahaan yang bergerak di bidang pelayanan jaringan dengan 5 cabang di Indonesia: Medan, Batam, Pekan Baru, Tarutung, dan Jakarta. Kami mengelola inventori peralatan jaringan seperti Mikrotik dan TP-Link dengan sistem digital yang modern dan efisien.',
    aboutCompany: 'Tentang PT. Medianusa Permana',
    trustedForInventory: 'Dipercaya untuk Mengelola Inventori Jaringan',
    usageStatistics: 'Statistik penggunaan sistem di PT. Medianusa Permana',
    registeredItems: 'Barang Terdaftar',
    branches: 'Cabang',
    monitoring: 'Monitoring',
    dataAccuracy: 'Akurasi Data',

    // Landing Page
    heroTitle: 'Menghadirkan',
    heroSubtitle1: 'Keunggulan Inovasi',
    heroSubtitle2: 'Solusi dan Teknologi',
    heroDescription: 'untuk Meningkatkan Management Barang',
    start: 'Mulai',
    getStarted: 'Mulai Sekarang',
    featuredFeatures: 'Fitur Unggulan',
    featuresDescription: 'Kelola inventori peralatan jaringan Anda dengan mudah menggunakan fitur-fitur canggih yang kami sediakan',
    optimizeInventory: 'Siap Mengoptimalkan Inventori Anda?',
    optimizeDescription: 'Bergabunglah dengan sistem manajemen inventori modern yang telah dipercaya untuk mengelola ribuan peralatan jaringan',

    // Features
    addItemFeature: 'Tambah Barang',
    addItemDescription: 'Tambahkan barang baru dengan mudah ke dalam sistem inventori dengan validasi data yang akurat',
    updateStatusFeature: 'Update Status',
    updateStatusDescription: 'Perbarui status barang secara real-time dengan sistem tracking otomatis dan riwayat lengkap',
    itemHistoryFeature: 'Riwayat Barang',
    itemHistoryDescription: 'Lihat riwayat lengkap penggunaan dan perpindahan barang dengan timeline yang detail',
    conditionMonitoringFeature: 'Monitoring Kondisi',
    conditionMonitoringDescription: 'Monitor kondisi barang dengan sistem peringatan otomatis dan laporan maintenance',
    barcodeQrSystemFeature: 'Barcode/QR System',
    barcodeQrSystemDescription: 'Generate dan scan QR code untuk identifikasi barang yang cepat dan akurat',
    analyticsDashboardFeature: 'Analytics Dashboard',
    analyticsDashboardDescription: 'Analisis mendalam data inventori dengan visualisasi interaktif dan laporan komprehensif',

    // Help & Instructions
    scannerUsageHelp: 'Bantuan Penggunaan Scanner',
    positionBarcode: 'Posisikan Barcode',
    positionBarcodeDesc: 'Arahkan kamera ke barcode pada peralatan jaringan',
    autoScan: 'Scan Otomatis',
    autoScanDesc: 'MAC address dan info peralatan terisi otomatis',
    completeForm: 'Lengkapi Form',
    completeFormDesc: 'Isi data tambahan dan simpan barang',
    scannerTips: 'Pastikan barcode dalam kondisi bersih dan pencahayaan cukup untuk hasil scan yang optimal',

    // Time & Status
    created: 'Di buat',
    lastUpdate: 'Update Terakhir',
    deviceId: 'ID Perangkat',
    networkInfo: 'Info Perangkat',
    scanForAccess: 'SCAN UNTUK AKSES LANGSUNG',
    encoded: 'ENCODED',
    active: 'AKTIF',
    standby: 'STANDBY',
    tracking: 'TRACKING',
    processing: 'Memproses...',
    updating: 'Mengupdate...',
    loadingData: 'Memuat data barang...',

    // Footer
    allRightsReserved: 'Semua hak dilindungi undang-undang.',
    privacyPolicy: 'Kebijakan Privasi',
    termsOfService: 'Syarat Layanan',
    contact: 'Kontak'
  },

  en: {
    // Navigation & General
    dashboard: 'Dashboard',
    login: 'Login',
    logout: 'Logout',
    home: 'Home',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    adminPanel: 'Admin Panel',
    viewMap: 'View Map',
    address: 'Address',
    openInGoogleMaps: 'Open in Google Maps',

    // Modal Hapus
    confirmDelete: 'Confirm Delete Item',
    deleteMessage: 'Are you sure you want to delete this item?',
    deleteWarning: 'This action cannot be undone!',
    deleting: 'Deleting...',
    deleteConfirmButton: 'Yes, Delete',
    deleteCancelButton: 'Cancel',

    // Authentication
    loginSystem: 'LOGIN SYSTEM',
    username: 'Username',
    password: 'Password',
    userIdentification: 'User Identification',
    securityKey: 'Security Key',
    initializeAccess: 'Initialize Access',
    authenticating: 'Authenticating...',
    accessDenied: 'ACCESS DENIED',
    invalidCredentials: 'Invalid username or password',
    sessionExpired: 'Your session has expired. Please login again.',
    returnToMainSystem: 'Return to Main System',
    demoAccessCredentials: 'Demo Access Credentials:',
    welcomeBack: 'Welcome back',
    loginSuccessful: 'Login successful! Welcome',
    loggedOutSuccessfully: 'You have been logged out successfully',
    pleaseLoginToAccess: 'Please login to access this page',

    // Dashboard
    totalItems: 'Total Items',
    ready: 'Ready',
    inUse: 'In Use',
    broken: 'Broken',
    statusDistribution: 'Status Distribution',
    distributionByCity: 'Distribution by City',
    itemsList: 'Items List',
    showing: 'Showing',
    of: 'of',
    items: 'items',
    noDataFound: 'No data found',
    tryChangingSearchFilters: 'Try changing search keywords or filters',
    allStatus: 'All Status',
    allCities: 'All Cities',
    allConditions: 'All Conditions',

    // Item Management
    addItem: 'Add Item',
    itemName: 'Item Name',
    typeModel: 'Type/Model',
    macAddress: 'MAC Address',
    serialNumber: 'Serial Number',
    condition: 'Condition',
    status: 'Status',
    location: 'Location',
    branch: 'Branch',
    description: 'Description',
    itemDetail: 'Item Detail',
    updateStatus: 'Update Status',
    history: 'History',
    newCondition: 'New',
    goodCondition: 'Good',
    lightDamage: 'Light Damage',
    heavyDamage: 'Heavy Damage',
    backToDashboard: 'Back to Dashboard',
    information: 'Network Equipment Information',
    newStatus: 'New Status',
    newLocation: 'New Location',
    historyKeluarMasuk: 'In-Out History',

    // Scanner & QR
    barcodeScanner: 'Barcode Scanner',
    qrCodeScanner: 'QR Code Scanner',
    startScanning: 'Start Scanning',
    stopScanning: 'Stop Scanning',
    scanning: 'Scanning...',
    scanSuccessful: 'Scan successful!',
    scanCancelled: 'Scanning cancelled',
    generateQR: 'Generate QR',
    downloadQR: 'Download QR',
    qrCodeGenerated: 'QR Code generated successfully',
    qrCodeDownloaded: 'QR Code downloaded successfully!',
    scanBarcode: 'Start Barcode Scan',
    autoFromScanner: 'Auto from Scanner',
    aimCameraToBarcode: 'Aim camera to equipment barcode',
    supportsMikrotikTpLink: 'Supports Mikrotik, TP-Link, and other network equipment barcodes',

    // Forms
    enterItemName: 'Enter network equipment name...',
    enterTypeModel: 'Example: RouterBOARD RB750Gr3',
    enterSerialNumber: 'Enter equipment serial number',
    selectBranch: 'Select Branch',
    enterInstallationLocation: 'Example: Server Room A-1, 3rd Floor Network Room',
    additionalNotes: 'Additional notes, special specifications, or other important information...',
    fieldCannotBeEmpty: 'cannot be empty!',
    pleaseSelectBranch: 'Please select a branch!',

    // Cities/Branches
    medan: 'Medan',
    batam: 'Batam',
    pekanBaru: 'Pekan Baru',
    jakarta: 'Jakarta',
    tarutung: 'Tarutung',
    headOffice: 'Head Office',
    branchOffice: 'Branch Office',
    regionalBranch: 'Regional Branch',
    metropolitanBranch: 'Metropolitan Branch',

    // Messages & Notifications
    itemAddedSuccessfully: 'Item added successfully!',
    itemUpdatedSuccessfully: 'Update successful!',
    itemDeletedSuccessfully: 'Item deleted successfully',
    noChangesDetected: 'No changes detected',
    noChangesToSave: 'No changes to save',
    unsavedChanges: 'You have unsaved changes. Are you sure you want to leave?',
    unsavedChangesIgnored: 'Unsaved changes have been ignored',
    dataAutoFilled: 'Data has been auto-filled',
    draftRestored: 'Latest draft has been restored',
    changesSaved: 'changes have been saved',
    pendingChanges: 'Pending Changes:',
    serialNumberExists: 'Serial number already exists!',
    alreadyRegistered: 'is already registered in the system',
    failedToAdd: 'Failed to add item',
    systemError: 'System error occurred. Please try again later.',
    itemNotFound: 'Item not found',
    failedToLoad: 'Failed to load item details. Please try again later.',
    failedToUpdate: 'Failed to update status. Please try again.',
    successLoad: 'Successfully loaded',

    // Company Info
    companyName: 'PT. Medianusa Permana',
    companyDescription: 'PT. Medianusa Permana is a company engaged in network services with 5 branches in Indonesia: Medan, Batam, Pekan Baru, Tarutung, and Jakarta. We manage network equipment inventory such as Mikrotik and TP-Link with modern and efficient digital systems.',
    aboutCompany: 'About PT. Medianusa Permana',
    trustedForInventory: 'Trusted for Network Inventory Management',
    usageStatistics: 'System usage statistics at PT. Medianusa Permana',
    registeredItems: 'Registered Items',
    branches: 'Branches',
    monitoring: 'Monitoring',
    dataAccuracy: 'Data Accuracy',

    // Landing Page
    heroTitle: 'Delivering',
    heroSubtitle1: 'Innovation Excellence',
    heroSubtitle2: 'Solutions and Technology',
    heroDescription: 'to Improve Inventory Management',
    start: 'Start',
    getStarted: 'Get Started Now',
    featuredFeatures: 'Featured Features',
    featuresDescription: 'Easily manage your network equipment inventory using the advanced features we provide',
    optimizeInventory: 'Ready to Optimize Your Inventory?',
    optimizeDescription: 'Join the modern inventory management system that has been trusted to manage thousands of network equipment',

    // Features
    addItemFeature: 'Add Items',
    addItemDescription: 'Easily add new items to the inventory system with accurate data validation',
    updateStatusFeature: 'Update Status',
    updateStatusDescription: 'Update item status in real-time with automatic tracking system and complete history',
    itemHistoryFeature: 'Item History',
    itemHistoryDescription: 'View complete history of item usage and movement with detailed timeline',
    conditionMonitoringFeature: 'Condition Monitoring',
    conditionMonitoringDescription: 'Monitor item condition with automatic alert system and maintenance reports',
    barcodeQrSystemFeature: 'Barcode/QR System',
    barcodeQrSystemDescription: 'Generate and scan QR codes for fast and accurate item identification',
    analyticsDashboardFeature: 'Analytics Dashboard',
    analyticsDashboardDescription: 'In-depth analysis of inventory data with interactive visualizations and comprehensive reports',

    // Help & Instructions
    scannerUsageHelp: 'Scanner Usage Help',
    positionBarcode: 'Position Barcode',
    positionBarcodeDesc: 'Aim camera to barcode on network equipment',
    autoScan: 'Auto Scan',
    autoScanDesc: 'MAC address and equipment info filled automatically',
    completeForm: 'Complete Form',
    completeFormDesc: 'Fill in additional data and save item',
    scannerTips: 'Make sure barcode is clean and lighting is sufficient for optimal scan results',

    // Time & Status
    created: 'Created',
    lastUpdate: 'Last Update',
    deviceId: 'Device ID',
    networkInfo: 'Network Info',
    scanForAccess: 'SCAN FOR INSTANT ACCESS',
    encoded: 'ENCODED',
    active: 'ACTIVE',
    standby: 'STANDBY',
    tracking: 'TRACKING',
    processing: 'Processing...',
    updating: 'Updating...',
    loadingData: 'Loading item data...',

    // Footer
    allRightsReserved: 'All rights reserved.',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    contact: 'Contact'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check localStorage first, then browser language, default to Indonesian
    const saved = localStorage.getItem('language');
    if (saved && (saved === 'id' || saved === 'en')) {
      return saved;
    }

    // Check browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('en')) {
      return 'en';
    }

    // Default to Indonesian
    return 'id';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'id' ? 'en' : 'id');
  };

  const setLanguageId = () => {
    setLanguage('id');
  };

  const setLanguageEn = () => {
    setLanguage('en');
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    // Fallback to key if translation not found
    return value || key;
  };

  const value = {
    language,
    toggleLanguage,
    setLanguageId,
    setLanguageEn,
    t,
    isIndonesian: language === 'id',
    isEnglish: language === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};