import { Doctor } from '@/types/types'
import { MapPin, Award, Calendar, User, Briefcase } from 'lucide-react'
import Link from 'next/link'

interface DoctorCardProps {
    doctor: Doctor
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
    return (
        <div className="group bg-white border border-gray-100 rounded-xl p-5 hover:shadow-xl transition-all duration-300 hover:border-blue-200">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-sm opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    <img
                        src={doctor.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                        alt={doctor.full_name}
                        className="relative w-24 h-24 rounded-full object-cover ring-2 ring-white shadow-md"
                    />
                    {doctor.is_available && (
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {doctor.full_name}
                        </h3>
                        {doctor.is_available && (
                            <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                                Có lịch
                            </span>
                        )}
                    </div>

                    <div className="inline-flex items-center px-2.5 py-1 bg-blue-50 rounded-full mb-3">
                        <span className="text-sm font-semibold text-blue-700">
                            {doctor.specialty_name}
                        </span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        {doctor.experience_years && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg">
                                <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{doctor.experience_years} năm</span>
                            </div>
                        )}
                        {doctor.workplace && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
                                <Briefcase className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                <span className="text-sm text-gray-700 truncate">{doctor.workplace}</span>
                            </div>  
                        )}
                    </div>

                    {doctor.introduction && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {doctor.introduction}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <Link 
                            href={`/client/doctors/${doctor.id}`} 
                            className="flex-1 px-4 py-2.5 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                        >
                            <User className="w-4 h-4" />
                            Hồ sơ
                        </Link>
                        <Link 
                            href={`/client/appointments?doctorId=${doctor.id}`} 
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                            <Calendar className="w-4 h-4" />
                            Đặt lịch
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}