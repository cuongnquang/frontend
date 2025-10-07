'use client'

import { Send } from 'lucide-react'

interface NotificationHeaderProps {
    onShowCreateModal: () => void;
}

export function NotificationHeader({ onShowCreateModal }: NotificationHeaderProps) {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
                <p className="text-gray-600">Quản lý và gửi thông báo</p>
            </div>
            <button
                onClick={onShowCreateModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
                <Send className="w-4 h-4 mr-2" />
                Gửi thông báo
            </button>
        </div>
    )
}
