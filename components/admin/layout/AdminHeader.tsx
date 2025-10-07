'use client'

import { useState, useRef, useEffect } from 'react'
import { Menu, Search, Bell } from 'lucide-react'
import { NotificationDropdown } from './NotificationDropdown'
import { useAuth } from '@/lib/AuthContext'

// Định nghĩa kiểu cho thông báo
export interface Notification {
    id: number;
    type: string;
    text: string;
    time: string;
    isRead: boolean;
}

interface AdminHeaderProps {
    setSidebarOpen: (open: boolean) => void
}

export function AdminHeader({ setSidebarOpen }: AdminHeaderProps) {
    const { login } = useAuth()
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    const notificationsRef = useRef<HTMLDivElement>(null)

    // Fetch notifications
    useEffect(() => {
        async function fetchNotifications() {
            try {
                const response = await fetch('/api/notifications')
                if (response.ok) {
                    const data: Notification[] = await response.json()
                    setNotifications(data)
                    setUnreadCount(data.filter(n => !n.isRead).length)
                }
            } catch (error) {
                console.error('Failed to fetch notifications:', error)
            }
        }

        fetchNotifications()
    }, [])

    // Hook để đóng dropdown khi click ra ngoài
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleMarkAllAsRead = () => {
        const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }))
        setNotifications(updatedNotifications)
        setUnreadCount(0)
        // Here you would also make an API call to update the read status on the server
    }

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="hidden md:block ml-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-100 text-black"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center">
                    {/* Notification Dropdown */}
                    <div className="relative" ref={notificationsRef}>
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-white">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        {isNotificationsOpen && (
                            <NotificationDropdown
                                notifications={notifications}
                                unreadCount={unreadCount}
                                onMarkAllAsRead={handleMarkAllAsRead}
                            />
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}