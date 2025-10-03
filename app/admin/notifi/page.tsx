'use client'

import { useState } from 'react'
import {
    Bell,
    Search,
    Filter,
    Check,
    Trash2,
    Calendar,
    AlertCircle,
    Info,
    CheckCircle,
    Send
} from 'lucide-react'

interface Notification {
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    isRead: boolean
    timestamp: string
    link?: string
    recipient: string
}

export default function AdminNotifications() {
    const [filter, setFilter] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [showCreateModal, setShowCreateModal] = useState(false)

    const notifications: Notification[] = [
        {
            id: '1',
            title: 'Lịch hẹn mới',
            message: 'Bệnh nhân Nguyễn Văn A đã đặt lịch khám với BS. Trần Thị B',
            type: 'info',
            isRead: false,
            timestamp: '2024-02-15 10:30:00',
            recipient: 'BS. Trần Thị B'
        },
        {
            id: '2',
            title: 'Thanh toán thành công',
            message: 'Thanh toán hóa đơn #INV-001 đã được xác nhận',
            type: 'success',
            isRead: false,
            timestamp: '2024-02-15 10:15:00',
            recipient: 'Lê Văn C'
        },
        {
            id: '3',
            title: 'Cảnh báo hệ thống',
            message: 'Dung lượng server sắp đầy, cần sao lưu dữ liệu',
            type: 'warning',
            isRead: true,
            timestamp: '2024-02-15 09:00:00',
            recipient: 'Admin System'
        },
        {
            id: '4',
            title: 'Lỗi đồng bộ',
            message: 'Không thể đồng bộ dữ liệu với hệ thống bảo hiểm',
            type: 'error',
            isRead: false,
            timestamp: '2024-02-15 08:45:00',
            recipient: 'Admin System'
        }
    ]

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

    const filteredNotifications = notifications.filter(notif => {
        const matchesFilter = filter === 'all' ||
            (filter === 'unread' && !notif.isRead) ||
            (filter === 'read' && notif.isRead)
        const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notif.message.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesFilter && matchesSearch
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
                    <p className="text-gray-600">Quản lý và gửi thông báo</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                    <Send className="w-4 h-4 mr-2" />
                    Gửi thông báo
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Tổng số</p>
                            <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
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
                            <p className="text-2xl font-bold text-gray-900">
                                {notifications.filter(n => !n.isRead).length}
                            </p>
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
                            <p className="text-2xl font-bold text-gray-900">
                                {notifications.filter(n => n.isRead).length}
                            </p>
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
                            <p className="text-2xl font-bold text-gray-900">8</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm thông báo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-2 rounded-lg ${filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            Chưa đọc
                        </button>
                        <button
                            onClick={() => setFilter('read')}
                            className={`px-4 py-2 rounded-lg ${filter === 'read' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            Đã đọc
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Danh sách thông báo ({filteredNotifications.length})
                    </h2>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                        <Check className="w-4 h-4 mr-1" />
                        Đánh dấu tất cả đã đọc
                    </button>
                </div>

                <div className="divide-y divide-gray-200">
                    {filteredNotifications.map((notification) => (
                        <div
                            key={notification.id}
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
                                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                                                <Check className="w-4 h-4 mr-1" />
                                                Đánh dấu đã đọc
                                            </button>
                                        )}
                                        <button className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center">
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}