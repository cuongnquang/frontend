'use client'

import { useAuth } from '@/contexts/AuthContext'
import {
    Calendar,
    Users,
    Clock,
    TrendingUp,
    FileText,
    CheckCircle,
    AlertCircle,
    Activity,
    Star
} from 'lucide-react'

export default function DoctorDashboard() {
    const { user } = useAuth()

    const stats = [
        {
            name: 'Lịch hẹn hôm nay',
            value: '12',
            change: '+3',
            changeType: 'increase',
            icon: Calendar,
            color: 'blue'
        },
        {
            name: 'Bệnh nhân đang theo dõi',
            value: '156',
            change: '+8',
            changeType: 'increase',
            icon: Users,
            color: 'green'
        },
        {
            name: 'Giờ làm tuần này',
            value: '38h',
            change: '+2h',
            changeType: 'increase',
            icon: Clock,
            color: 'purple'
        },
        {
            name: 'Đánh giá trung bình',
            value: '4.9',
            change: '+0.1',
            changeType: 'increase',
            icon: Star,
            color: 'yellow'
        }
    ]

    const todayAppointments = [
        {
            id: 1,
            time: '09:00',
            patient: 'Nguyễn Văn An',
            type: 'Khám tổng quát',
            status: 'confirmed'
        },
        {
            id: 2,
            time: '09:30',
            patient: 'Trần Thị Bình',
            type: 'Tái khám',
            status: 'confirmed'
        },
        {
            id: 3,
            time: '10:00',
            patient: 'Lê Văn Cường',
            type: 'Khám chuyên khoa',
            status: 'pending'
        }
    ]

    const recentActivities = [
        {
            id: 1,
            message: 'Hoàn thành khám bệnh cho Nguyễn Văn A',
            time: '30 phút trước',
            icon: CheckCircle,
            color: 'text-green-600'
        },
        {
            id: 2,
            message: 'Cập nhật hồ sơ bệnh án BN-002',
            time: '1 giờ trước',
            icon: FileText,
            color: 'text-blue-600'
        },
        {
            id: 3,
            message: 'Lịch hẹn mới từ Trần Thị B',
            time: '2 giờ trước',
            icon: Calendar,
            color: 'text-purple-600'
        }
    ]

    const urgentPatients = [
        {
            id: 1,
            name: 'Phạm Văn D',
            condition: 'Đau ngực cấp',
            priority: 'high',
            lastVisit: '2 ngày trước'
        },
        {
            id: 2,
            name: 'Hoàng Thị E',
            condition: 'Theo dõi sau phẫu thuật',
            priority: 'medium',
            lastVisit: '5 ngày trước'
        }
    ]

    const getStatColors = (color: string) => {
        const colors = {
            blue: 'text-blue-600 bg-blue-100',
            green: 'text-green-600 bg-green-100',
            purple: 'text-purple-600 bg-purple-100',
            yellow: 'text-yellow-600 bg-yellow-100'
        }
        return colors[color as keyof typeof colors]
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl text-white p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">
                            Chào buổi sáng, {user?.name}!
                        </h1>
                        <p className="text-blue-100">
                            Bạn có {todayAppointments.length} lịch hẹn hôm nay
                        </p>
                    </div>
                    <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                        <Activity className="w-8 h-8" />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const IconComponent = stat.icon
                    return (
                        <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{stat.name}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                    <div className="flex items-center mt-2">
                                        <span className="text-sm font-medium text-green-600">
                                            {stat.change}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-1">so với tuần trước</span>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-lg ${getStatColors(stat.color)}`}>
                                    <IconComponent className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Appointments */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Lịch hẹn hôm nay</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {todayAppointments.map((appointment) => (
                                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center space-x-4">
                                            <div className="text-center">
                                                <div className="font-semibold text-gray-900">{appointment.time}</div>
                                            </div>
                                            <div className="w-px h-10 bg-gray-200" />
                                            <div>
                                                <h4 className="font-medium text-gray-900">{appointment.patient}</h4>
                                                <p className="text-sm text-gray-600">{appointment.type}</p>
                                            </div>
                                        </div>
                                        <div>
                                            {appointment.status === 'confirmed' ? (
                                                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                                    Đã xác nhận
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                                                    Chờ xác nhận
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Xem tất cả lịch hẹn →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Recent Activities */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recentActivities.map((activity) => {
                                    const IconComponent = activity.icon
                                    return (
                                        <div key={activity.id} className="flex items-start">
                                            <IconComponent className={`w-5 h-5 mr-3 mt-0.5 ${activity.color}`} />
                                            <div>
                                                <p className="text-sm text-gray-900">{activity.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Urgent Patients */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                                Bệnh nhân cần chú ý
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {urgentPatients.map((patient) => (
                                    <div key={patient.id} className="p-3 border-l-4 border-red-500 bg-red-50 rounded">
                                        <h4 className="font-medium text-gray-900">{patient.name}</h4>
                                        <p className="text-sm text-gray-600">{patient.condition}</p>
                                        <p className="text-xs text-gray-500 mt-1">Khám lần cuối: {patient.lastVisit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}