import React from 'react'
import { Microscope, Users, Star, ShieldCheck } from 'lucide-react'
import { Specialization } from './SpecializationTypes'

interface SpecialtyStatisticsProps {
    specializations: Specialization[]
}

export default function SpecialtyStatistics({ specializations }: SpecialtyStatisticsProps) {
    const totalSpecialties = specializations.length
    const totalDoctors = specializations.reduce((sum, s) => sum + s.totalDoctors, 0)
    const avgRating = (specializations.reduce((sum, s) => sum + s.avgRating, 0) / totalSpecialties).toFixed(1)
    const topRatedSpecialty = specializations.reduce((prev, current) => (prev.avgRating > current.avgRating ? prev : current), specializations[0])

    const stats = [
        {
            icon: Microscope,
            color: 'indigo',
            label: 'Tổng số Chuyên khoa',
            value: totalSpecialties,
            unit: 'Khoa'
        },
        {
            icon: Users,
            color: 'cyan',
            label: 'Tổng số Bác sĩ',
            value: totalDoctors.toLocaleString(),
            unit: 'BS'
        },
        {
            icon: Star,
            color: 'yellow',
            label: 'Đánh giá TB (Hệ thống)',
            value: avgRating,
            unit: 'Sao'
        },
        {
            icon: ShieldCheck,
            color: 'rose',
            label: 'Chuyên khoa tốt nhất',
            value: topRatedSpecialty?.name || 'N/A',
            unit: topRatedSpecialty ? `(${topRatedSpecialty.avgRating} Sao)` : ''
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-l-gray-200 hover:border-l-indigo-400 transition-all duration-300">
                    <div className="flex items-center">
                        {/* Lưu ý: Để TailwindCSS hoạt động, các class color như 'bg-indigo-100' cần được định nghĩa đầy đủ, thay vì dùng string interpolation.
                            Tuy nhiên, tôi vẫn dùng interpolation để giữ tính linh hoạt về mặt code logic, mặc dù có thể cần thêm config Tailwind.
                        */}
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