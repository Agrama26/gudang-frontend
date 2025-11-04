import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const BarcodeScanner = ({ onScanSuccess, isDarkMode = false }) => {
    const [scannerMode, setScannerMode] = useState('hardware'); 
    const [scannedData, setScannedData] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [scanBuffer, setScanBuffer] = useState('');
    const [lastKeyTime, setLastKeyTime] = useState(0);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState('');

    const scannerInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const bufferRef = useRef('');
    const timeoutRef = useRef(null);
    const scanIntervalRef = useRef(null);

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

        console.log('Parsing barcode:', rawData);

        // Clean the input data
        const cleanData = rawData.trim();

        // 1. Mikrotik: SN:ABC123456 MAC:AA:BB:CC:DD:EE:FF
        const mikrotikPattern = /SN:([A-Z0-9]+).*MAC:([0-9A-F:]{17})/i;
        const mikrotikMatch = cleanData.match(mikrotikPattern);

        if (mikrotikMatch) {
            parsed.serial_number = mikrotikMatch[1].trim();
            parsed.mac_address = mikrotikMatch[2].trim().toUpperCase();
            parsed.manufacturer = 'Mikrotik';
            parsed.nama = 'Mikrotik RouterBOARD';
            parsed.model = 'RouterBOARD';
            console.log('✅ Matched Mikrotik pattern');
            return parsed;
        }

        // 2. TP-Link: Model:TL-XXX SN:123456 MAC:AABBCCDDEEFF
        const tplinkPattern = /Model:(TL-[A-Z0-9-]+).*SN:([0-9A-Z]+).*MAC:([0-9A-F:]+)/i;
        const tplinkMatch = cleanData.match(tplinkPattern);

        if (tplinkMatch) {
            parsed.model = tplinkMatch[1].trim();
            parsed.serial_number = tplinkMatch[2].trim();
            let mac = tplinkMatch[3].trim().toUpperCase();
            // Format MAC address jika tanpa colon
            if (mac.length === 12 && !mac.includes(':')) {
                mac = mac.match(/.{1,2}/g).join(':');
            }
            parsed.mac_address = mac;
            parsed.manufacturer = 'TP-Link';
            parsed.nama = `TP-Link ${tplinkMatch[1]}`;
            console.log('✅ Matched TP-Link pattern');
            return parsed;
        }

        // 3. Cisco: PID:C2960X SN:FOC1234ABCD
        const ciscoPattern = /PID:([A-Z0-9-]+).*SN:([A-Z0-9]+)/i;
        const ciscoMatch = cleanData.match(ciscoPattern);

        if (ciscoMatch) {
            parsed.model = ciscoMatch[1].trim();
            parsed.serial_number = ciscoMatch[2].trim();
            parsed.manufacturer = 'Cisco';
            parsed.nama = `Cisco ${ciscoMatch[1]}`;
            console.log('✅ Matched Cisco pattern');
            return parsed;
        }

        // 4. Cek jika data HANYA berisi MAC address DENGAN colon
        const macWithColonPattern = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
        const macWithColonMatch = cleanData.match(macWithColonPattern);

        if (macWithColonMatch) {
            parsed.mac_address = cleanData.toUpperCase();
            parsed.serial_number = ''; // Jangan isi serial number
            parsed.nama = 'Network Device';
            parsed.manufacturer = 'Unknown';
            console.log('✅ Matched MAC address with colon');
            return parsed;
        }

        // 5. Cek jika data HANYA berisi MAC address TANPA colon 
        const macWithoutColonPattern = /^[0-9A-Fa-f]{12}$/;
        const macWithoutColonMatch = cleanData.match(macWithoutColonPattern);

        if (macWithoutColonMatch) {
            // Format ke standard MAC address dengan colon
            const formattedMac = cleanData.toUpperCase().match(/.{1,2}/g).join(':');
            parsed.mac_address = formattedMac;
            parsed.serial_number = ''; // Jangan isi serial number
            parsed.nama = 'Network Device';
            parsed.manufacturer = 'Unknown';
            console.log('✅ Matched MAC address without colon:', formattedMac);
            return parsed;
        }

        // 6. Cek jika data mengandung MAC address tanpa colon dalam teks
        const macInTextWithoutColonPattern = /MAC:?\s*([0-9A-Fa-f]{12})/i;
        const macInTextWithoutColonMatch = cleanData.match(macInTextWithoutColonPattern);

        if (macInTextWithoutColonMatch) {
            const rawMac = macInTextWithoutColonMatch[1].toUpperCase();
            const formattedMac = rawMac.match(/.{1,2}/g).join(':');
            parsed.mac_address = formattedMac;

            // Cari serial number terpisah
            const serialInTextPattern = /SN:?\s*([A-Z0-9]+)/i;
            const serialInTextMatch = cleanData.match(serialInTextPattern);

            if (serialInTextMatch) {
                parsed.serial_number = serialInTextMatch[1];
            } else {
                // Jika tidak ada SN, coba ambil data lain yang bukan MAC
                const remainingText = cleanData.replace(macInTextWithoutColonPattern, '').trim();
                if (remainingText && remainingText.length >= 6) {
                    parsed.serial_number = remainingText;
                }
            }

            parsed.nama = 'Network Device';
            parsed.manufacturer = 'Unknown';
            console.log('✅ Matched MAC without colon in text:', formattedMac);
            return parsed;
        }

        // 7. Deteksi MAC address tanpa colon secara general dalam teks
        const generalMacWithoutColonPattern = /\b([0-9A-Fa-f]{12})\b/;
        const generalMacWithoutColonMatch = cleanData.match(generalMacWithoutColonPattern);

        if (generalMacWithoutColonMatch && cleanData.length <= 20) {
            // Jika seluruh data pendek dan berupa 12 karakter hex, kemungkinan itu MAC address
            const rawMac = generalMacWithoutColonMatch[1].toUpperCase();
            const formattedMac = rawMac.match(/.{1,2}/g).join(':');
            parsed.mac_address = formattedMac;
            parsed.serial_number = ''; // Jangan isi serial number
            parsed.nama = 'Network Device';
            parsed.manufacturer = 'Unknown';
            console.log('✅ Matched general MAC without colon:', formattedMac);
            return parsed;
        }

        // 8. Cek jika data HANYA berisi serial number 
        const serialOnlyPattern = /^[A-Z0-9]{6,20}$/i;
        const isHexOnly = /^[0-9A-F]+$/i.test(cleanData); // Jangan anggap hex murni sebagai serial

        if (serialOnlyPattern.test(cleanData) && !isHexOnly) {
            parsed.serial_number = cleanData;
            parsed.mac_address = ''; // Jangan isi MAC address
            parsed.nama = 'Network Equipment';
            parsed.manufacturer = 'Unknown';
            console.log('✅ Matched serial number only');
            return parsed;
        }

        // 9. Generic pattern dengan MAC address dengan colon
        const macInTextWithColonPattern = /MAC:?\s*([0-9A-Fa-f:]{17})/i;
        const macInTextWithColonMatch = cleanData.match(macInTextWithColonPattern);

        if (macInTextWithColonMatch) {
            parsed.mac_address = macInTextWithColonMatch[1].toUpperCase();

            // Cari serial number terpisah
            const serialInTextPattern = /SN:?\s*([A-Z0-9]+)/i;
            const serialInTextMatch = cleanData.match(serialInTextPattern);

            if (serialInTextMatch) {
                parsed.serial_number = serialInTextMatch[1];
            }

            parsed.nama = 'Network Device';
            parsed.manufacturer = 'Unknown';
            console.log('✅ Matched MAC with colon in text');
            return parsed;
        }

        // 10. Fallback: analisis konten untuk menentukan jenis data
        const hasMacKeywords = /MAC|Address|Ethernet/i.test(cleanData);
        const hasSerialKeywords = /SN|Serial|S\/N/i.test(cleanData);
        const isLikelyMac = /[0-9A-F]{12}/i.test(cleanData) && cleanData.length <= 17;
        const isLikelySerial = cleanData.length >= 6 && cleanData.length <= 25 && /[G-Z]/i.test(cleanData);

        if (isLikelyMac && !isLikelySerial) {
            // Coba format sebagai MAC address
            const macCandidate = cleanData.replace(/[^0-9A-F]/gi, '').toUpperCase();
            if (macCandidate.length === 12) {
                parsed.mac_address = macCandidate.match(/.{1,2}/g).join(':');
                parsed.serial_number = '';
                console.log('✅ Fallback: Detected as MAC address');
            } else {
                parsed.serial_number = cleanData;
            }
        } else {
            parsed.serial_number = cleanData;
            parsed.mac_address = '';
            console.log('⚠️ Fallback: Default to serial number');
        }

        parsed.nama = 'Unknown Device';
        parsed.manufacturer = 'Unknown';

        return parsed;
    };

    // Helper function untuk format MAC address
    const formatMacAddress = (mac) => {
        if (!mac) return '';

        // Hapus semua non-hex characters
        const cleanMac = mac.replace(/[^0-9A-Fa-f]/g, '');

        // Jika panjang 12 karakter, format dengan colon
        if (cleanMac.length === 12) {
            return cleanMac.toUpperCase().match(/.{1,2}/g).join(':');
        }

        return mac.toUpperCase();
    };

    // Handle barcode scanned
    const handleBarcodeScanned = (barcodeData) => {
        if (!barcodeData || barcodeData.trim().length < 3) return;

        console.log('Raw barcode scanned:', barcodeData);

        const parsed = parseNetworkEquipmentBarcode(barcodeData);
        console.log('Parsed data:', parsed); // Debug log

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

    // Camera scanning functions
    const startCameraScan = async () => {
        try {
            setCameraError('');

            // Stop any existing stream first
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            // Request camera access dengan options lebih spesifik
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;

                // Tunggu video ready
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play().catch(console.error);
                };
            }

            setCameraActive(true);

            toast.info('Camera activated! Point at barcode...', {
                duration: 3000,
                icon: ''
            });

        } catch (error) {
            console.error('Error accessing camera:', error);
            let errorMessage = 'Cannot access camera. ';

            if (error.name === 'NotAllowedError') {
                errorMessage += 'Please check camera permissions.';
            } else if (error.name === 'NotFoundError') {
                errorMessage += 'No camera found.';
            } else if (error.name === 'NotSupportedError') {
                errorMessage += 'Camera not supported.';
            } else {
                errorMessage += error.message;
            }

            setCameraError(errorMessage);
            toast.error('Cannot access camera');
        }
    };

    const stopCameraScan = () => {
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setCameraActive(false);
        toast.info('Camera stopped', { duration: 2000 });
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

            // Auto-submit after 100ms of no input 
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

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (scanIntervalRef.current) {
                clearInterval(scanIntervalRef.current);
            }
        };
    }, []);

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

        toast.info('Scanner stopped', {
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
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ${isDarkMode ? 'bg-gradient-to-br from-blue-600 to-cyan-600' : 'bg-gradient-to-br from-blue-500 to-teal-500'
                        }`}>
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zm2 2V5h1v1h-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Use Barcode Scanner
                </h2>
            </div>

            {/* Scanner Mode Tabs */}
            <div className="flex justify-center space-x-2 mb-6">
                <button
                    onClick={() => setScannerMode('hardware')}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${scannerMode === 'hardware'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : isDarkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Use Scanner
                </button>
                <button
                    onClick={() => setScannerMode('camera')}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${scannerMode === 'camera'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : isDarkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Use Camera
                </button>
                <button
                    onClick={() => setScannerMode('manual')}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${scannerMode === 'manual'
                        ? 'bg-blue-600 text-white shadow-lg'
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
                    <div className={`p-4 rounded-xl text-center transition-all ${isListening
                        ? isDarkMode
                            ? 'bg-green-900/20 border-green-600'
                            : 'bg-green-50 border-green-400'
                        : isDarkMode
                            ? 'bg-gray-700/50 border-gray-600'
                            : 'bg-gray-100 border-gray-300'
                        }`}>
                        <div className="flex items-center justify-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${isListening ? 'bg-green-500 animate-ping' : 'bg-gray-400'
                                }`}></div>
                            <span className={`text-lg font-bold ${isListening
                                ? isDarkMode ? 'text-green-400' : 'text-green-700'
                                : textClass
                                }`}>
                                {isListening ? 'Ready to scan' : 'Scanner Inactive'}
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
                                <p className="text-xs text-gray-500 mb-2">Buffer :</p>
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
                                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700'
                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-teal-600'
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
                </div>
            )}

            {/* Camera Scanner Mode */}
            {scannerMode === 'camera' && (
                <div className="space-y-6">
                    {/* Camera Preview */}
                    <div className={`p-4 rounded-xl text-center transition-all ${cameraActive
                        ? isDarkMode
                            ? 'bg-purple-900/20 border-purple-600'
                            : 'bg-purple-50 border-purple-400'
                        : isDarkMode
                            ? 'bg-gray-700/50 border-gray-600'
                            : 'bg-gray-100 border-gray-300'
                        }`}>

                        {cameraActive ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center space-x-3 mb-4">
                                    <div className="w-4 h-4 rounded-full bg-purple-500 animate-ping"></div>
                                    <span className={`text-lg font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                                        Camera Active - Point at Barcode
                                    </span>
                                </div>

                                {/* Debug Info */}
                                <div className={`text-xs p-2 rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                                    Stream: {streamRef.current ? 'Active' : 'Inactive'} |
                                    Video: {videoRef.current ? 'Ready' : 'Loading'}
                                </div>

                                {/* Camera Video Feed */}
                                <div className="relative mx-auto max-w-md">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-64 object-cover rounded-lg border-2 border-purple-500 bg-black"
                                        onLoadedData={() => console.log('Video loaded')}
                                        onError={(e) => console.error('Video error:', e)}
                                    />
                                    <canvas
                                        ref={canvasRef}
                                        className="absolute top-0 left-0 opacity-0"
                                    />
                                    {/* Scanning overlay */}
                                    <div className="absolute inset-0 border-2 border-red-500 rounded-lg animate-pulse pointer-events-none">
                                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-red-500 transform -translate-y-1/2 animate-bounce"></div>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Position barcode within the red frame
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                                    <span className={`text-lg font-bold ${textClass}`}>
                                        Camera Inactive
                                    </span>
                                </div>

                                <div className={`p-8 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                    </svg>
                                    <p className="mt-2 text-sm text-gray-500">Camera preview will appear here</p>
                                </div>
                            </div>
                        )}

                        {/* Camera Error */}
                        {cameraError && (
                            <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-700'}`}>
                                <p className="text-sm">{cameraError}</p>
                            </div>
                        )}
                    </div>

                    {/* Control Buttons */}
                    <div className="flex space-x-4">
                        {!cameraActive ? (
                            <button
                                onClick={startCameraScan}
                                className={`flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all transform hover:scale-105 shadow-lg ${isDarkMode
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                                    }`}
                            >
                                <span className="flex items-center justify-center">
                                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                    </svg>
                                    Start Camera
                                </span>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={simulateCameraScan}
                                    className={`flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all shadow-lg ${isDarkMode
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-green-500 hover:bg-green-600'
                                        }`}
                                >
                                    <span className="flex items-center justify-center">
                                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Simulate Scan
                                    </span>
                                </button>
                                <button
                                    onClick={stopCameraScan}
                                    className={`flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all shadow-lg ${isDarkMode
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-red-500 hover:bg-red-600'
                                        }`}
                                >
                                    <span className="flex items-center justify-center">
                                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                                        </svg>
                                        Stop Camera
                                    </span>
                                </button>
                            </>
                        )}
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
                        Tip : You can also paste barcode data directly here
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
                            Scan Successful!
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
        </div>
    );
};

export default BarcodeScanner;