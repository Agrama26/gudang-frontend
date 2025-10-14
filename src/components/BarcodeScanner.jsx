import { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { toast } from 'react-toastify';

const ZXingBarcodeScanner = ({ onScanSuccess, isDarkMode = false }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [error, setError] = useState(null);
    const [scanMode, setScanMode] = useState('auto');
    const [manualInput, setManualInput] = useState('');

    const videoRef = useRef(null);
    const codeReaderRef = useRef(null);

    // Initialize code reader
    useEffect(() => {
        codeReaderRef.current = new BrowserMultiFormatReader();

        return () => {
            stopScanning();
        };
    }, []);

    // Parse network equipment barcode
    const parseNetworkEquipmentBarcode = (rawData) => {
        const parsed = {
            raw: rawData,
            mac_address: '',
            serial_number: '',
            model: '',
            manufacturer: '',
            nama: ''
        };

        // Mikrotik pattern: SN:ABC123456 MAC:AA:BB:CC:DD:EE:FF
        const mikrotikPattern = /SN:([A-Z0-9]+).*MAC:([0-9A-F:]+)/i;
        const mikrotikMatch = rawData.match(mikrotikPattern);

        if (mikrotikMatch) {
            parsed.serial_number = mikrotikMatch[1];
            parsed.mac_address = mikrotikMatch[2];
            parsed.manufacturer = 'Mikrotik';
            parsed.nama = 'Mikrotik RouterBOARD';
            return parsed;
        }

        // TP-Link pattern: Model:XXX SN:123456 MAC:AABBCCDDEEFF
        const tplinkPattern = /Model:([A-Z0-9-]+).*SN:([A-Z0-9]+).*MAC:([0-9A-F:]+)/i;
        const tplinkMatch = rawData.match(tplinkPattern);

        if (tplinkMatch) {
            parsed.model = tplinkMatch[1];
            parsed.serial_number = tplinkMatch[2];
            parsed.mac_address = tplinkMatch[3];
            parsed.manufacturer = 'TP-Link';
            parsed.nama = `TP-Link ${tplinkMatch[1]}`;
            return parsed;
        }

        // Cisco pattern
        const ciscoPattern = /PID:([A-Z0-9-]+).*SN:([A-Z0-9]+)/i;
        const ciscoMatch = rawData.match(ciscoPattern);

        if (ciscoMatch) {
            parsed.model = ciscoMatch[1];
            parsed.serial_number = ciscoMatch[2];
            parsed.manufacturer = 'Cisco';
            parsed.nama = `Cisco ${ciscoMatch[1]}`;
            return parsed;
        }

        // Generic MAC address pattern
        const macPattern = /([0-9A-F]{2}[:-]){5}([0-9A-F]{2})/i;
        const macMatch = rawData.match(macPattern);

        if (macMatch) {
            parsed.mac_address = macMatch[0];
            parsed.serial_number = rawData.replace(macMatch[0], '').trim() || generateSerialNumber();
            parsed.nama = 'Network Device';
            return parsed;
        }

        // If nothing matches, use raw as serial number
        parsed.serial_number = rawData;
        parsed.nama = 'Network Device';
        return parsed;
    };

    // Generate serial number if not found
    const generateSerialNumber = () => {
        return 'SN-' + Date.now().toString(36).toUpperCase();
    };

    // Start scanning
    const startScanning = async () => {
        setError(null);
        setScannedData(null);

        try {
            const codeReader = codeReaderRef.current;

            // Get available video devices
            const videoInputDevices = await codeReader.listVideoInputDevices();

            if (videoInputDevices.length === 0) {
                throw new Error('No camera found on this device');
            }

            // Prefer back camera on mobile
            const selectedDevice = videoInputDevices.find(device =>
                device.label.toLowerCase().includes('back') ||
                device.label.toLowerCase().includes('rear')
            ) || videoInputDevices[0];

            toast.info('Starting camera...', { duration: 2000 });

            setIsScanning(true);

            // Start decoding from video device
            await codeReader.decodeFromVideoDevice(
                selectedDevice.deviceId,
                videoRef.current,
                (result, error) => {
                    if (result) {
                        // Barcode detected!
                        handleBarcodeDetected(result.getText());
                    }

                    if (error && !(error instanceof NotFoundException)) {
                        console.error('Scan error:', error);
                    }
                }
            );

            toast.success('✅ Camera ready! Point at barcode...', { duration: 3000 });

        } catch (err) {
            console.error('Camera error:', err);
            setError(err.message);
            setIsScanning(false);

            if (err.name === 'NotAllowedError') {
                toast.error('❌ Camera permission denied. Please allow camera access.', {
                    duration: 5000
                });
            } else if (err.name === 'NotFoundError') {
                toast.error('❌ No camera found on this device.', {
                    duration: 5000
                });
            } else {
                toast.error('❌ Failed to access camera: ' + err.message, {
                    duration: 5000
                });
            }
        }
    };

    // Stop scanning
    const stopScanning = () => {
        if (codeReaderRef.current) {
            codeReaderRef.current.reset();
        }
        setIsScanning(false);
        toast.info('Scanner stopped', { duration: 2000 });
    };

    // Handle barcode detected
    const handleBarcodeDetected = (rawData) => {
        stopScanning();

        const parsed = parseNetworkEquipmentBarcode(rawData);
        setScannedData(parsed);

        // Play success sound (optional)
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA==');
        audio.play().catch(() => { }); // Ignore if audio fails

        toast.success(
            <>
                <div className="flex flex-col">
                    <span className="font-semibold">✅ Barcode Scanned!</span>
                    <span className="text-sm opacity-80">
                        {parsed.manufacturer || 'Device'} - {parsed.serial_number}
                    </span>
                </div>
            </>,
            { duration: 4000 }
        );

        // Callback to parent
        if (onScanSuccess) {
            onScanSuccess(parsed);
        }
    };

    // Manual input handler
    const handleManualSubmit = () => {
        if (!manualInput.trim()) {
            toast.error('Please enter barcode data');
            return;
        }

        const parsed = parseNetworkEquipmentBarcode(manualInput);
        setScannedData(parsed);

        toast.success('✅ Manual input processed!', { duration: 3000 });

        if (onScanSuccess) {
            onScanSuccess(parsed);
        }

        setManualInput('');
    };

    // Scan from file (optional - untuk testing)
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const codeReader = codeReaderRef.current;
            const result = await codeReader.decodeFromImageUrl(URL.createObjectURL(file));

            handleBarcodeDetected(result.getText());
        } catch (err) {
            toast.error('❌ No barcode found in image');
        }
    };

    const containerClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    const textClass = isDarkMode ? 'text-gray-300' : 'text-gray-700';
    const inputClass = isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900';

    return (
        <div className={`rounded-2xl border shadow-xl p-6 ${containerClass}`}>
            {/* Header */}
            <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${isDarkMode ? 'bg-teal-600' : 'bg-teal-500'
                        }`}>
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zm2 2V5h1v1h-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                    Professional Barcode Scanner
                </h2>
                <p className={`text-sm ${textClass}`}>
                    Supports Mikrotik, TP-Link, Cisco & all standard barcodes
                </p>
            </div>

            {/* Scan Mode Tabs */}
            <div className="flex justify-center space-x-2 mb-6">
                <button
                    onClick={() => setScanMode('auto')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${scanMode === 'auto'
                        ? 'bg-teal-600 text-white'
                        : isDarkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Camera
                </button>
                <button
                    onClick={() => setScanMode('manual')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${scanMode === 'manual'
                        ? 'bg-teal-600 text-white'
                        : isDarkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Manual
                </button>
                <button
                    onClick={() => setScanMode('file')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${scanMode === 'file'
                        ? 'bg-teal-600 text-white'
                        : isDarkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Image
                </button>
            </div>

            {/* Camera Scanner Mode */}
            {scanMode === 'auto' && (
                <div className="mb-6">
                    {!isScanning ? (
                        <div className="text-center">
                            <button
                                onClick={startScanning}
                                className={`w-full py-4 rounded-xl font-bold text-white transition-all transform hover:scale-105 shadow-lg ${isDarkMode
                                    ? 'bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700'
                                    : 'bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600'
                                    }`}
                            >
                                <span className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                    </svg>
                                    Start Camera Scanner
                                </span>
                            </button>

                            {error && (
                                <div className={`mt-4 p-4 rounded-xl border ${isDarkMode
                                    ? 'bg-red-900/20 border-red-600 text-red-400'
                                    : 'bg-red-50 border-red-300 text-red-700'
                                    }`}>
                                    <p className="font-semibold mb-1">❌ Camera Error:</p>
                                    <p className="text-sm">{error}</p>
                                    <p className="text-xs mt-2">Try manual input or image upload mode</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Video Preview with Professional UI */}
                            <div className="relative rounded-xl overflow-hidden bg-black shadow-2xl">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-80 object-cover"
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        height: '320px',
                                        objectFit: 'cover'
                                    }}
                                    onLoadedMetadata={() => {
                                        console.log('✅ Video loaded:', {
                                            width: videoRef.current?.videoWidth,
                                            height: videoRef.current?.videoHeight
                                        });
                                    }}
                                    onError={(e) => {
                                        console.error('❌ Video error:', e);
                                    }}
                                />

                                {/* Scanning Frame Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    {/* Main scanning frame */}
                                    <div className="relative w-72 h-48">
                                        {/* Animated corners */}
                                        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-teal-400 animate-pulse"></div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-teal-400 animate-pulse"></div>
                                        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-teal-400 animate-pulse"></div>
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-teal-400 animate-pulse"></div>

                                        {/* Scanning line animation */}
                                        <div className="absolute top-0 left-0 w-full h-1 bg-teal-400 shadow-lg shadow-teal-400/50"
                                            style={{
                                                animation: 'scan 2s linear infinite'
                                            }}></div>

                                        {/* Center crosshair */}
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            <div className="w-8 h-8 border-2 border-teal-400 rounded-full opacity-50"></div>
                                            <div className="absolute top-1/2 left-0 w-8 h-0.5 bg-teal-400"></div>
                                            <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-teal-400"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Scanning Status Bar */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                                        <span className="text-white text-sm font-semibold">
                                            SCANNING... Point barcode at center
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Control Buttons */}
                            <div className="flex space-x-3 mt-4">
                                <button
                                    onClick={stopScanning}
                                    className={`flex-1 py-3 rounded-xl font-bold transition-all shadow-lg ${isDarkMode
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-red-500 text-white hover:bg-red-600'
                                        }`}
                                >
                                    Stop
                                </button>
                                <button
                                    onClick={() => {
                                        stopScanning();
                                        setTimeout(startScanning, 500);
                                    }}
                                    className={`flex-1 py-3 rounded-xl font-bold transition-all shadow-lg ${isDarkMode
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                >
                                    Restart
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Manual Input Mode */}
            {scanMode === 'manual' && (
                <div className="mb-6">
                    <label className={`block text-sm font-semibold mb-3 ${textClass}`}>
                        Enter Barcode Data Manually
                    </label>
                    <textarea
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleManualSubmit()}
                        placeholder="Examples:&#10;• SN:ABC123456 MAC:AA:BB:CC:DD:EE:FF&#10;• Model:TL-R480 SN:123456 MAC:AABBCCDDEEFF&#10;• PID:C2960X SN:FOC1234ABCD"
                        rows="4"
                        className={`w-full p-4 border rounded-xl font-mono text-sm ${inputClass} focus:ring-2 focus:ring-teal-500 transition-all resize-none`}
                    />
                    <button
                        onClick={handleManualSubmit}
                        className={`w-full mt-3 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${isDarkMode
                            ? 'bg-teal-600 hover:bg-teal-700'
                            : 'bg-teal-500 hover:bg-teal-600'
                            }`}
                    >
                        ✓ Process Manual Input
                    </button>

                    {/* Format Examples */}
                    <div className={`mt-4 p-4 rounded-xl text-xs ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                        } border`}>
                        <p className="font-semibold mb-2 text-teal-600 dark:text-teal-400">
                            Supported Barcode Formats:
                        </p>
                        <div className="space-y-2">
                            <div>
                                <p className="font-semibold text-purple-600 dark:text-purple-400">Mikrotik :</p>
                                <code className={textClass}>SN:ABC123 MAC:AA:BB:CC:DD:EE:FF</code>
                            </div>
                            <div>
                                <p className="font-semibold text-blue-600 dark:text-blue-400">TP-Link :</p>
                                <code className={textClass}>Model:TL-R480 SN:123456 MAC:AABB...</code>
                            </div>
                            <div>
                                <p className="font-semibold text-green-600 dark:text-green-400">Cisco:</p>
                                <code className={textClass}>PID:C2960X SN:FOC1234ABCD</code>
                            </div>
                            <div>
                                <p className="font-semibold text-orange-600 dark:text-orange-400">Generic :</p>
                                <code className={textClass}>Any MAC: AA:BB:CC:DD:EE:FF or serial</code>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* File Upload Mode */}
            {scanMode === 'file' && (
                <div className="mb-6">
                    <label className={`block text-sm font-semibold mb-3 ${textClass}`}>
                        Upload Barcode Image
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDarkMode
                        ? 'border-gray-600 hover:border-teal-400 bg-gray-700/30'
                        : 'border-gray-300 hover:border-teal-500 bg-gray-50'
                        }`}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="barcode-file-upload"
                        />
                        <label htmlFor="barcode-file-upload" className="cursor-pointer">
                            <div className="flex flex-col items-center space-y-3">
                                <svg className={`w-12 h-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <div>
                                    <p className={`font-semibold ${textClass}`}>
                                        Click to upload barcode image
                                    </p>
                                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                        PNG, JPG, JPEG up to 10MB
                                    </p>
                                </div>
                            </div>
                        </label>
                    </div>

                    <div className={`mt-4 p-3 rounded-lg text-xs ${isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-700'
                        }`}>
                        <p className="font-semibold mb-1">Pro Tip:</p>
                        <p>Take a clear, well-lit photo of the barcode label. Make sure the barcode is straight and fills most of the frame.</p>
                    </div>
                </div>
            )}

            {/* Scanned Data Display */}
            {scannedData && (
                <div className={`p-5 rounded-xl border-2 shadow-lg ${isDarkMode
                    ? 'bg-green-900/20 border-green-600'
                    : 'bg-green-50 border-green-400'
                    }`}>
                    <div className="flex items-center space-x-2 mb-4">
                        <svg className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                            ✅ Scan Successful!
                        </span>
                    </div>

                    <div className={`space-y-3 text-sm ${isDarkMode ? 'text-green-300' : 'text-green-900'}`}>
                        {scannedData.manufacturer && (
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold min-w-32">Manufacturer:</span>
                                <span className="font-mono bg-white/20 px-2 py-1 rounded">{scannedData.manufacturer}</span>
                            </div>
                        )}
                        {scannedData.model && (
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold min-w-32">Model:</span>
                                <span className="font-mono bg-white/20 px-2 py-1 rounded">{scannedData.model}</span>
                            </div>
                        )}
                        {scannedData.serial_number && (
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold min-w-32">Serial Number:</span>
                                <span className="font-mono bg-white/20 px-2 py-1 rounded">{scannedData.serial_number}</span>
                            </div>
                        )}
                        {scannedData.mac_address && (
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold min-w-32">MAC Address:</span>
                                <span className="font-mono bg-white/20 px-2 py-1 rounded">{scannedData.mac_address}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex space-x-3 mt-4">
                        <button
                            onClick={() => {
                                setScannedData(null);
                                setManualInput('');
                            }}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${isDarkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            Scan Another
                        </button>
                    </div>
                </div>
            )}

            {/* Tips Section */}
            <div className={`mt-6 p-4 rounded-xl text-xs border ${isDarkMode ? 'bg-blue-900/20 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-300 text-blue-800'
                }`}>
                <p className="font-semibold mb-2 flex items-center">
                    <span className="mr-2"></span>
                    Scanning Tips for Best Results:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Ensure good lighting (avoid shadows)</li>
                    <li>Hold device steady, 10-15cm from barcode</li>
                    <li>Keep barcode flat and clean</li>
                    <li>For damaged barcodes, use manual input</li>
                    <li>Image upload works best for printed labels</li>
                </ul>
            </div>

            {/* CSS for scanning animation */}
            <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(192px); }
          100% { transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default ZXingBarcodeScanner;