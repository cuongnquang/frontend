'use client'

import { Users, UserCheck, Calendar, TrendingUp, Activity } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
    const route = useRouter()
    const stats = [
        {
            name: 'Tổng số Bác sĩ',
            value: '156',
            change: '+12%',
            changeType: 'increase',
            icon: UserCheck,
            permission: 'admin:doctors:view',
            color: 'blue'
        },
        {
            name: 'Tổng số Bệnh nhân',
            value: '2,847',
            change: '+18%',
            changeType: 'increase',
            icon: Users,

            color: 'green'
        },
        {
            name: 'Lịch hẹn hôm nay',
            value: '43',
            change: '-5%',
            changeType: 'decrease',
            icon: Calendar,
            color: 'yellow'
        },
        {
            name: 'Doanh thu tháng',
            value: '₫1.2M',
            change: '+25%',
            changeType: 'increase',
            icon: TrendingUp,
            color: 'purple'
        }
    ]

    const recentActivities = [
        {
            id: 1,
            type: 'appointment',
            message: 'Bệnh nhân Nguyễn Văn A đã đặt lịch khám',
            time: '5 phút trước',
            icon: Calendar,
            color: 'text-blue-600 bg-blue-100'
        },
        {
            id: 2,
            type: 'doctor',
            message: 'BS. Trần Thị B đã cập nhật lịch làm việc',
            time: '15 phút trước',
            icon: UserCheck,
            color: 'text-green-600 bg-green-100'
        },
        {
            id: 3,
            type: 'system',
            message: 'Hệ thống đã sao lưu dữ liệu thành công',
            time: '30 phút trước',
            icon: Activity,
            color: 'text-purple-600 bg-purple-100'
        }
    ]

    const hanldeViewActivities = () => {
        route.push('/admin/dashboard/activities')
    }

    const getStatColors = (color: string) => {
        const colors = {
            blue: 'text-blue-600 bg-blue-100',
            green: 'text-green-600 bg-green-100',
            yellow: 'text-yellow-600 bg-yellow-100',
            purple: 'text-purple-600 bg-purple-100'
        }
        return colors[color as keyof typeof colors] || colors.blue
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Quản trị</h1>
                <p className="text-gray-600 mt-2">
                    Tổng quan hệ thống YouMed - {new Date().toLocaleDateString('vi-VN')}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => {
                    const IconComponent = stat.icon
                    return (
                        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                    <div className="flex items-center mt-2">
                                        <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {stat.change}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
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
                {/* Recent Activities */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Hoạt động gần đây</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recentActivities.map((activity) => {
                                    const IconComponent = activity.icon
                                    return (
                                        <div key={activity.id} className="flex items-start">
                                            <div className={`p-2 rounded-lg ${activity.color} mr-4 flex-shrink-0`}>
                                                <IconComponent className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900">{activity.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="mt-6">
                                <button onClick={hanldeViewActivities} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    Xem tất cả hoạt động →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
                        <div className="space-y-3">
                            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border">
                                <div className="flex items-center">
                                    <UserCheck className="w-5 h-5 text-blue-600 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Thêm Bác sĩ</p>
                                        <p className="text-xs text-gray-500">Đăng ký bác sĩ mới</p>
                                    </div>
                                </div>
                            </button>
                            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border">
                                <div className="flex items-center">
                                    <Users className="w-5 h-5 text-green-600 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Thêm Bệnh nhân</p>
                                        <p className="text-xs text-gray-500">Đăng ký bệnh nhân mới</p>
                                    </div>
                                </div>
                            </button>
                            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border">
                                <div className="flex items-center">
                                    <TrendingUp className="w-5 h-5 text-purple-600 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Tạo báo cáo</p>
                                        <p className="text-xs text-gray-500">Xuất báo cáo thống kê</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái hệ thống</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Máy chủ</span>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-green-600">Hoạt động</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Cơ sở dữ liệu</span>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-green-600">Hoạt động</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Sao lưu</span>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-yellow-600">Đang xử lý</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}