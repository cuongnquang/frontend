'use client'

import { Check } from 'lucide-react'
import { Notification } from '@/app/admin/notifications/page'
import { NotificationItem } from './NotificationItem'

interface NotificationListProps {
    notifications: Notification[];
    onMarkAllAsRead: () => void;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
}

export function NotificationList({ notifications, onMarkAllAsRead, onMarkAsRead, onDelete }: NotificationListProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                    Danh sách thông báo ({notifications.length})
                </h2>
                <button onClick={onMarkAllAsRead} className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                    <Check className="w-4 h-4 mr-1" />
                    Đánh dấu tất cả đã đọc
                </button>
            </div>

            <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={onMarkAsRead}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    )
}
