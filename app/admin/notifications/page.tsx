'use client'

import { useState } from 'react'
import { NotificationHeader } from '@/components/admin/notifications/NotificationHeader'
import { NotificationStats } from '@/components/admin/notifications/NotificationStats'
import { NotificationFilters } from '@/components/admin/notifications/NotificationFilters'
import { NotificationList } from '@/components/admin/notifications/NotificationList'

export interface Notification {
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    isRead: boolean
    timestamp: string
    link?: string
    recipient: string
}

const initialNotifications: Notification[] = [
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
];

export default function AdminNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [filter, setFilter] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [showCreateModal, setShowCreateModal] = useState(false)

    const filteredNotifications = notifications.filter(notif => {
        const matchesFilter = filter === 'all' ||
            (filter === 'unread' && !notif.isRead) ||
            (filter === 'read' && notif.isRead)
        const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notif.message.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const handleMarkAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    }

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    }

    const handleDelete = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    }

    return (
        <div className="space-y-6">
            <NotificationHeader onShowCreateModal={() => setShowCreateModal(true)} />
            <NotificationStats notifications={notifications} />
            <NotificationFilters
                filter={filter}
                setFilter={setFilter}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
            <NotificationList
                notifications={filteredNotifications}
                onMarkAllAsRead={handleMarkAllAsRead}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
            />
        </div>
    )
}