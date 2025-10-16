'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Role } from '@/types/types'

export function SidebarUserInfo() {
    const { user } = useAuth()

    return (
        <div className="p-5 border-b border-gray-100 bg-white shadow-sm">
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center ring-2 ring-indigo-300 ring-offset-2">
                        <span className="text-white font-bold text-lg">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col">
                    <p className="text-lg font-bold text-gray-800 leading-snug">
                        {user?.name || 'Guest User'}
                    </p>
                    <p className="text-sm font-medium text-indigo-600 mt-0.5">
                        {user?.role === Role.ADMIN ? 'Admin' : 'Quản trị viên'}
                    </p>
                </div>
            </div>
        </div>
    )
}