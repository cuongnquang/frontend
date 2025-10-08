'use client'

import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    UserCheck,
    FileText,
    Settings,
    LogOut,
    CalendarDays
} from 'lucide-react'
import { SidebarHeader } from './SidebarHeader'
import { SidebarUserInfo } from './SidebarUserInfo'
import { SidebarNav } from './SidebarNav'

interface AdminSidebarProps {
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
}

export function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
    const { logout } = useAuth()
    const router = useRouter()

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Quản lý Bác sĩ', href: '/admin/doctors', icon: UserCheck },
        { name: 'Quản lý Bệnh nhân', href: '/admin/patients', icon: Users },
        { name: 'Quản lý Lịch hẹn', href: '/admin/appointments', icon: CalendarDays },
        { name: 'Báo cáo', href: '/admin/reports', icon: FileText },
        { name: 'Cài đặt', href: '/admin/settings', icon: Settings }
    ]

    const handleLogout = () => {
        logout()
        router.push('/auth/login')
    }

    return (
        <>
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <SidebarHeader setSidebarOpen={setSidebarOpen} />
                    <SidebarUserInfo />
                    <SidebarNav navigation={navigation} setSidebarOpen={setSidebarOpen} />
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
        </>
    )
}