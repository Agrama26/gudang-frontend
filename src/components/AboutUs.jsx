import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useLanguage } from '../contexts/LanguageContext';
import DarkModeToggle from './DarkModeToggle';
import LanguageToggle from './LanguageToggle';
import logo from '../assets/logo.png';
import Footer from './Footer';
import agung from '../assets/agung.jpg';

const AboutUs = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useDarkMode();
    const { t, isIndonesian } = useLanguage();
    const [scrollY, setScrollY] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [copiedPhone, setCopiedPhone] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollY(currentScrollY);
            setIsScrolled(currentScrollY > 50);
        };

        // Trigger entrance animation
        setIsVisible(true);

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        if (type === 'email') {
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2000);
        } else {
            setCopiedPhone(true);
            setTimeout(() => setCopiedPhone(false), 2000);
        }
    };

    // Data konten
    const companyInfo = {
        name: 'PT. Medianusa Permana',
        description: {
            en: 'PT. Medianusa Permana is a company engaged in network services with 5 branches in Indonesia: Medan, Batam, Pekan Baru, Tarutung, and Jakarta. We manage network equipment inventory such as Mikrotik and TP-Link with modern and efficient digital systems.',
            id: 'PT. Medianusa Permana adalah perusahaan yang bergerak di bidang pelayanan jaringan dengan 5 cabang di Indonesia: Medan, Batam, Pekan Baru, Tarutung, dan Jakarta. Kami mengelola inventori peralatan jaringan seperti Mikrotik dan TP-Link dengan sistem digital yang modern dan efisien.'
        },
        vision: {
            en: 'To become a leading provider of network solutions in Indonesia, delivering excellence in service and innovation.',
            id: 'Menjadi penyedia solusi jaringan terkemuka di Indonesia, menghadirkan keunggulan dalam layanan dan inovasi.'
        },
        mission: [
            {
                en: 'Provide reliable and efficient network infrastructure solutions',
                id: 'Menyediakan solusi infrastruktur jaringan yang handal dan efisien'
            },
            {
                en: 'Maintain high-quality service standards across all branches',
                id: 'Mempertahankan standar layanan berkualitas tinggi di semua cabang'
            },
            {
                en: 'Continuously innovate in inventory management systems',
                id: 'Terus berinovasi dalam sistem manajemen inventori'
            }
        ]
    };

    const teamMembers = [
        {
            id: 1,
            name: 'Agung Ramadhan Setiawan',
            role: {
                en: 'Lead Developer & System Architect',
                id: 'Lead Developer & Arsitek Sistem'
            },
            description: {
                en: 'Responsible for full-stack development, system architecture, and technical implementation of the warehouse management system. Specialized in React.js, Node.js, and MySQL database design.',
                id: 'Bertanggung jawab atas pengembangan full-stack, arsitektur sistem, dan implementasi teknis sistem manajemen gudang. Spesialisasi dalam React.js, Node.js, dan desain database MySQL.'
            },
            skills: ['React.js', 'Node.js', 'MySQL', 'Express.js', 'TailwindCSS', 'JWT Auth', 'REST API', 'Git'],
            github: 'https://github.com/Agrama26',
            linkedin: 'https://linkedin.com/in/agung-ramadhan-setiawan-ss',
            imagePosition: 'left'
        },
        {
            id: 2,
            name: 'Admin PT. Medianusa Permana',
            role: {
                en: 'Company Administrator & Support',
                id: 'Administrator Perusahaan & Dukungan'
            },
            description: {
                en: 'Main contact for account requests, technical support, and general inquiries about the warehouse management system. Available for assistance with user management and system access.',
                id: 'Kontak utama untuk permintaan akun, dukungan teknis, dan pertanyaan umum tentang sistem manajemen gudang. Tersedia untuk bantuan manajemen pengguna dan akses sistem.'
            },
            skills: ['User Management', 'Technical Support', 'System Administration', 'Customer Service'],
            email: 'premiumbangai@gmail.com',
            phone: '+62 845 6789 1290',
            imagePosition: 'right'
        }
    ];

    const containerClass = isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-teal-50 via-blue-50 to-teal-50';

    const cardClass = isDarkMode
        ? 'bg-gray-800/90 backdrop-blur-lg border border-gray-700 shadow-2xl'
        : 'bg-white/90 backdrop-blur-lg border border-teal-100 shadow-2xl';

    const textPrimaryClass = isDarkMode ? 'text-white' : 'text-gray-900';
    const textSecondaryClass = isDarkMode ? 'text-gray-300' : 'text-gray-600';
    const accentClass = isDarkMode ? 'text-teal-400' : 'text-teal-600';

    return (
        <div className={'min-h-screen transition-all duration-500 ' + containerClass}>
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={'absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float ' + (isDarkMode ? 'bg-teal-800' : 'bg-teal-200')}></div>
                <div className={'absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed ' + (isDarkMode ? 'bg-blue-800' : 'bg-blue-200')}></div>
                <div className={'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse ' + (isDarkMode ? 'bg-purple-800' : 'bg-purple-200')}></div>
            </div>

            {/* Header */}
            <div className={'fixed top-0 w-full z-50 backdrop-blur-xl border-b shadow-2xl transition-all duration-500 ' +
                (isDarkMode ? 'bg-gray-900/90 border-gray-700' : 'bg-white/90 border-teal-200') +
                (isVisible ? ' translate-y-0 opacity-100' : ' -translate-y-4 opacity-0')}>
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-32 md:w-30 lg:w-40 object-contain drop-shadow-lg filter invert dark:invert-0 transition-transform duration-300 hover:scale-105"
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <LanguageToggle />
                            <DarkModeToggle />
                            <button
                                onClick={() => navigate('/')}
                                className={'px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ' +
                                    (isDarkMode
                                        ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700'
                                        : 'bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600')}
                            >
                                {t('home')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-6 pt-60 pb-16">
                {/* Hero Section - Company Logo & Name */}
                <div className={`text-center mb-20 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="relative inline-block mb-8">
                        {/* Animated Circles */}
                        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
                            <div className={'w-96 h-96 rounded-full border-4 opacity-20 ' + (isDarkMode ? 'border-teal-400' : 'border-teal-600')}></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow-reverse">
                            <div className={'w-80 h-80 rounded-full border-4 opacity-30 ' + (isDarkMode ? 'border-teal-400' : 'border-teal-600')}></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
                            <div className={'w-64 h-64 rounded-full border-4 opacity-40 ' + (isDarkMode ? 'border-teal-400' : 'border-teal-600')}></div>
                        </div>

                        {/* Center Logo/Icon */}
                        <div className={'relative z-10 w-48 h-48 mx-auto rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-500 hover:scale-110 ' +
                            (isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-gray-200 to-gray-300')}>
                            <div className="text-center">
                                <svg className={'w-20 h-20 mx-auto mb-2 transition-all duration-300 hover:scale-110 ' + (isDarkMode ? 'text-teal-400' : 'text-teal-600')} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                                </svg>
                                <h1 className={'text-2xl font-bold ' + (isDarkMode ? 'text-white' : 'text-gray-800')}>
                                    {companyInfo.name}
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Scroll Down Indicator */}
                    <div className="animate-bounce mt-12">
                        <svg className={'w-8 h-8 mx-auto transition-all duration-300 hover:scale-110 ' + (isDarkMode ? 'text-teal-400' : 'text-teal-600')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>

                {/* Company Info Section */}
                <div className={`rounded-3xl p-10 mb-20 shadow-2xl transform transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${cardClass}`}>
                    <h2 className={'text-4xl font-bold mb-8 text-center ' + accentClass}>
                        {t('aboutCompany')}
                    </h2>

                    <div className="max-w-6xl mx-auto space-y-8">
                        <p className={'text-xl leading-relaxed text-center ' + textPrimaryClass + ' font-light'}>
                            {isIndonesian ? companyInfo.description.id : companyInfo.description.en}
                        </p>

                        {/* Vision & Mission */}
                        <div className="grid lg:grid-cols-2 gap-12 mt-16">
                            {/* Vision */}
                            <div className={`transform transition-all duration-500 hover:scale-105 p-8 rounded-2xl ${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-teal-50 to-blue-50'} shadow-lg`}>
                                <div className="text-center mb-2">
                                    <div className={'w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ' + (isDarkMode ? 'bg-teal-900/50' : 'bg-teal-100')}>
                                        <svg className={'w-8 h-8 ' + accentClass} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
                                        </svg>
                                    </div>
                                </div>
                                <h3 className={'text-2xl font-bold mb-6 text-center ' + accentClass}>
                                    {isIndonesian ? 'Visi' : 'Vision'}
                                </h3>
                                <p className={'text-lg leading-relaxed text-left font-medium ' + textSecondaryClass}>
                                    {isIndonesian ? companyInfo.vision.id : companyInfo.vision.en}
                                </p>
                            </div>

                            {/* Mission */}
                            <div className={`transform transition-all duration-500 hover:scale-105 p-8 rounded-2xl ${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-teal-50 to-blue-50'} shadow-lg`}>
                                <div className="text-center mb-2">
                                    <div className={'w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ' + (isDarkMode ? 'bg-teal-900/50' : 'bg-teal-100')}>
                                        <svg className={'w-8 h-8 ' + accentClass} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <h3 className={'text-2xl font-bold mb-6 text-center ' + accentClass}>
                                    {isIndonesian ? 'Misi' : 'Mission'}
                                </h3>
                                <ul className="space-y-4">
                                    {companyInfo.mission.map((item, index) => (
                                        <li key={index} className={'text-lg text-left leading-relaxed flex items-start group transition-all duration-300 hover:translate-x-2 ' + textSecondaryClass}>
                                            <span className={'mr-4 mt-2 text-xl transition-transform duration-300 group-hover:scale-125 ' + accentClass}>•</span>
                                            <span className="font-medium">{isIndonesian ? item.id : item.en}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Development Team Section */}
                <div className="mb-20">
                    <h2 className={`text-4xl font-bold mb-16 text-center transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${textPrimaryClass}`}>
                        {isIndonesian ? 'Tim Pengembang' : 'Development Team'}
                    </h2>

                    <div className="space-y-20 max-w-7xl mx-auto">
                        {teamMembers.map((member, index) => (
                            <div
                                key={member.id}
                                className={`transform transition-all duration-700 delay-${500 + index * 200} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} rounded-3xl p-8 shadow-2xl ${cardClass}`}
                            >
                                <div className={`flex flex-col lg:flex-row items-center gap-8 ${member.imagePosition === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                                    {/* Profile Image */}
                                    <div className="lg:w-2/5 flex justify-center">
                                        <div className="relative">
                                            <div className={`w-64 h-64 rounded-2xl flex items-center justify-center shadow-2xl transform transition-all duration-500 hover:scale-105 ${member.id === 1
                                                ? 'bg-gradient-to-br from-teal-500 to-blue-500'
                                                : 'bg-gradient-to-br from-purple-500 to-pink-500'
                                                }`}>
                                                {member.id === 1 ? (
                                                    <img src={agung} alt={member.name} className="w-60 h-60 object-cover rounded-2xl shadow-lg" />
                                                ) : (
                                                    <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                                    </svg>
                                                )}
                                            </div>
                                            {/* Decorative Elements */}
                                            <div className={`absolute -top-4 -left-4 w-8 h-8 rounded-full ${isDarkMode ? 'bg-teal-500' : 'bg-teal-300'} opacity-60 animate-pulse`}></div>
                                            <div className={`absolute -bottom-4 -right-4 w-6 h-6 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-blue-300'} opacity-60 animate-pulse delay-1000`}></div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="lg:w-3/5 space-y-6">
                                        <div className="text-center lg:text-left">
                                            <h3 className={'text-3xl font-bold mb-2 ' + textPrimaryClass}>
                                                {member.name}
                                            </h3>
                                            <p className={'text-lg font-semibold mb-4 ' + accentClass}>
                                                {isIndonesian ? member.role.id : member.role.en}
                                            </p>
                                        </div>

                                        <p className={'text-lg leading-relaxed text-center lg:text-left ' + textSecondaryClass}>
                                            {isIndonesian ? member.description.id : member.description.en}
                                        </p>

                                        {/* Skills */}
                                        <div>
                                            <p className={'text-sm font-semibold mb-4 uppercase tracking-wider text-center lg:text-left ' + textSecondaryClass}>
                                                {isIndonesian ? 'Keahlian' : 'Skills'}
                                            </p>
                                            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                                {member.skills.map((skill, i) => (
                                                    <span
                                                        key={i}
                                                        className={'px-4 py-2 text-sm rounded-full font-medium transform transition-all duration-300 hover:scale-105 ' +
                                                            (isDarkMode
                                                                ? 'bg-gradient-to-r from-teal-900 to-blue-900 text-teal-300 border border-teal-700'
                                                                : 'bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 border border-teal-300')}
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                            {member.github && (
                                                <a
                                                    href={member.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={'flex-1 py-4 rounded-xl text-center font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ' +
                                                        (isDarkMode
                                                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700')}
                                                >
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                                                        </svg>
                                                        GitHub
                                                    </span>
                                                </a>
                                            )}

                                            {member.linkedin && (
                                                <a
                                                    href={member.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={'flex-1 py-4 rounded-xl text-center font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ' +
                                                        (isDarkMode
                                                            ? 'bg-blue-700 hover:bg-blue-600 text-white'
                                                            : 'bg-blue-500 hover:bg-blue-600 text-white')}
                                                >
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" />
                                                        </svg>
                                                        LinkedIn
                                                    </span>
                                                </a>
                                            )}

                                            {member.email && (
                                                <div className="space-y-4 flex-1">
                                                    <div className={'p-4 rounded-xl flex items-center justify-between ' + (isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100')}>
                                                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                            <div className={'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ' + (isDarkMode ? 'bg-gray-600' : 'bg-white')}>
                                                                <svg className={'w-6 h-6 ' + accentClass} fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                                                </svg>
                                                            </div>
                                                            <span className={'text-base font-mono truncate ' + textSecondaryClass}>
                                                                {member.email}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleCopy(member.email, 'email')}
                                                            className={'ml-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0 ' +
                                                                (isDarkMode
                                                                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                                                                    : 'bg-teal-500 hover:bg-teal-600 text-white')}
                                                        >
                                                            {copiedEmail ? '✓ Copied' : 'Copy'}
                                                        </button>
                                                    </div>

                                                    <a
                                                        href={`mailto:${member.email}?subject=${isIndonesian ? 'Permintaan Akun Sistem' : 'System Account Request'}`}
                                                        className={'block w-full py-4 rounded-xl text-center font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ' +
                                                            (isDarkMode
                                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                                                                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white')}
                                                    >
                                                        📧 {isIndonesian ? 'Minta Akun Baru' : 'Request New Account'}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Component */}
            <Footer />

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
                <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500"></span>
                <span className="absolute left-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                    Back to Top
                    <span className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"></span>
                </span>
            </button>
        </div>
    );
};

export default AboutUs;