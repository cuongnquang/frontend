import { ArrowRight } from 'lucide-react'
import { Specialty } from '@/types/types'
import { getSpecialtyIcon, getSpecialtyColor } from '@/components/client/specialties/icons/LucideIconMap'

interface AllSpecialtiesGridProps {
    Specialties: Specialty[]
    getDoctorCount: (specialtyId: string) => number
    setSelectedSpecialty: (id: string) => void
}

export default function AllSpecialtiesGrid({
    Specialties,
    getDoctorCount,
    setSelectedSpecialty,
}: AllSpecialtiesGridProps) {
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Tất cả chuyên khoa
                </h2>
                <p className="text-gray-600">
                    Khám phá các chuyên khoa y tế với đội ngũ bác sĩ chuyên nghiệp
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {Specialties.map((specialty: Specialty) => {
                    const Icon = getSpecialtyIcon(specialty.name)
                    const doctorCount = getDoctorCount(specialty.specialty_id)
                    const colorClasses = getSpecialtyColor(specialty.name)

                    return (
                        <div
                            key={specialty.specialty_id}
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
                            onClick={() => setSelectedSpecialty(specialty.specialty_id)}
                        >
                            <div className="flex items-start space-x-4">
                                <div className={`w-12 h-12 ${colorClasses} rounded-lg flex items-center justify-center`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        {specialty.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {specialty.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-blue-600 font-medium text-sm">
                                            {doctorCount} bác sĩ
                                        </span>
                                        <div className="flex items-center">
                                            <span className="text-blue-600 font-medium text-sm mr-2">
                                                Xem chi tiết
                                            </span>
                                            <ArrowRight className="w-4 h-4 text-blue-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}