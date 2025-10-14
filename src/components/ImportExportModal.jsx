// src/components/ImportExportModal.jsx
import { useState, useRef } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { toast } from 'react-toastify';

const ImportExportModal = ({ isOpen, onClose, onSuccess }) => {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('import'); // 'import' or 'export'
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importPreview, setImportPreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Get auth token
  const getAuthToken = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      if (u?.token) return u.token;
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
    return localStorage.getItem("token");
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Download Template
  const handleDownloadTemplate = async () => {
    try {
      const token = getAuthToken();

      toast.info('📥 Downloading template...', { icon: '⏳' });

      const response = await fetch(`${API_BASE_URL}/barang/template`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download template');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Template_Import_Barang.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('✅ Template downloaded successfully!', {
        icon: '📥',
        duration: 3000
      });

    } catch (error) {
      console.error('Download template error:', error);
      toast.error('❌ Failed to download template', {
        duration: 4000
      });
    }
  };

  // Handle File Selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (!validTypes.includes(file.type)) {
        toast.error('❌ Please select a valid Excel file (.xls or .xlsx)', {
          duration: 4000
        });
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('❌ File size exceeds 10MB limit', {
          duration: 4000
        });
        return;
      }

      setSelectedFile(file);
      setValidationErrors([]);
      toast.success(`📎 File selected: ${file.name}`, {
        icon: '✅',
        duration: 2000
      });
    }
  };

  // Import Excel
  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('❌ Please select a file first', {
        duration: 3000
      });
      return;
    }

    setImporting(true);
    const importToastId = toast.loading('Importing data from Excel...', {
      icon: '⏳'
    });

    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${API_BASE_URL}/barang/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (data.errors && data.errors.length > 0) {
          setValidationErrors(data.errors);
          toast.dismiss(importToastId);
          toast.error(
            <div>
              <div className="font-semibold">❌ Validation Failed</div>
              <div className="text-xs">{data.errors.length} errors found</div>
            </div>,
            { duration: 5000 }
          );
          return;
        }

        // Handle duplicate serial numbers
        if (data.duplicates || data.existing) {
          toast.dismiss(importToastId);
          toast.error(
            <div>
              <div className="font-semibold">❌ Duplicate Serial Numbers</div>
              <div className="text-xs">
                {data.duplicates ? 'Found in file' : 'Already exists in database'}
              </div>
            </div>,
            { duration: 5000 }
          );
          setValidationErrors([data.message]);
          return;
        }

        throw new Error(data.message || 'Import failed');
      }

      // Success
      toast.dismiss(importToastId);
      toast.success(
        <div>
          <div className="font-semibold">✅ Import Successful!</div>
          <div className="text-xs">
            {data.success} items imported
            {data.failed > 0 && `, ${data.failed} failed`}
          </div>
        </div>,
        { duration: 5000 }
      );

      if (data.failed > 0) {
        setTimeout(() => {
          toast.warning(
            <div>
              <div className="font-semibold">⚠️ Some items failed to import</div>
              <div className="text-xs">Check the details below</div>
            </div>,
            { duration: 5000 }
          );
        }, 1000);

        setValidationErrors(data.failedItems.map(item =>
          `${item.serial_number}: ${item.error}`
        ));
      } else {
        // Close modal and refresh data
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
      }

    } catch (error) {
      console.error('Import error:', error);
      toast.dismiss(importToastId);
      toast.error(
        <div>
          <div className="font-semibold">❌ Import Failed</div>
          <div className="text-xs">{error.message}</div>
        </div>,
        { duration: 5000 }
      );
    } finally {
      setImporting(false);
    }
  };

  // Export to Excel
  const handleExport = async () => {
    setExporting(true);
    const exportToastId = toast.loading('Exporting data to Excel...', {
      icon: '⏳'
    });

    try {
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/barang/export`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      a.download = `Data_Barang_${date}.xlsx`;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.dismiss(exportToastId);
      toast.success(
        <div>
          <div className="font-semibold">✅ Export Successful!</div>
          <div className="text-xs">Data exported to Excel file</div>
        </div>,
        { duration: 4000, icon: '📥' }
      );

      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (error) {
      console.error('Export error:', error);
      toast.dismiss(exportToastId);
      toast.error(
        <div>
          <div className="font-semibold">❌ Export Failed</div>
          <div className="text-xs">{error.message}</div>
        </div>,
        { duration: 5000 }
      );
    } finally {
      setExporting(false);
    }
  };

  // Reset and close
  const handleClose = () => {
    setSelectedFile(null);
    setValidationErrors([]);
    setImportPreview(null);
    setActiveTab('import');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  // Style classes
  const modalBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-teal-400' : 'text-teal-600';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const bgSecondary = isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className={`relative ${modalBg} rounded-2xl shadow-2xl max-w-3xl w-full border ${borderColor} transition-colors duration-300`}>

        {/* Header */}
        <div className={`px-8 py-6 border-b ${borderColor} flex justify-between items-center`}>
          <div>
            <h2 className={`text-2xl font-bold ${textPrimary}`}>
              Import / Export Data
            </h2>
            <p className={`text-sm ${textSecondary} mt-1`}>
              Manage your inventory data with Excel files
            </p>
          </div>
          <button
            onClick={handleClose}
            className={`p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${borderColor}`}>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 ${activeTab === 'import'
              ? `bg-teal-600 dark:bg-teal-700 text-white`
              : `${textSecondary} hover:bg-gray-100 dark:hover:bg-gray-700`
              }`}
          >
            Import from Excel
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 ${activeTab === 'export'
              ? `bg-teal-600 dark:bg-teal-700 text-white`
              : `${textSecondary} hover:bg-gray-100 dark:hover:bg-gray-700`
              }`}
          >
            Export to Excel
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'import' ? (
            <div className="space-y-6">
              {/* Instructions */}
              <div className={`${bgSecondary} rounded-xl p-6 border ${borderColor}`}>
                <h3 className={`font-bold ${textPrimary} mb-3 flex items-center`}>
                  <span className="mr-2"></span>
                  Import Instructions
                </h3>
                <ol className={`space-y-2 text-sm ${textSecondary} list-decimal list-inside`}>
                  <li>Download the Excel template below</li>
                  <li>Fill in the data according to the format</li>
                  <li>Upload the completed file</li>
                  <li>Review and confirm the import</li>
                </ol>
              </div>

              {/* Download Template Button */}
              <button
                onClick={handleDownloadTemplate}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download Excel Template
                </span>
              </button>

              {/* File Upload */}
              <div>
                <label className={`block font-semibold ${textPrimary} mb-3`}>
                  Upload Excel File
                </label>
                <div className={`border-2 border-dashed ${borderColor} rounded-xl p-8 text-center hover:border-teal-400 dark:hover:border-teal-500 transition-colors duration-300`}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <svg className={`w-12 h-12 ${textSecondary} mb-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {selectedFile ? (
                        <div>
                          <p className={`font-semibold ${textPrimary}`}>
                            ✅ {selectedFile.name}
                          </p>
                          <p className={`text-sm ${textSecondary} mt-1`}>
                            {(selectedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className={`font-semibold ${textPrimary}`}>
                            Click to upload or drag and drop
                          </p>
                          <p className={`text-sm ${textSecondary} mt-1`}>
                            Excel files (.xlsx, .xls) up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 max-h-60 overflow-y-auto">
                  <h4 className="font-bold text-red-700 dark:text-red-400 mb-2 flex items-center">
                    <span className="mr-2">⚠️</span>
                    Validation Errors ({validationErrors.length})
                  </h4>
                  <ul className="space-y-1 text-sm text-red-600 dark:text-red-300">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Import Button */}
              <button
                onClick={handleImport}
                disabled={!selectedFile || importing}
                className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${!selectedFile || importing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-500 dark:to-blue-500 text-white hover:shadow-lg transform hover:scale-105'
                  }`}
              >
                {importing ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Importing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Import Data
                  </span>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Export Info */}
              <div className={`${bgSecondary} rounded-xl p-6 border ${borderColor}`}>
                <h3 className={`font-bold ${textPrimary} mb-3 flex items-center`}>
                  <span className="mr-2"></span>
                  Export Information
                </h3>
                <p className={`text-sm ${textSecondary}`}>
                  This will export all inventory data to an Excel file. The file will include:
                </p>
                <ul className={`mt-3 space-y-2 text-sm ${textSecondary} list-disc list-inside`}>
                  <li>Item name, type, and serial number</li>
                  <li>MAC address and condition</li>
                  <li>Status and location</li>
                  <li>City and description</li>
                  <li>Created and updated timestamps</li>
                </ul>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={exporting}
                className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${exporting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 text-white hover:shadow-lg transform hover:scale-105'
                  }`}
              >
                {exporting ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Exporting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Export to Excel
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-8 py-4 border-t ${borderColor} flex justify-end`}>
          <button
            onClick={handleClose}
            className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;   