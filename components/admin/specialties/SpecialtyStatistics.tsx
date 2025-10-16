import React from 'react'
import { Microscope, ImageIcon, CalendarCheck } from 'lucide-react'
import { Specialization } from './SpecializationTypes'

interface SpecialtyStatisticsProps {
    specializations: Specialization[]
}

export default function SpecialtyStatistics({ specializations }: SpecialtyStatisticsProps) {
    const totalSpecialties = specializations.length
    const latestCreated = specializations.length > 0 ? new Date(specializations[0].createdAt || '').toLocaleDateString('vi-VN') : 'N/A'
    const latestUpdated = specializations.length > 0 ? new Date(specializations[0].updatedAt || '').toLocaleDateString('vi-VN') : 'N/A'

    const stats = [
        {
            icon: Microscope,
            color: 'indigo',
            label: 'Tổng số Chuyên khoa',
            value: totalSpecialties,
            unit: 'Khoa'
        },
        {
            icon: ImageIcon,
            color: 'cyan',
            label: 'Có hình ảnh',
            value: specializations.filter(s => s.image).length,
            unit: 'Khoa'
        },
        {
            icon: CalendarCheck,
            color: 'yellow',
            label: 'Ngày tạo gần nhất',
            value: latestCreated,
            unit: ''
        },
        {
            icon: CalendarCheck,
            color: 'rose',
            label: 'Ngày cập nhật gần nhất',
            value: latestUpdated,
            unit: ''
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-l-gray-200 hover:border-l-indigo-400 transition-all duration-300">
                    <div className="flex items-center">
                        <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600 mr-4`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 truncate">
                                {stat.value}
                                {stat.unit && <span className="text-base font-normal ml-1 text-gray-600">{stat.unit}</span>}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}