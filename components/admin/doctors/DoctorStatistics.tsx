import React from 'react'
import { UserCheck, Star, Clock, DollarSign } from 'lucide-react'
import { Doctor } from '@/contexts/DoctorContext'

interface DoctorStatisticsProps {
    doctors: Doctor[]
}

export default function DoctorStatistics({ doctors }: DoctorStatisticsProps) {
    const totalDoctors = doctors.length
    const activeDoctors = doctors.filter(d => d.is_available).length
    const avgExperience = Math.round(doctors.reduce((sum, d) => sum + (d.experience_years || 0), 0) / totalDoctors) || 0

    const stats = [
        {
            icon: UserCheck,
            color: 'blue',
            label: 'Bác sĩ hoạt động',
            value: activeDoctors,
            total: totalDoctors
        },
        {
            icon: Clock,
            color: 'green',
            label: 'KN Trung bình',
            value: avgExperience,
            unit: 'Năm'
        },
        {
            icon: UserCheck,
            color: 'yellow',
            label: 'Tổng số bác sĩ',
            value: totalDoctors,
            unit: 'Người'
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-l-blue-400 hover:border-l-blue-600 transition-all duration-300">
                    <div className="flex items-center">
                        <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600 mr-4`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stat.value}
                                {stat.unit && <span className="text-base font-normal ml-1 text-gray-600">{stat.unit}</span>}
                                {stat.total && <span className="text-base font-normal ml-1 text-gray-600">/ {stat.total}</span>}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}