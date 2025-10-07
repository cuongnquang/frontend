'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Phone, MapPin, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const router = useRouter()
    const { user, logout } = useAuth()

    return (
        <header className="bg-white shadow-sm border-b">
            {/* Top bar */}
            <div className="bg-blue-600 text-white py-2">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-1" />
                                <span>Hotline: 1900 2115</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>Hồ Chí Minh</span>
                            </div>
                        </div>
                        <div className="hidden md:flex space-x-4">
                            <Link href="/download" className="hover:underline">Tải ứng dụng</Link>
                            <Link href="/partner" className="hover:underline">Đối tác</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main header */}
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link href="/" className="text-4xl font-extrabold tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
                            Medi
                        </span>
                        <span className="text-purple-700">Contect</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                            Trang chủ
                        </Link>
                        <Link href="/client/doctors" className="text-gray-700 hover:text-blue-600 font-medium">
                            Bác sĩ
                        </Link>
                        <Link href="/client/specialties" className="text-gray-700 hover:text-blue-600 font-medium">
                            Chuyên khoa
                        </Link>
                        <Link href="/client/services" className="text-gray-700 hover:text-blue-600 font-medium">
                            Tư vấn trực tiếp
                        </Link>
                        <Link href="/client/about" className="text-gray-700 hover:text-blue-600 font-medium">
                            Về chúng tôi
                        </Link>
                    </nav>

                    {/* User Profile or Auth buttons */}
                    <div className="hidden md:flex items-center space-x-3">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    {/* Avatar */}
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    {/* User name */}
                                    <span className="text-gray-700 font-medium">{user.name}</span>
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                </button>

                                {/* User dropdown menu */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                        <div className="py-2">
                                            {/* User info */}
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>

                                            {/* Menu items */}
                                            <Link
                                                href="/client/profile/"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <User className="w-4 h-4 mr-2" />
                                                Hồ sơ cá nhân
                                            </Link>

                                            <Link
                                                href="/client/settings"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <Settings className="w-4 h-4 mr-2" />
                                                Cài đặt
                                            </Link>

                                            <button
                                                onClick={logout}
                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/auth/login" className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                Đăng nhập
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6 text-gray-700" />
                        ) : (
                            <Menu className="h-6 w-6 text-gray-700" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex flex-col space-y-4">
                            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                                Trang chủ
                            </Link>
                            <Link href="/client/doctors" className="text-gray-700 hover:text-blue-600 font-medium">
                                Bác sĩ
                            </Link>
                            <Link href="/client/hospitals" className="text-gray-700 hover:text-blue-600 font-medium">
                                Bệnh viện
                            </Link>
                            <Link href="/client/specialties" className="text-gray-700 hover:text-blue-600 font-medium">
                                Chuyên khoa
                            </Link>
                            <Link href="/client/services" className="text-gray-700 hover:text-blue-600 font-medium">
                                Dịch vụ
                            </Link>
                            <Link href="/client/about" className="text-gray-700 hover:text-blue-600 font-medium">
                                Về chúng tôi
                            </Link>

                            {/* Mobile user section */}
                            <div className="pt-4 border-t">
                                {user ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3 px-2 py-2">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                                                        <User className="w-6 h-6 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>

                                        <Link href="/client/profile" className="flex items-center px-2 py-2 text-gray-700 hover:text-blue-600">
                                            <User className="w-4 h-4 mr-2" />
                                            Hồ sơ cá nhân
                                        </Link>

                                        <Link href="/client/settings" className="flex items-center px-2 py-2 text-gray-700 hover:text-blue-600">
                                            <Settings className="w-4 h-4 mr-2" />
                                            Cài đặt
                                        </Link>

                                        <button
                                            onClick={logout}
                                            className="flex items-center w-full px-2 py-2 text-red-600 hover:text-red-700"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Đăng xuất
                                        </button>
                                    </div>
                                ) : (
                                    <Link href="/auth/login" className="block px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-center">
                                        Đăng nhập
                                    </Link>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    )
}
