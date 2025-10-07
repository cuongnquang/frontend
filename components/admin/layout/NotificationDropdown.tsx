'use client'

import { Calendar, UserPlus, CheckCircle, MailCheck, XCircle, Bell } from 'lucide-react'
import Link from 'next/link'
import { Notification } from './AdminHeader'

interface NotificationDropdownProps {
    notifications: Notification[];
    unreadCount: number;
    onMarkAllAsRead: () => void;
}

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'new_patient':
            return <UserPlus className="w-5 h-5 text-blue-500" />;
        case 'appointment_confirmed':
            return <Calendar className="w-5 h-5 text-green-500" />;
        case 'report_generated':
            return <CheckCircle className="w-5 h-5 text-purple-500" />;
        case 'appointment_cancelled':
            return <XCircle className="w-5 h-5 text-red-500" />;
        default:
            return <Bell className="w-5 h-5 text-gray-500" />;
    }
}

export function NotificationDropdown({ notifications, unreadCount, onMarkAllAsRead }: NotificationDropdownProps) {
    return (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border z-50 origin-top-right transition-all duration-200 ease-out transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">
                    Thông báo {unreadCount > 0 && <span className="ml-2 text-sm text-blue-600">({unreadCount} mới)</span>}
                </h3>
                <button onClick={onMarkAllAsRead} className="text-xs text-blue-600 hover:underline font-medium flex items-center">
                    <MailCheck className="w-3 h-3 mr-1" />
                    Đánh dấu đã đọc
                </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`flex items-start p-4 transition-colors border-l-4 ${notification.isRead ? 'border-transparent' : 'border-blue-500 bg-blue-50'}`}
                        >
                            <div className="flex-shrink-0 mr-4 mt-1">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-800 leading-relaxed">{notification.text}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                            {!notification.isRead && (
                                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full self-center ml-3"></div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500">Không có thông báo mới.</p>
                    </div>
                )}
            </div>
            <div className="p-3 border-t text-center bg-gray-50 rounded-b-xl">
                <Link
                    href="/admin/notifications"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                    Xem tất cả thông báo
                </Link>
            </div>
        </div>
    )
}