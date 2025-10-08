'use client'

import { Bell, AlertCircle, CheckCircle, Send } from 'lucide-react'
import { Notification } from '@/app/admin/notifications/page'

interface NotificationStatsProps {
    notifications: Notification[];
}

export function NotificationStats({ notifications }: NotificationStatsProps) {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.isRead).length;
    const read = notifications.filter(n => n.isRead).length;
    // Assuming 'today's notifications' logic needs to be implemented based on a proper timestamp
    const today = 8; // Placeholder

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                        <Bell className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Tổng số</p>
                        <p className="text-2xl font-bold text-gray-900">{total}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-orange-100 text-orange-600 mr-4">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Chưa đọc</p>
                        <p className="text-2xl font-bold text-gray-900">{unread}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Đã đọc</p>
                        <p className="text-2xl font-bold text-gray-900">{read}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
                        <Send className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Hôm nay</p>
                        <p className="text-2xl font-bold text-gray-900">{today}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
