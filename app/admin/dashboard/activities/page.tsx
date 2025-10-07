'use client'

import { useState } from 'react'
import { ActivityLog } from '@/components/admin/dashboard/activities/ActivityLogType'
import ActivityHeader from '@/components/admin/dashboard/activities/ActivityHeader'
import ActivityStats from '@/components/admin/dashboard/activities/ActivityStats'
import ActivityFilters from '@/components/admin/dashboard/activities/ActivityFilters'
import ActivityTimeline from '@/components/admin/dashboard/activities/ActivityTimeline'

export default function AdminActivities() {
    const [searchTerm, setSearchTerm] = useState('')
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

    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.entityId.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || activity.status === statusFilter
        return matchesSearch && matchesStatus
    })

    return (
        <div className="space-y-6">
            <ActivityHeader />
            <ActivityStats />
            <ActivityFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                dateRange={dateRange}
                setDateRange={setDateRange}
            />
            <ActivityTimeline activities={filteredActivities} />
        </div>
    )
}