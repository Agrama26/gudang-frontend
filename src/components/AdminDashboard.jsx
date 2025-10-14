import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminUserAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { useDarkMode } from '../contexts/DarkModeContext';
import DarkModeToggle from './DarkModeToggle';
import logo from '../assets/logo.png';

const AdminDashboard = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const { isDarkMode } = useDarkMode();
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [activityLogs, setActivityLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'staff',
        full_name: '',
        email: '',
        is_active: true
    });

    const [scrollY, setScrollY] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

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

    // Check if user is admin
    useEffect(() => {
        if (user?.role !== 'admin') {
            toast.error('Access denied. Admin privileges required.');
            navigate('/dashboard');
        }
    }, [user, navigate]);

    // Fetch data
    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'users') {
                const usersData = await adminUserAPI.getAllUsers();
                setUsers(usersData);
            } else if (activeTab === 'statistics') {
                const statsData = await adminUserAPI.getStatistics();
                setStatistics(statsData);
            } else if (activeTab === 'activity') {
                const logsData = await adminUserAPI.getActivityLogs(50, 0);
                setActivityLogs(logsData.logs);
            }
        } catch (error) {
            toast.error(`Failed to load ${activeTab} data`);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = () => {
        setEditingUser(null);
        setFormData({
            username: '',
            password: '',
            role: 'staff',
            full_name: '',
            email: '',
            is_active: true
        });
        setShowUserModal(true);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            password: '',
            role: user.role,
            full_name: user.full_name || '',
            email: user.email || '',
            is_active: user.is_active
        });
        setShowUserModal(true);
    };

    const handleSubmitUser = async (e) => {
        e.preventDefault();

        console.log('📝 Form Data:', {
            username: formData.username,
            email: formData.email,
            role: formData.role,
            sendEmail: emailSettings.sendWelcomeEmail
        });

        // Validasi email jika checkbox send email dicentang
        if (emailSettings.sendWelcomeEmail && !formData.email) {
            toast.error('Email address is required to send welcome email!', {
                icon: '⚠️',
                duration: 4000
            });
            return;
        }

        try {
            const submitData = {
                ...formData,
                send_welcome_email: emailSettings.sendWelcomeEmail && !!formData.email
            };

            if (editingUser) {
                await adminUserAPI.updateUser(editingUser.id, submitData);
                toast.success(
                    <div>
                        <div className="font-semibold">User updated successfully!</div>
                        <div className="text-xs">User: {formData.username}</div>
                    </div>
                );
            } else {
                const result = await adminUserAPI.createUser(submitData);

                // Show success with email status
                if (result.emailSent) {
                    toast.success(
                        <div>
                            <div className="font-semibold">✅ User created successfully!</div>
                            <div className="text-xs">📧 Welcome email sent to {formData.email}</div>
                        </div>,
                        { duration: 5000 }
                    );
                } else {
                    toast.success(
                        <div>
                            <div className="font-semibold">✅ User created successfully!</div>
                            <div className="text-xs">⚠️ No email sent (no email address provided)</div>
                        </div>,
                        { duration: 5000 }
                    );
                }
            }

            setShowUserModal(false);
            fetchData();
        } catch (error) {
            toast.error(error.message || 'Failed to save user');
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) {
            return;
        }

        try {
            await adminUserAPI.deleteUser(userId);
            toast.success(`User ${username} deleted successfully`);
            fetchData();
        } catch (error) {
            toast.error(error.message || 'Failed to delete user');
        }
    };

    const handleToggleUserStatus = async (userId, currentStatus) => {
        try {
            await adminUserAPI.updateUser(userId, { is_active: !currentStatus });
            toast.success(`User status updated`);
            fetchData();
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    // 1. Add state untuk email status
    const [emailSettings, setEmailSettings] = useState({
        enabled: true,
        sendWelcomeEmail: true
    });

    // Style classes
    const containerClass = isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-teal-50 to-blue-50';
    const headerClass = isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-teal-200';
    const cardClass = isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-teal-100';
    const textPrimaryClass = isDarkMode ? 'text-teal-400' : 'text-teal-600';
    const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';

    return (
        <div className={'min-h-screen transition-all duration-300 ' + containerClass}>
            {/* Header */}
            <div className={'fixed top-0 w-full z-50 backdrop-blur-xl border-b shadow-lg transition-all duration-300 ' + headerClass}>
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <img src={logo} alt="Logo" className="w-32 md:w-30 lg:w-40 object-contain drop-shadow-lg filter invert dark:invert-0" />
                            <div>
                                <h1 className={'text-2xl font-bold ' + textPrimaryClass}>Admin Dashboard</h1>
                                <p className={'text-sm ' + textSecondaryClass}>System Management Panel</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <DarkModeToggle />
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-teal-600 dark:bg-teal-700 text-white px-4 py-2 rounded-xl font-semibold hover:bg-teal-700 dark:hover:bg-teal-600 transition-all duration-300"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 pt-28 pb-8">
                {/* Tabs */}
                <div className={'backdrop-blur-md rounded-2xl border shadow-xl mb-8 overflow-hidden ' + cardClass}>
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        {['users', 'statistics', 'activity'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 px-6 py-4 font-semibold capitalize transition-all duration-300 ${activeTab === tab
                                    ? 'bg-teal-600 dark:bg-teal-700 text-white'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {tab === 'users' && ' '}
                                {tab === 'statistics' && ' '}
                                {tab === 'activity' && ' '}
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 border-4 border-teal-600 dark:border-teal-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className={'mt-4 ' + textSecondaryClass}>Loading...</p>
                    </div>
                ) : (
                    <>
                        {/* Users Tab */}
                        {activeTab === 'users' && (
                            <div className={'backdrop-blur-md rounded-2xl border shadow-xl p-8 ' + cardClass}>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className={'text-2xl font-bold ' + textPrimaryClass}>User Management</h2>
                                    <button
                                        onClick={handleCreateUser}
                                        className="bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-500 dark:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105"
                                    >
                                        Add New User
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Username</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Full Name</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Role</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Last Login</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {users.map((u) => (
                                                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">{u.username}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{u.full_name || '-'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{u.email || '-'}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 text-xs font-bold rounded-xl ${u.role === 'admin'
                                                            ? 'bg-purple-500 text-white'
                                                            : 'bg-blue-500 text-white'
                                                            }`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => handleToggleUserStatus(u.id, u.is_active)}
                                                            disabled={u.id === user.id}
                                                            className={`px-3 py-1 text-xs font-bold rounded-xl transition-all duration-300 ${u.is_active
                                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                                : 'bg-red-500 text-white hover:bg-red-600'
                                                                } ${u.id === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            {u.is_active ? 'Active' : 'Inactive'}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                        {u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleEditUser(u)}
                                                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
                                                            >
                                                                Edit
                                                            </button>
                                                            {u.id !== user.id && (
                                                                <button
                                                                    onClick={() => handleDeleteUser(u.id, u.username)}
                                                                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold"
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Statistics Tab */}
                        {activeTab === 'statistics' && statistics && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div className={'backdrop-blur-md rounded-2xl border shadow-xl p-8 ' + cardClass}>
                                    <h3 className={'text-xl font-bold mb-4 ' + textPrimaryClass}>Users Overview</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className={textSecondaryClass}>Total Users:</span>
                                            <span className="font-bold text-gray-800 dark:text-gray-200">{statistics.users.total_users}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={textSecondaryClass}>Admins:</span>
                                            <span className="font-bold text-purple-600 dark:text-purple-400">{statistics.users.admin_count}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={textSecondaryClass}>Staff:</span>
                                            <span className="font-bold text-blue-600 dark:text-blue-400">{statistics.users.staff_count}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={textSecondaryClass}>Active:</span>
                                            <span className="font-bold text-green-600 dark:text-green-400">{statistics.users.active_users}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={'backdrop-blur-md rounded-2xl border shadow-xl p-8 ' + cardClass}>
                                    <h3 className={'text-xl font-bold mb-4 ' + textPrimaryClass}>Inventory Overview</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className={textSecondaryClass}>Total Items :</span>
                                            <span className="font-bold text-gray-800 dark:text-gray-200">{statistics.barang.total_barang}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={textSecondaryClass}>Ready :</span>
                                            <span className="font-bold text-green-600 dark:text-green-400">{statistics.barang.ready_count}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={textSecondaryClass}>In Use :</span>
                                            <span className="font-bold text-blue-600 dark:text-blue-400">{statistics.barang.terpakai_count}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={textSecondaryClass}>Damaged :</span>
                                            <span className="font-bold text-red-600 dark:text-red-400">{statistics.barang.rusak_count}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={'backdrop-blur-md rounded-2xl border shadow-xl p-8 ' + cardClass}>
                                    <h3 className={'text-xl font-bold mb-4 ' + textPrimaryClass}>Activity Today</h3>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                                            {statistics.activity.today_activities}
                                        </div>
                                        <p className={textSecondaryClass}>Total Activities</p>
                                    </div>
                                </div>

                                <div className="md:col-span-2 lg:col-span-3">
                                    <div className="backdrop-blur-md rounded-2xl border shadow-xl p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
                                        <h3 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-400">
                                            Email System Status
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Email Service:</span>
                                                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">
                                                    ✓ Configured
                                                </span>
                                            </div>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const result = await adminUserAPI.testEmailConnection();
                                                        if (result.success) {
                                                            toast.success('✅ Email connection successful!');
                                                        } else {
                                                            toast.error('❌ Email connection failed: ' + result.message);
                                                        }
                                                    } catch (error) {
                                                        toast.error('❌ Email test failed');
                                                    }
                                                }}
                                                className="w-full bg-purple-600 dark:bg-purple-700 text-white px-4 py-3 rounded-xl font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition-all duration-300"
                                            >
                                                Test Email Connection
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Activity Logs Tab */}
                        {activeTab === 'activity' && (
                            <div className={'backdrop-blur-md rounded-2xl border shadow-xl p-8 ' + cardClass}>
                                <h2 className={'text-2xl font-bold mb-6 ' + textPrimaryClass}>Activity Logs</h2>
                                <div className="space-y-4">
                                    {activityLogs.map((log) => (
                                        <div key={log.id} className="border-l-4 border-teal-600 dark:border-teal-400 pl-4 py-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                                                        {log.username || 'System'} - {log.action}
                                                    </p>
                                                    <p className={'text-sm ' + textSecondaryClass}>{log.details || 'No details'}</p>
                                                    <p className={'text-xs ' + textSecondaryClass}>
                                                        IP: {log.ip_address || 'N/A'}
                                                    </p>
                                                </div>
                                                <span className={'text-sm ' + textSecondaryClass}>
                                                    {new Date(log.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* User Modal */}
            {showUserModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className={'rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 ' + cardClass}>
                        <h3 className={'text-2xl font-bold mb-6 ' + textPrimaryClass}>
                            {editingUser ? 'Edit User' : 'Create New User'}
                        </h3>
                        <form onSubmit={handleSubmitUser} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className={'block text-sm font-semibold mb-2 ' + textPrimaryClass}>Username *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className={'block text-sm font-semibold mb-2 ' + textPrimaryClass}>
                                        Password {editingUser && '(leave empty to keep current)'}
                                    </label>
                                    <input
                                        type="password"
                                        required={!editingUser}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className={'block text-sm font-semibold mb-2 ' + textPrimaryClass}>Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className={'block text-sm font-semibold mb-2 ' + textPrimaryClass}>
                                        Email {emailSettings.sendWelcomeEmail && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required={emailSettings.sendWelcomeEmail} 
                                        className={'w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white'}
                                        placeholder="user@company.com"
                                    />
                                    {emailSettings.sendWelcomeEmail && !formData.email && (
                                        <p className="text-xs text-red-500 mt-1">Email is required to send welcome notification</p>
                                    )}
                                </div>

                                <div className="md:col-span-2 space-y-3">
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <h4 className="text-sm font-semibold text-teal-700 dark:text-teal-400 mb-3">
                                            Email Notifications
                                        </h4>

                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={emailSettings.sendWelcomeEmail}
                                                onChange={(e) => setEmailSettings({
                                                    ...emailSettings,
                                                    sendWelcomeEmail: e.target.checked
                                                })}
                                                className="w-5 h-5 text-teal-600 border-gray-300 dark:border-gray-600 rounded focus:ring-teal-500 focus:ring-2"
                                            />
                                            <div>
                                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    Send welcome email to new user
                                                </span>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    User will receive login credentials and instructions via email
                                                </p>
                                            </div>
                                        </label>
                                    </div>

                                    {!formData.email && emailSettings.sendWelcomeEmail && (
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                                            <div className="flex items-start space-x-2">
                                                <span className="text-yellow-600 dark:text-yellow-400 text-lg">⚠️</span>
                                                <div>
                                                    <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-300">
                                                        Email address required
                                                    </p>
                                                    <p className="text-xs text-yellow-700 dark:text-yellow-400">
                                                        Please provide an email address to send welcome notification
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className={'block text-sm font-semibold mb-2 ' + textPrimaryClass}>Role *</label>
                                    <select
                                        required
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white"
                                    >
                                        <option value="staff">Staff</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={'block text-sm font-semibold mb-2 ' + textPrimaryClass}>Status</label>
                                    <select
                                        value={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                                        className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white"
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-500 dark:to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                                >
                                    {editingUser ? 'Update User' : 'Create User'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowUserModal(false)}
                                    className="flex-1 bg-gray-500 dark:bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 dark:hover:bg-gray-700 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
    );
};



export default AdminDashboard;