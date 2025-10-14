import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const HardwareBarcodeScanner = ({ onScanSuccess, isDarkMode = false }) => {
    const [scannerMode, setScannerMode] = useState('hardware'); // 'hardware' or 'manual'
    const [scannedData, setScannedData] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [scanBuffer, setScanBuffer] = useState('');
    const [lastKeyTime, setLastKeyTime] = useState(0);

    const scannerInputRef = useRef(null);
    const bufferRef = useRef('');
    const timeoutRef = useRef(null);

    // Parse barcode data untuk network equipment
    const parseNetworkEquipmentBarcode = (rawData) => {
        const parsed = {
            raw: rawData,
            mac_address: '',
            serial_number: '',
            model: '',
            manufacturer: '',
            nama: ''
        };

        // Mikrotik: SN:ABC123456 MAC:AA:BB:CC:DD:EE:FF
        const mikrotikPattern = /SN:([A-Z0-9]+).*MAC:([0-9A-F:]+)/i;
        const mikrotikMatch = rawData.match(mikrotikPattern);

        if (mikrotikMatch) {
            parsed.serial_number = mikrotikMatch[1];
            parsed.mac_address = mikrotikMatch[2];
            parsed.manufacturer = 'Mikrotik';
            parsed.nama = 'Mikrotik RouterBOARD';
            parsed.model = 'RouterBOARD';
            return parsed;
        }

        // TP-Link: Model:TL-XXX SN:123456 MAC:AABBCCDDEEFF
        const tplinkPattern = /Model:(TL-[A-Z0-9-]+).*SN:([0-9]+).*MAC:([0-9A-F:]+)/i;
        const tplinkMatch = rawData.match(tplinkPattern);

        if (tplinkMatch) {
            parsed.model = tplinkMatch[1];
            parsed.serial_number = tplinkMatch[2];
            parsed.mac_address = tplinkMatch[3];
            parsed.manufacturer = 'TP-Link';
            parsed.nama = `TP-Link ${tplinkMatch[1]}`;
            return parsed;
        }

        // Cisco: PID:C2960X SN:FOC1234ABCD
        const ciscoPattern = /PID:([A-Z0-9-]+).*SN:(FOC[A-Z0-9]+)/i;
        const ciscoMatch = rawData.match(ciscoPattern);

        if (ciscoMatch) {
            parsed.model = ciscoMatch[1];
            parsed.serial_number = ciscoMatch[2];
            parsed.manufacturer = 'Cisco';
            parsed.nama = `Cisco ${ciscoMatch[1]}`;
            return parsed;
        }

        // Generic MAC address
        const macPattern = /([0-9A-F]{2}[:-]){5}([0-9A-F]{2})/i;
        const macMatch = rawData.match(macPattern);

        if (macMatch) {
            parsed.mac_address = macMatch[0];
            parsed.serial_number = rawData.replace(macMatch[0], '').trim() || `SN-${Date.now()}`;
            parsed.nama = 'Network Device';
            return parsed;
        }

        // Default: gunakan sebagai serial number
        parsed.serial_number = rawData;
        parsed.nama = 'Network Equipment';
        return parsed;
    };

    // Handle barcode scanned
    const handleBarcodeScanned = (barcodeData) => {
        if (!barcodeData || barcodeData.trim().length < 3) return;

        console.log('Barcode scanned:', barcodeData);

        const parsed = parseNetworkEquipmentBarcode(barcodeData);
        setScannedData(parsed);

        // Play success sound
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA==');
        audio.play().catch(() => { });

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

        // Clear buffer
        bufferRef.current = '';
        setScanBuffer('');
    };

    // Listen for hardware scanner input
    useEffect(() => {
        if (!isListening) return;

        const handleKeyPress = (e) => {
            const currentTime = Date.now();
            const timeDiff = currentTime - lastKeyTime;

            // Scanner biasanya type sangat cepat (< 50ms per character)
            // Keyboard manual biasanya > 100ms per character
            const isFromScanner = timeDiff < 50;

            // Update last key time
            setLastKeyTime(currentTime);

            // Clear timeout jika ada
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Jika Enter key, process buffer
            if (e.key === 'Enter') {
                e.preventDefault();
                if (bufferRef.current.length > 0) {
                    handleBarcodeScanned(bufferRef.current);
                    bufferRef.current = '';
                    setScanBuffer('');
                }
                return;
            }

            // Ignore control keys
            if (e.key.length > 1 && e.key !== 'Enter') return;

            // Add to buffer
            bufferRef.current += e.key;
            setScanBuffer(bufferRef.current);

            // Auto-submit after 100ms of no input (scanner finished)
            timeoutRef.current = setTimeout(() => {
                if (bufferRef.current.length > 3) {
                    handleBarcodeScanned(bufferRef.current);
                    bufferRef.current = '';
                    setScanBuffer('');
                }
            }, 100);
        };

        // Attach listener
        window.addEventListener('keypress', handleKeyPress);

        return () => {
            window.removeEventListener('keypress', handleKeyPress);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isListening, lastKeyTime]);

    // Auto-focus pada mount
    useEffect(() => {
        if (scannerInputRef.current && isListening) {
            scannerInputRef.current.focus();
        }
    }, [isListening]);

    const startListening = () => {
        setIsListening(true);
        bufferRef.current = '';
        setScanBuffer('');
        setScannedData(null);

        toast.info('Scanner ready! Scan your barcode now...', {
            duration: 3000,
            icon: ''
        });

        // Focus input
        setTimeout(() => {
            if (scannerInputRef.current) {
                scannerInputRef.current.focus();
            }
        }, 100);
    };

    const stopListening = () => {
        setIsListening(false);
        bufferRef.current = '';
        setScanBuffer('');

        toast.info('🔒 Scanner stopped', {
            duration: 2000
        });
    };

    const containerClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    const textClass = isDarkMode ? 'text-gray-300' : 'text-gray-700';
    const inputClass = isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900';

    return (
        <div className={`rounded-2xl border shadow-xl p-6 ${containerClass}`}>
            {/* Header */}
            <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ${isDarkMode ? 'bg-gradient-to-br from-purple-600 to-blue-600' : 'bg-gradient-to-br from-purple-500 to-blue-500'
                        }`}>
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zm2 2V5h1v1h-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    Hardware Barcode Scanner
                </h2>
                <p className={`text-sm ${textClass}`}>
                    Use USB or Bluetooth barcode scanner
                </p>
            </div>

            {/* Scanner Mode Tabs */}
            <div className="flex justify-center space-x-2 mb-6">
                <button
                    onClick={() => setScannerMode('hardware')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${scannerMode === 'hardware'
                            ? 'bg-purple-600 text-white shadow-lg'
                            : isDarkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    USB/Bluetooth Scanner
                </button>
                <button
                    onClick={() => setScannerMode('manual')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${scannerMode === 'manual'
                            ? 'bg-purple-600 text-white shadow-lg'
                            : isDarkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Manual Input
                </button>
            </div>

            {/* Hardware Scanner Mode */}
            {scannerMode === 'hardware' && (
                <div className="space-y-6">
                    {/* Scanner Status */}
                    <div className={`p-6 rounded-xl border-2 text-center transition-all ${isListening
                            ? isDarkMode
                                ? 'bg-green-900/20 border-green-600'
                                : 'bg-green-50 border-green-400'
                            : isDarkMode
                                ? 'bg-gray-700/50 border-gray-600'
                                : 'bg-gray-100 border-gray-300'
                        }`}>
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className={`w-4 h-4 rounded-full ${isListening ? 'bg-green-500 animate-ping' : 'bg-gray-400'
                                }`}></div>
                            <span className={`text-lg font-bold ${isListening
                                    ? isDarkMode ? 'text-green-400' : 'text-green-700'
                                    : textClass
                                }`}>
                                {isListening ? '🟢 SCANNER ACTIVE - Ready to scan' : '⚫ SCANNER INACTIVE'}
                            </span>
                        </div>

                        {/* Hidden input for scanner */}
                        <input
                            ref={scannerInputRef}
                            type="text"
                            className="opacity-0 absolute pointer-events-none"
                            aria-hidden="true"
                            tabIndex={-1}
                        />

                        {/* Scan Buffer Display */}
                        {isListening && scanBuffer && (
                            <div className={`mt-4 p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                                }`}>
                                <p className="text-xs text-gray-500 mb-2">Buffer:</p>
                                <p className={isDarkMode ? 'text-green-400' : 'text-green-700'}>
                                    {scanBuffer}
                                    <span className="animate-pulse"></span>
                                </p>
                            </div>
                        )}

                        {/* Instructions */}
                        {isListening && (
                            <div className="mt-4 text-sm">
                                <p className={isDarkMode ? 'text-green-400' : 'text-green-700'}>
                                    Point your scanner at the barcode and press trigger
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Control Buttons */}
                    <div className="flex space-x-4">
                        {!isListening ? (
                            <button
                                onClick={startListening}
                                className={`flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all transform hover:scale-105 shadow-lg ${isDarkMode
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                                        : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                                    }`}
                            >
                                <span className="flex items-center justify-center">
                                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                    Activate Scanner
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={stopListening}
                                className={`flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all shadow-lg ${isDarkMode
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-red-500 hover:bg-red-600'
                                    }`}
                            >
                                <span className="flex items-center justify-center">
                                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                                    </svg>
                                    Stop Scanner
                                </span>
                            </button>
                        )}
                    </div>

                    {/* Scanner Info */}
                    <div className={`p-4 rounded-xl text-xs ${isDarkMode ? 'bg-blue-900/20 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-300 text-blue-800'
                        } border`}>
                        <p className="font-semibold mb-2">How Hardware Scanner Works :</p>
                        <ul className="space-y-1 list-disc list-inside">
                            <li>Scanner acts like a keyboard - types barcode data automatically</li>
                            <li>Click "Activate Scanner" to start listening</li>
                            <li>Point scanner at barcode and pull trigger</li>
                            <li>Data will be captured and processed automatically</li>
                            <li>Works with USB and Bluetooth barcode scanners</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Manual Input Mode */}
            {scannerMode === 'manual' && (
                <div className="space-y-4">
                    <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                        Enter Barcode Data Manually
                    </label>
                    <textarea
                        placeholder="Paste or type barcode data here...&#10;&#10;Examples:&#10;• SN:ABC123456 MAC:AA:BB:CC:DD:EE:FF&#10;• Model:TL-R480 SN:123456 MAC:AABBCCDDEEFF"
                        rows="5"
                        className={`w-full p-4 border rounded-xl font-mono text-sm ${inputClass} focus:ring-2 focus:ring-purple-500 transition-all resize-none`}
                        onPaste={(e) => {
                            const pastedData = e.clipboardData.getData('text');
                            if (pastedData) {
                                setTimeout(() => handleBarcodeScanned(pastedData), 100);
                            }
                        }}
                    />
                    <p className="text-xs text-gray-500">
                        Tip: You can also paste barcode data directly here
                    </p>
                </div>
            )}

            {/* Scanned Data Display */}
            {scannedData && (
                <div className={`mt-6 p-5 rounded-xl border-2 shadow-lg ${isDarkMode
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
                                <span className="font-semibold min-w-32">Manufacturer :</span>
                                <span className="font-mono bg-white/20 px-3 py-1 rounded">{scannedData.manufacturer}</span>
                            </div>
                        )}
                        {scannedData.model && (
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold min-w-32">Model :</span>
                                <span className="font-mono bg-white/20 px-3 py-1 rounded">{scannedData.model}</span>
                            </div>
                        )}
                        {scannedData.serial_number && (
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold min-w-32">Serial Number :</span>
                                <span className="font-mono bg-white/20 px-3 py-1 rounded">{scannedData.serial_number}</span>
                            </div>
                        )}
                        {scannedData.mac_address && (
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold min-w-32">MAC Address :</span>
                                <span className="font-mono bg-white/20 px-3 py-1 rounded">{scannedData.mac_address}</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            setScannedData(null);
                            if (isListening && scannerInputRef.current) {
                                scannerInputRef.current.focus();
                            }
                        }}
                        className={`w-full mt-4 py-2 rounded-lg text-sm font-semibold transition-all ${isDarkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Scan Another Barcode
                    </button>
                </div>
            )}

            {/* Setup Instructions */}
            <div className={`mt-6 p-4 rounded-xl border ${isDarkMode ? 'bg-purple-900/20 border-purple-700 text-purple-300' : 'bg-purple-50 border-purple-300 text-purple-800'
                }`}>
                <p className="font-semibold mb-2 flex items-center">
                    <span className="mr-2">🔧</span>
                    Hardware Scanner Setup:
                </p>
                <ol className="text-sm space-y-1 list-decimal list-inside ml-4">
                    <li>Connect your USB barcode scanner to computer</li>
                    <li>Or pair Bluetooth scanner with your device</li>
                    <li>Open this page in browser</li>
                    <li>Click "Activate Scanner" button</li>
                    <li>Point scanner at barcode and pull trigger</li>
                    <li>Data will automatically fill the form</li>
                </ol>
            </div>
        </div>
    );
};

export default HardwareBarcodeScanner;