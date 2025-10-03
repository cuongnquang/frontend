'use client'

import { useState } from 'react'
import {
    Activity,
    Calendar,
    Filter,
    Search,
    User,
    FileText,
    Settings,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react'

interface ActivityLog {
    id: string
    user: string
    userId: string
    action: string
    entity: string
    entityId: string
    timestamp: string
    status: 'success' | 'failed' | 'pending'
    ipAddress: string
    details: string
}

export default function AdminActivities() {
    const [searchTerm, setSearchTerm] = useState('')
    const [actionFilter, setActionFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [dateRange, setDateRange] = useState('today')

    const activities: ActivityLog[] = [
        {
            id: '1',
            user: 'BS. Nguyễn Văn An',
            userId: 'BS001',
            action: 'Tạo hồ sơ bệnh án',
            entity: 'Medical Record',
            entityId: 'MR-001',
            timestamp: '2024-02-15 09:30:00',
            status: 'success',
            ipAddress: '192.168.1.100',
            details: 'Tạo hồ sơ bệnh án cho bệnh nhân BN-001'
        },
        {
            id: '2',
            user: 'Admin System',
            userId: 'ADM001',
            action: 'Cập nhật thông tin bác sĩ',
            entity: 'Doctor',
            entityId: 'BS-002',
            timestamp: '2024-02-15 09:15:00',
            status: 'success',
            ipAddress: '192.168.1.101',
            details: 'Cập nhật thông tin chuyên khoa và học vấn'
        },
        {
            id: '3',
            user: 'Lễ tân Nguyễn Thị B',
            userId: 'RC001',
            action: 'Đặt lịch khám',
            entity: 'Appointment',
            entityId: 'APP-125',
            timestamp: '2024-02-15 09:00:00',
            status: 'success',
            ipAddress: '192.168.1.102',
            details: 'Tạo lịch hẹn cho bệnh nhân mới'
        },
        {
            id: '4',
            user: 'System',
            userId: 'SYSTEM',
            action: 'Sao lưu dữ liệu',
            entity: 'System',
            entityId: 'BACKUP-001',
            timestamp: '2024-02-15 02:00:00',
            status: 'success',
            ipAddress: 'localhost',
            details: 'Sao lưu tự động cơ sở dữ liệu'
        },
        {
            id: '5',
            user: 'BS. Trần Thị Bình',
            userId: 'BS002',
            action: 'Xóa lịch hẹn',
            entity: 'Appointment',
            entityId: 'APP-120',
            timestamp: '2024-02-14 16:45:00',
            status: 'failed',
            ipAddress: '192.168.1.103',
            details: 'Thất bại: Không có quyền xóa lịch hẹn đã xác nhận'
        }
    ]

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />
            case 'failed': return <XCircle className="w-4 h-4 text-red-600" />
            case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />
            default: return <AlertCircle className="w-4 h-4 text-gray-600" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return 'bg-green-100 text-green-800'
            case 'failed': return 'bg-red-100 text-red-800'
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.entityId.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || activity.status === statusFilter
        return matchesSearch && matchesStatus
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Nhật ký Hoạt động</h1>
                <p className="text-gray-600">Theo dõi tất cả hoạt động trong hệ thống</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Tổng hoạt động</p>
                            <p className="text-2xl font-bold text-gray-900">1,254</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Thành công</p>
                            <p className="text-2xl font-bold text-gray-900">1,198</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-red-100 text-red-600 mr-4">
                            <XCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Thất bại</p>
                            <p className="text-2xl font-bold text-gray-900">45</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600 mr-4">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Đang xử lý</p>
                            <p className="text-2xl font-bold text-gray-900">11</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tìm kiếm
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Người dùng, hành động, ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Tất cả</option>
                            <option value="success">Thành công</option>
                            <option value="failed">Thất bại</option>
                            <option value="pending">Đang xử lý</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Thời gian
                        </label>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="today">Hôm nay</option>
                            <option value="week">Tuần này</option>
                            <option value="month">Tháng này</option>
                            <option value="all">Tất cả</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Nhật ký hoạt động ({filteredActivities.length})
                    </h2>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {filteredActivities.map((activity, index) => (
                            <div key={activity.id} className="flex">
                                <div className="flex flex-col items-center mr-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                                        {getStatusIcon(activity.status)}
                                    </div>
                                    {index < filteredActivities.length - 1 && (
                                        <div className="w-0.5 h-full bg-gray-200 mt-2" />
                                    )}
                                </div>

                                <div className="flex-1 pb-8">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="font-semibold text-gray-900">{activity.action}</h3>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                                                        {activity.status === 'success' ? 'Thành công' :
                                                            activity.status === 'failed' ? 'Thất bại' : 'Đang xử lý'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    <User className="w-3 h-3 inline mr-1" />
                                                    {activity.user} ({activity.userId})
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-500">{activity.timestamp}</span>
                                        </div>

                                        <p className="text-sm text-gray-700 mb-2">{activity.details}</p>

                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <span>Entity: {activity.entity}</span>
                                            <span>•</span>
                                            <span>ID: {activity.entityId}</span>
                                            <span>•</span>
                                            <span>IP: {activity.ipAddress}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}