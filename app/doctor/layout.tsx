'use client'

import { AuthGuard, PermissionGate } from '@/lib/AuthGuard'
import { Role } from '@/types/emuns'
import { useAuth } from '@/components/auth/AuthContext'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Calendar,
    Users,
    User,
    Clock,
    LogOut,
    Menu,
    X,
    Bell,
    Stethoscope
} from 'lucide-react'
import { useState } from 'react'

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { currentUser, logout } = useAuth()
    const pathname = usePathname()
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const navigation = [
        {
            name: 'Dashboard',
            href: '/doctor/dashboard',
            icon: LayoutDashboard,
            permission: 'doctor:dashboard:view'
        },
        {
            name: 'Lịch khám',
            href: '/doctor/appointments',
            icon: Calendar,
            permission: 'doctor:appointments:view'
        },
        {
            name: 'Bệnh nhân',
            href: '/doctor/patients',
            icon: Users,
            permission: 'doctor:patients:view'
        },
        {
            name: 'Lịch làm việc',
            href: '/doctor/schedule',
            icon: Clock,
            permission: 'doctor:schedule:view'
        },
        {
            name: 'Hồ sơ cá nhân',
            href: '/doctor/profile',
            icon: User,
            permission: 'doctor:profile:view'
        }
    ]

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    return (
        <AuthGuard
            requiredRoles={[Role.DOCTOR, Role.ADMIN, Role.PATIENT]}
        >
            <div className="flex h-screen bg-gray-100">
                {/* Mobile sidebar backdrop */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}>
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center">
                                <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-lg">
                                    <Stethoscope className="w-5 h-5" />
                                </div>
                                <span className="ml-2 text-sm text-gray-600">Bác sĩ</span>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="p-4 border-b bg-blue-50">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {currentUser?.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                                    <p className="text-xs text-gray-600">{currentUser?.profile?.specialization || 'Bác sĩ'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-4">
                            <ul className="space-y-2">
                                {navigation.map((item) => {
                                    const IconComponent = item.icon
                                    return (
                                        <PermissionGate key={item.href} permission={item.permission}>
                                            <li>
                                                <Link
                                                    href={item.href}
                                                    className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${pathname === item.href
                                                        ? 'bg-blue-100 text-blue-600 border-r-2 border-blue-600'
                                                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                                                        }`}
                                                    onClick={() => setSidebarOpen(false)}
                                                >
                                                    <IconComponent className="w-5 h-5 mr-3" />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        </PermissionGate>
                                    )
                                })}
                            </ul>
                        </nav>

                        {/* Logout */}
                        <div className="p-4 border-t">
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top header */}
                    <header className="bg-white shadow-sm border-b">
                        <div className="flex items-center justify-between px-4 py-3">
                            <div className="flex items-center">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>

                                <h1 className="text-lg font-semibold text-gray-900 ml-4">
                                    Portal Bác sĩ
                                </h1>
                            </div>

                            <div className="flex items-center space-x-4">
                                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>

                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                                    <p className="text-xs text-gray-600">{currentUser?.profile?.licenseNumber}</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main content */}
                    <main className="flex-1 overflow-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    )
}