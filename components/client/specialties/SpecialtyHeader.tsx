import { Specialty } from '@/types/types'
import { getSpecialtyIcon, getSpecialtyColor } from './icons/LucideIconMap'

interface SpecialtyHeaderProps {
    specialtyData: Specialty
    doctorCount: number
}

export default function SpecialtyHeader({ specialtyData, doctorCount }: SpecialtyHeaderProps) {
    const Icon = getSpecialtyIcon(specialtyData.name)
    const colorClasses = getSpecialtyColor(specialtyData.name)

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 ${colorClasses} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Chuyên khoa {specialtyData.name}
                    </h1>
                    <p className="text-gray-600 mb-4">
                        {specialtyData.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {doctorCount}
                            </div>
                            <div className="text-sm text-gray-600">Bác sĩ</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">4.7</div>
                            <div className="text-sm text-gray-600">Đánh giá</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}