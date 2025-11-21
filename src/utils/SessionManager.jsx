import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const SessionManager = ({ children, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showWarning, setShowWarning] = useState(false);
    const warningTimerRef = useRef(null);
    const checkIntervalRef = useRef(null);
    const lastActivityRef = useRef(Date.now());
    const warningShownRef = useRef(false);

    // CONFIGURATION CONSTANTS
    const SESSION_TIMEOUT = 5 * 60 * 60 * 1000;
    const WARNING_TIME = 5 * 60 * 1000;
    const IDLE_TIMEOUT = SESSION_TIMEOUT;
    const CHECK_INTERVAL = 60 * 1000;

    // API Base URL
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // UTILITY: Parse JWT Token
    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                window.atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error parsing JWT:', error);
            return null;
        }
    };

    // GET TOKEN & USER
    const getToken = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            return user?.token || null;
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    };

    const getUser = () => {
        try {
            return JSON.parse(localStorage.getItem('user') || 'null');
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    };

    // GET TOKEN EXPIRY TIME
    const getTokenExpiryTime = () => {
        const token = getToken();
        if (!token) return null;

        const payload = parseJwt(token);
        if (!payload || !payload.exp) return null;

        return payload.exp * 1000; // Convert to milliseconds
    };

    // FORMAT TIME REMAINING
    const formatTimeRemaining = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    };

    // CHECK SESSION STATUS
    const checkSession = () => {
        const user = getUser();
        const token = getToken();

        // Jangan lakukan apa-apa jika tidak ada user/token
        if (!user || !token) {
            console.log('SessionManager: No user/token found, skipping check');
            return;
        }

        // Skip check pada halaman login
        if (location.pathname === '/') {
            console.log('SessionManager: On login page, skipping check');
            return;
        }

        const expiryTime = getTokenExpiryTime();
        if (!expiryTime) {
            console.warn('SessionManager: Unable to get token expiry time');
            handleLogout('NO_EXPIRY');
            return;
        }

        const currentTime = Date.now();
        const timeRemaining = expiryTime - currentTime;

        console.log('SessionManager: Session Status:', {
            user: user.username,
            expiryTime: new Date(expiryTime).toLocaleString(),
            timeRemaining: formatTimeRemaining(timeRemaining),
            isExpired: timeRemaining <= 0,
            currentPath: location.pathname
        });

        // Token expired - auto logout
        if (timeRemaining <= 0) {
            console.log('SessionManager: Token expired - auto logout');
            handleLogout('EXPIRED');
            return;
        }

        // Show warning if close to expiry (5 minutes)
        if (timeRemaining <= WARNING_TIME && !warningShownRef.current) {
            showExpiryWarning(timeRemaining);
            warningShownRef.current = true;
        }

        // Reset warning if time increases (after refresh)
        if (timeRemaining > WARNING_TIME && warningShownRef.current) {
            warningShownRef.current = false;
            setShowWarning(false);
            toast.dismiss('session-warning');
        }
    };

    // CHECK IDLE TIME
    const checkIdleTime = () => {
        const user = getUser();

        // Jangan check idle jika tidak ada user
        if (!user) {
            return;
        }

        // Skip pada halaman login
        if (location.pathname === '/') {
            return;
        }

        const lastActivity = lastActivityRef.current;
        const idleTime = Date.now() - lastActivity;

        console.log('SessionManager: Idle Status:', {
            idleTime: formatTimeRemaining(idleTime),
            threshold: formatTimeRemaining(IDLE_TIMEOUT)
        });

        // User idle too long - auto logout
        if (idleTime >= IDLE_TIMEOUT) {
            console.log('SessionManager: User idle timeout - auto logout');
            handleLogout('IDLE_TIMEOUT');
        }
    };

    // SHOW EXPIRY WARNING
    const showExpiryWarning = (timeRemaining) => {
        setShowWarning(true);
        const minutes = Math.floor(timeRemaining / 1000 / 60);
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        toast.warning(
            <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                    <span className="text-2xl">⏰</span>
                    <div>
                        <div className="font-bold text-base">Session Expiring Soon!</div>
                        <div className="text-sm opacity-90">
                            Your session will expire in {minutes > 0 ? `${minutes} minute${minutes !== 1 ? 's' : ''}` : `${seconds} seconds`}
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleExtendSession}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105"
                >
                    Extend Session (5 more hours)
                </button>
            </div>,
            {
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                position: 'top-center',
                toastId: 'session-warning',
                className: 'toast-session-warning'
            }
        );
    };

    // EXTEND SESSION (REFRESH TOKEN)
    const handleExtendSession = async () => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('No token found');
            }

            console.log('SessionManager: Refreshing token...');

            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to refresh token');
            }

            const data = await response.json();

            // Update token in localStorage
            const user = getUser();
            if (user) {
                user.token = data.token;
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', data.token);
            }

            // Reset states
            setShowWarning(false);
            warningShownRef.current = false;
            lastActivityRef.current = Date.now();
            toast.dismiss('session-warning');

            toast.success(
                <div className="flex flex-col">
                    <span className="font-semibold">✅ Session Extended!</span>
                    <span className="text-sm opacity-80">
                        Your session has been extended for 5 more hours
                    </span>
                </div>,
                {
                    icon: '🔄',
                    duration: 3000
                }
            );

            console.log('SessionManager: Token refreshed successfully');

        } catch (error) {
            console.error('SessionManager: Failed to extend session:', error);

            toast.error(
                <div className="flex flex-col">
                    <span className="font-semibold">Failed to Extend Session</span>
                    <span className="text-sm opacity-80">
                        {error.message || 'Please login again'}
                    </span>
                </div>,
                {
                    duration: 5000
                }
            );

            // If refresh fails, logout
            setTimeout(() => {
                handleLogout('REFRESH_FAILED');
            }, 2000);
        }
    };

    // HANDLE LOGOUT
    const handleLogout = (reason) => {
        console.log('SessionManager: Auto logout triggered:', reason);

        // Clear all timers
        if (warningTimerRef.current) {
            clearInterval(warningTimerRef.current);
            warningTimerRef.current = null;
        }
        if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
        }

        // Clear storage
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        // Reset states
        setShowWarning(false);
        warningShownRef.current = false;
        toast.dismiss('session-warning');

        // Show appropriate message based on reason
        let message = '';
        let icon = '🔒';

        switch (reason) {
            case 'EXPIRED':
                message = 'Your session has expired after 5 hours. Please login again.';
                icon = '⏰';
                break;
            case 'IDLE_TIMEOUT':
                message = 'You have been logged out due to inactivity (5 hours).';
                icon = '💤';
                break;
            case 'NO_TOKEN':
            case 'NO_EXPIRY':
                message = 'Session not found. Please login again.';
                icon = '🔒';
                break;
            case 'REFRESH_FAILED':
                message = 'Failed to extend session. Please login again.';
                icon = '❌';
                break;
            default:
                message = 'Your session has ended. Please login again.';
                icon = '🔒';
        }

        toast.info(
            <div className="flex flex-col">
                <span className="font-semibold">{icon} Session Ended</span>
                <span className="text-sm opacity-80">{message}</span>
            </div>,
            {
                duration: 5000,
                position: 'top-center'
            }
        );

        // Call parent logout handler if exists
        if (onLogout) {
            onLogout();
        }

        if (location.pathname !== '/' && location.pathname !== '/') {
            navigate('/login', { replace: true });
        }
    };

    // TRACK USER ACTIVITY
    const updateActivity = () => {
        const previousActivity = lastActivityRef.current;
        lastActivityRef.current = Date.now();

        // Log significant activity (more than 1 minute since last activity)
        if (Date.now() - previousActivity > 60000) {
            console.log('SessionManager: User activity detected - resetting idle timer');
        }
    };

    // SETUP EVENT LISTENERS & TIMERS
    useEffect(() => {
        const user = getUser();

        // Jangan setup SessionManager jika tidak ada user
        if (!user) {
            console.log('SessionManager: No user found, not initializing');
            return;
        }

        // Jangan setup SessionManager di halaman login
        if (location.pathname === '/') {
            console.log('SessionManager: On login page, not initializing');
            return;
        }

        console.log('SessionManager: Initialized for user:', user.username);
        console.log('SessionManager: Session timeout: 5 hours');
        console.log('SessionManager: Idle timeout: 5 hours');
        console.log('SessionManager: Warning time: 5 minutes before expiry');

        // Activity events to track
        const activityEvents = [
            'mousedown',
            'mousemove',
            'keypress',
            'keydown',
            'scroll',
            'touchstart',
            'click',
            'focus'
        ];

        // Add activity listeners
        activityEvents.forEach(event => {
            window.addEventListener(event, updateActivity, { passive: true });
        });

        // Initial check
        checkSession();
        checkIdleTime();

        // Start periodic checking
        checkIntervalRef.current = setInterval(() => {
            checkSession();
            checkIdleTime();
        }, CHECK_INTERVAL);

        // Cleanup function
        return () => {
            console.log('SessionManager: Cleanup');

            // Remove event listeners
            activityEvents.forEach(event => {
                window.removeEventListener(event, updateActivity);
            });

            // Clear timers
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
                checkIntervalRef.current = null;
            }

            // Dismiss warning toast
            toast.dismiss('session-warning');
        };
    }, [location.pathname]);

    // HANDLE VISIBILITY CHANGE
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                const user = getUser();
                if (user && location.pathname !== '/') {
                    console.log('SessionManager: Page visible - checking session');
                    checkSession();
                    checkIdleTime();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [location.pathname]);

    // RENDER
    return (
        <>
            {children}

            {/* Optional: Session Status Indicator */}
            {showWarning && (
                <div className="fixed bottom-20 right-4 bg-yellow-500 dark:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-2xl z-[9999] animate-pulse border-2 border-yellow-600 dark:border-yellow-400">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl">⚠️</span>
                        <span className="font-semibold text-sm">
                            Session expiring soon!
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

export default SessionManager;