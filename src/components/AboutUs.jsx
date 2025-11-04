import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useLanguage } from '../contexts/LanguageContext';
import DarkModeToggle from './DarkModeToggle';
import LanguageToggle from './LanguageToggle';
import logo from '../assets/logo.png';

const About = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useDarkMode();
    const { t, isIndonesian } = useLanguage();
    const [scrollY, setScrollY] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollY(currentScrollY);
            setIsScrolled(currentScrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCopyEmail = (email) => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    const teamMembers = [
        {
            name: 'Agrama Hutabarat',
            role: { en: 'Lead Developer & System Architect', id: 'Lead Developer & Arsitek Sistem' },
            description: {
                en: 'Responsible for full-stack development, system architecture, and technical implementation of the warehouse management system.',
                id: 'Bertanggung jawab atas pengembangan full-stack, arsitektur sistem, dan implementasi teknis sistem manajemen gudang.'
            },
            email: 'agrama@medianusapermana.com',
            github: 'agrama26',
            linkedin: 'agrama-hutabarat',
            skills: ['React.js', 'Node.js', 'MySQL', 'Express.js', 'TailwindCSS']
        },
        {
            name: 'PT Medianusa Permana',
            role: { en: 'Company Administrator', id: 'Administrator Perusahaan' },
            description: {
                en: 'Main contact for account requests, technical support, and general inquiries about the warehouse management system.',
                id: 'Kontak utama untuk permintaan akun, dukungan teknis, dan pertanyaan umum tentang sistem manajemen gudang.'
            },
            email: 'admin@medianusapermana.com',
            phone: '+62 812-3456-7890',
            isAdmin: true
        }
    ];

    const features = [
        {
            title: { en: 'Secure Authentication', id: 'Autentikasi Aman' },
            description: { en: 'JWT-based authentication with encrypted passwords', id: 'Autentikasi berbasis JWT dengan password terenkripsi' }
        },
        {
            title: { en: 'Real-time Analytics', id: 'Analitik Real-time' },
            description: { en: 'Live inventory tracking across 5 branches', id: 'Pelacakan inventori langsung di 5 cabang' }
        },
        {
            title: { en: 'Barcode Scanner', id: 'Scanner Barcode' },
            description: { en: 'Fast item input with hardware barcode scanner', id: 'Input cepat dengan scanner barcode hardware' }
        },
        {
            title: { en: 'Dark Mode', id: 'Mode Gelap' },
            description: { en: 'Eye-friendly interface for day and night', id: 'Antarmuka ramah mata untuk siang dan malam' }
        },
        {
            title: { en: 'Multi-language', id: 'Multi-bahasa' },
            description: { en: 'Available in English and Indonesian', id: 'Tersedia dalam Bahasa Inggris dan Indonesia' }
        },
        {
            title: { en: 'Import/Export', id: 'Import/Ekspor' },
            description: { en: 'Excel integration for bulk operations', id: 'Integrasi Excel untuk operasi massal' }
        }
    ];

    const techStack = {
        frontend: ['React.js 18', 'TailwindCSS', 'React Router', 'Chart.js', 'React Toastify'],
        backend: ['Node.js', 'Express.js', 'MySQL', 'JWT Authentication', 'Bcrypt.js']
    };

    const containerClass = isDarkMode
        ? 'bg-gradient-to-br from-gray-900 to-gray-800'
        : 'bg-gradient-to-br from-slate-50 to-blue-50';

    const cardClass = isDarkMode
        ? 'bg-gray-800/60 backdrop-blur-lg border border-gray-700'
        : 'bg-white/80 backdrop-blur-lg border border-gray-200';

    const textPrimaryClass = isDarkMode ? 'text-white' : 'text-gray-900';
    const textSecondaryClass = isDarkMode ? 'text-gray-300' : 'text-gray-600';
    const accentClass = isDarkMode ? 'text-cyan-400' : 'text-cyan-600';

    return (
        <div className={'min-h-screen transition-all duration-300 ' + containerClass}>
            {/* Geometric Background Pattern */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
                <div className="absolute inset-0 bg-grid-slate-400 dark:bg-grid-slate-600"></div>
            </div>

            {/* Header */}
            <div className={'fixed top-0 w-full z-50 backdrop-blur-xl border-b transition-all duration-300 ' +
                (isDarkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200')}>
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <img src={logo} alt="Logo" className="w-32 md:w-30 lg:w-40 object-contain" />
                            <div className="border-l pl-4 border-gray-300 dark:border-gray-600">
                                <h1 className={'text-xl font-semibold ' + textPrimaryClass}>
                                    {isIndonesian ? 'Tentang Sistem' : 'About System'}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <LanguageToggle />
                            <DarkModeToggle />
                            <button
                                onClick={() => navigate('/')}
                                className={'px-6 py-2 rounded-lg font-medium transition-all duration-300 ' +
                                    (isDarkMode
                                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300')}
                            >
                                {isIndonesian ? 'Kembali' : 'Back'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-6 pt-28 pb-8">
                {/* Hero Section */}
                <div className={'rounded-2xl p-8 mb-12 text-center relative overflow-hidden ' + cardClass}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                    <div className="max-w-3xl mx-auto">
                        <h1 className={'text-4xl font-bold mb-6 ' + textPrimaryClass}>
                            {isIndonesian ? 'Sistem Manajemen Gudang' : 'Warehouse Management System'}
                        </h1>
                        <p className={'text-lg mb-4 font-medium ' + accentClass}>
                            PT Medianusa Permana
                        </p>
                        <p className={'text-lg leading-relaxed ' + textSecondaryClass}>
                            {isIndonesian
                                ? 'Solusi digital modern untuk mengelola inventori peralatan jaringan di 5 cabang kami. Dibangun dengan teknologi terkini untuk efisiensi maksimal dan keamanan data terjamin.'
                                : 'Modern digital solution for managing network equipment inventory across our 5 branches. Built with cutting-edge technology for maximum efficiency and guaranteed data security.'}
                        </p>
                    </div>
                </div>

                {/* System Features Grid */}
                <div className="mb-12">
                    <h2 className={'text-3xl font-bold mb-8 text-center ' + textPrimaryClass}>
                        {isIndonesian ? 'Fitur Utama' : 'Key Features'}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={'p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105 group ' + cardClass}
                            >
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 mb-4 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <h3 className={'text-lg font-semibold mb-3 group-hover:' + accentClass + ' ' + textPrimaryClass}>
                                    {isIndonesian ? feature.title.id : feature.title.en}
                                </h3>
                                <p className={'text-sm leading-relaxed ' + textSecondaryClass}>
                                    {isIndonesian ? feature.description.id : feature.description.en}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team & Contact */}
                <div className={'rounded-2xl p-8 mb-12 ' + cardClass}>
                    <h2 className={'text-3xl font-bold mb-8 text-center ' + textPrimaryClass}>
                        {isIndonesian ? 'Tim Pengembang' : 'Development Team'}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className={'p-6 rounded-xl transition-all duration-300 hover:shadow-lg ' +
                                    (isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50')}
                            >
                                <div className="flex items-start space-x-4 mb-4">
                                    <div className={'w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold ' +
                                        (member.isAdmin
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                            : 'bg-gradient-to-r from-cyan-500 to-blue-500')}>
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h3 className={'text-lg font-semibold ' + textPrimaryClass}>{member.name}</h3>
                                            {member.isAdmin && (
                                                <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded">
                                                    {isIndonesian ? 'ADMIN' : 'ADMIN'}
                                                </span>
                                            )}
                                        </div>
                                        <p className={'text-sm font-medium mb-2 ' + accentClass}>
                                            {isIndonesian ? member.role.id : member.role.en}
                                        </p>
                                    </div>
                                </div>

                                <p className={'text-sm mb-6 leading-relaxed ' + textSecondaryClass}>
                                    {isIndonesian ? member.description.id : member.description.en}
                                </p>

                                {/* Contact Info */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <span className="text-sm">@</span>
                                            </div>
                                            <span className={'text-sm font-mono ' + textSecondaryClass}>
                                                {member.email}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleCopyEmail(member.email)}
                                            className={'px-3 py-1 rounded text-xs font-medium transition-all duration-300 ' +
                                                (isDarkMode
                                                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                                                    : 'bg-cyan-500 hover:bg-cyan-600 text-white')}
                                        >
                                            {copiedEmail ? '✓' : 'Copy'}
                                        </button>
                                    </div>

                                    {member.phone && (
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <span className="text-sm">📞</span>
                                            </div>
                                            <span className={'text-sm font-mono ' + textSecondaryClass}>
                                                {member.phone}
                                            </span>
                                        </div>
                                    )}

                                    {member.skills && (
                                        <div className="pt-4">
                                            <p className={'text-xs font-semibold mb-2 uppercase tracking-wide ' + textSecondaryClass}>
                                                {isIndonesian ? 'Keahlian Teknis' : 'Technical Skills'}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {member.skills.map((skill, i) => (
                                                    <span
                                                        key={i}
                                                        className={'px-3 py-1 text-xs rounded-full font-medium ' +
                                                            (isDarkMode
                                                                ? 'bg-cyan-900/30 text-cyan-300 border border-cyan-700'
                                                                : 'bg-cyan-100 text-cyan-700 border border-cyan-300')}
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {(member.github || member.linkedin) && (
                                        <div className="flex space-x-3 pt-4">
                                            {member.github && (
                                                <a
                                                    href={`https://github.com/Agrama26`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={'flex-1 py-2 rounded-lg text-center text-sm font-medium transition-all duration-300 ' +
                                                        (isDarkMode
                                                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700')}
                                                >
                                                    GitHub
                                                </a>
                                            )}
                                            {member.linkedin && (
                                                <a
                                                    href={`https://linkedin.com/in/agung-ramadhan-setiawan-ss/${member.linkedin}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={'flex-1 py-2 rounded-lg text-center text-sm font-medium transition-all duration-300 ' +
                                                        (isDarkMode
                                                            ? 'bg-blue-700 hover:bg-blue-600 text-white'
                                                            : 'bg-blue-500 hover:bg-blue-600 text-white')}
                                                >
                                                    LinkedIn
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Technology Stack */}
                <div className={'rounded-2xl p-8 mb-12 ' + cardClass}>
                    <h2 className={'text-3xl font-bold mb-8 text-center ' + textPrimaryClass}>
                        {isIndonesian ? 'Teknologi' : 'Technology'}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className={'text-xl font-semibold mb-4 pb-2 border-b ' +
                                (isDarkMode ? 'border-gray-600' : 'border-gray-300')}>
                                Frontend
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {techStack.frontend.map((tech, index) => (
                                    <div key={index} className={'p-3 rounded-lg text-sm font-medium ' +
                                        (isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100')}>
                                        {tech}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className={'text-xl font-semibold mb-4 pb-2 border-b ' +
                                (isDarkMode ? 'border-gray-600' : 'border-gray-300')}>
                                Backend
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {techStack.backend.map((tech, index) => (
                                    <div key={index} className={'p-3 rounded-lg text-sm font-medium ' +
                                        (isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100')}>
                                        {tech}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Request CTA */}
                <div className={'rounded-2xl p-8 mb-12 text-center relative overflow-hidden ' +
                    (isDarkMode
                        ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/30'
                        : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200')}>

                    <div className="max-w-2xl mx-auto">
                        <h3 className={'text-2xl font-bold mb-4 ' + textPrimaryClass}>
                            {isIndonesian ? 'Butuh Akses Sistem?' : 'Need System Access?'}
                        </h3>
                        <p className={'text-lg mb-6 ' + textSecondaryClass}>
                            {isIndonesian
                                ? 'Hubungi administrator untuk membuat akun baru'
                                : 'Contact administrator to create a new account'}
                        </p>
                        <a
                            href="mailto:admin@medianusapermana.com?subject=Request%20Account&body=Name:%0D%0APosition:%0D%0ABranch:%0D%0AEmail:%0D%0APhone:"
                            className={'inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ' +
                                (isDarkMode
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                    : 'bg-purple-500 hover:bg-purple-600 text-white')}
                        >
                            {isIndonesian ? 'Request Akun' : 'Request Account'}
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-8 border-t border-gray-300 dark:border-gray-700">
                    <p className={'text-sm ' + textSecondaryClass}>
                        © 2025 PT Medianusa Permana. {isIndonesian ? 'Hak cipta dilindungi.' : 'All rights reserved.'}
                    </p>
                    <p className={'text-xs mt-2 ' + textSecondaryClass}>
                        {isIndonesian
                            ? 'Dikembangkan oleh Agrama Hutabarat'
                            : 'Developed by Agrama Hutabarat'}
                    </p>
                </div>
            </div>

            {/* Scroll to Top Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed right-6 bottom-6 z-50 p-3 rounded-full transition-all duration-500 transform ${isDarkMode ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-cyan-500 hover:bg-cyan-600'
                    } text-white shadow-lg ${isScrolled
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-10 scale-0 pointer-events-none'
                    }`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>
        </div>
    );
};

export default About;