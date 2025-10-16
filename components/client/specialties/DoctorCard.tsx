import { Doctor } from '@/types/types'
import { MapPin, Award, Star } from 'lucide-react'

interface DoctorCardProps {
    doctor: Doctor
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
    return (
        <div key={doctor.doctor_id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
                <img
                    src={doctor.avatar_url}
                    alt={doctor.full_name}
                    className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {doctor.title} {doctor.full_name}
                    </h3>
                    <p className="text-blue-600 text-sm mb-2">
                        {doctor.Specialty.name}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {doctor.work_experience}
                        </div>
                        <div className="flex items-center">
                            <Award className="w-4 h-4 mr-1" />
                            {doctor.experience_years} năm kinh nghiệm
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {doctor.introduction}
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium ml-1">4.8</span>
                            </div>
                            {doctor.is_available && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                    Đang nhận khám
                                </span>
                            )}
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Đặt lịch khám
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}