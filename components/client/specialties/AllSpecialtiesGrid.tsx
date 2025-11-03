import { ArrowRight, Users } from 'lucide-react'
import { Specialty } from '@/types/types'
import { getSpecialtyIcon, getSpecialtyColor } from '@/components/client/specialties/icons/LucideIconMap'

interface AllSpecialtiesGridProps {
    Specialties: Specialty[]
    doctorCounts: Map<string, number>
    setSelectedSpecialty: (id: string | null) => void
}

export default function AllSpecialtiesGrid({
    Specialties,
    doctorCounts,
    setSelectedSpecialty,
}: AllSpecialtiesGridProps) {
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Khám phá chuyên khoa
                </h2>
                <p className="text-gray-600">
                    Đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
                {Specialties.map((specialty: Specialty) => {
                    const Icon = getSpecialtyIcon(specialty.name)
                    const doctorCount = doctorCounts.get(specialty.name) || 0
                    const colorClasses = getSpecialtyColor(specialty.name)

                    return (
                        <div
                            key={specialty.id}
                            className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100 hover:border-blue-200"
                            onClick={() => setSelectedSpecialty(specialty.name)}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-14 h-14 ${colorClasses} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                        {specialty.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                                        {specialty.description || 'Chuyên khoa chăm sóc sức khỏe toàn diện'}
                                    </p>

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                                <Users className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Bác sĩ</p>
                                                <p className="text-sm font-bold text-gray-900">{doctorCount}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-700">
                                            <span>Xem</span>
                                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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