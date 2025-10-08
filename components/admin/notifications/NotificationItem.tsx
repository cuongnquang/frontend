'use client'

import { Calendar, Check, Trash2, Info, CheckCircle, AlertCircle, Bell } from 'lucide-react'
import { Notification } from '@/app/admin/notifications/page'

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
}

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'info': return <Info className="w-5 h-5 text-blue-600" />
        case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />
        case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />
        case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />
        default: return <Bell className="w-5 h-5 text-gray-600" />
    }
}

const getTypeColor = (type: string) => {
    switch (type) {
        case 'info': return 'bg-blue-100'
        case 'success': return 'bg-green-100'
        case 'warning': return 'bg-yellow-100'
        case 'error': return 'bg-red-100'
        default: return 'bg-gray-100'
    }
}

export function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
    return (
        <div
            className={`p-6 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50' : ''}`}
        >
            <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                </div>

                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {notification.timestamp}
                                </span>
                                <span>Người nhận: {notification.recipient}</span>
                            </div>
                        </div>

                        {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 mt-4">
                        {!notification.isRead && (
                            <button
                                onClick={() => onMarkAsRead(notification.id)}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                            >
                                <Check className="w-4 h-4 mr-1" />
                                Đánh dấu đã đọc
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(notification.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
