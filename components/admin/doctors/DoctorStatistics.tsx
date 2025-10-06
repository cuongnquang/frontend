import React from 'react'
import { UserCheck, Star, Clock, DollarSign } from 'lucide-react'
import { Doctor } from './DoctorTypes'

interface DoctorStatisticsProps {
    doctors: Doctor[]
}

export default function DoctorStatistics({ doctors }: DoctorStatisticsProps) {
    const totalDoctors = doctors.length
    const activeDoctors = doctors.filter(d => d.status === 'active').length
    const avgExperience = Math.round(doctors.reduce((sum, d) => sum + d.experience, 0) / totalDoctors) || 0
    const avgRating = (doctors.reduce((sum, d) => sum + d.rating, 0) / totalDoctors).toFixed(1)

    // Hàm format tiền tệ (Ví dụ: 500000 -> 500K)
    const formatCurrency = (value: number) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
        if (value >= 1000) return `${Math.round(value / 1000)}K`
        return value.toString()
    }

    const stats = [
        {
            icon: UserCheck,
            color: 'blue',
            label: 'Bác sĩ hoạt động',
            value: activeDoctors,
            total: totalDoctors
        },
        {
            icon: Star,
            color: 'yellow',
            label: 'Đánh giá TB',
            value: avgRating,
            unit: 'Sao'
        },
        {
            icon: Clock,
            color: 'green',
            label: 'KN Trung bình',
            value: avgExperience,
            unit: 'Năm'
        },
        {
            icon: DollarSign,
            color: 'red',
            label: 'Phí tư vấn TB',
            value: formatCurrency(doctors.reduce((sum, d) => sum + d.consultationFee, 0) / totalDoctors || 0),
            unit: 'VNĐ'
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-l-gray-200 hover:border-l-blue-400 transition-all duration-300">
                    <div className="flex items-center">
                        <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600 mr-4`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">
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