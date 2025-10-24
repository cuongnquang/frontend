import { Doctor } from '@/types/types'
import { MapPin, Award, Star, Calendar, User } from 'lucide-react'
import Link from 'next/link'

interface DoctorCardProps {
    doctor: Doctor
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
    return (
        <div key={doctor.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start space-x-4">
                <img
                    src={doctor.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                    alt={doctor.full_name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                />
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-900">
                            {doctor.full_name}
                        </h3>
                        {doctor.is_available && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                Có lịch trống
                            </span>
                        )}
                    </div>
                    <p className="text-blue-600 font-semibold text-sm mb-2">
                        Chuyên khoa {doctor.specialty_name}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                            <Award className="w-4 h-4 mr-1.5 text-indigo-500" />
                            {doctor.experience_years} năm kinh nghiệm
                        </div>
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1.5 text-red-500" />
                            {doctor.work_experience}
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 italic">
                        {doctor.introduction}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <Star className="w-4 h-4 text-gray-300 fill-current" />
                                <span className="text-xs text-gray-500 ml-2">(12 đánh giá)</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Link href={`/client/doctors/${doctor.id}`} className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-semibold flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Xem chi tiết
                            </Link>
                            <Link href={`/client/appointments?doctorId=${doctor.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Đặt lịch
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
