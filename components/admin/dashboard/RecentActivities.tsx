'use client'

import { Calendar, UserCheck, Activity } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface RecentActivitiesProps {
    appointments?: any[]
    doctors?: any[]
    patients?: any[]
}

const defaultActivities = [
    {
        id: 1,
        type: 'appointment',
        message: 'Chưa có hoạt động gần đây',
        time: 'Hiện tại',
        icon: Calendar,
        color: 'text-blue-600 bg-blue-100'
    }
]

export default function RecentActivities({ appointments, doctors, patients }: RecentActivitiesProps) {
    const route = useRouter()

    // Tạo hoạt động từ appointments gần đây
    const recentActivities = appointments && appointments.length > 0
        ? appointments.slice(0, 3).map((apt: any, i: number) => ({
            id: i + 1,
            type: 'appointment',
            message: `Lịch khám: ${apt.patient_name} - ${apt.doctor_name}`,
            time: 'Gần đây',
            icon: Calendar,
            color: 'text-blue-600 bg-blue-100'
        }))
        : defaultActivities

    const hanldeViewActivities = () => {
        route.push('/admin/dashboard/activities')
    }

    return (
        <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Hoạt động gần đây</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {recentActivities.map((activity: any) => {
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
    )
}
