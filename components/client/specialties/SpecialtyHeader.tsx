import { Specialty } from '@/types/types'
import { Users, Star } from 'lucide-react'
import { getSpecialtyIcon, getSpecialtyColor } from './icons/LucideIconMap'

interface SpecialtyHeaderProps {
    specialtyData: Specialty
    doctorCount: number
}

export default function SpecialtyHeader({ specialtyData, doctorCount }: SpecialtyHeaderProps) {
    const Icon = getSpecialtyIcon(specialtyData.name)
    const colorClasses = getSpecialtyColor(specialtyData.name)

    return (
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-sm mb-6 border border-blue-100">
            <div className="flex items-start gap-5">
                <div className={`w-20 h-20 ${colorClasses} rounded-2xl flex items-center justify-center shadow-md`}>
                    <Icon className="w-10 h-10" />
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {specialtyData.name}
                    </h1>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        {specialtyData.description || 'Chuyên khoa chăm sóc sức khỏe chuyên nghiệp'}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">{doctorCount}</div>
                                <div className="text-sm text-gray-600">Bác sĩ</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                                <Star className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-amber-500">4.8</div>
                                <div className="text-sm text-gray-600">Đánh giá</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}