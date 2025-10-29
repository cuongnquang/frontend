'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Calendar,
    Heart,
    MapPin,
    Award,
} from 'lucide-react'
import { Doctor } from '@/types/types'

interface FeaturedDoctorCardProps {
    doctor: Doctor
    showBookButton?: boolean
}

export default function FeaturedDoctorCard({
    doctor,
    showBookButton = true,
}: FeaturedDoctorCardProps) {
    const router = useRouter()
    const [showAlert, setShowAlert] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)

    const handleBookAppointment = () => {
        const isLoggedIn = true
        if (!isLoggedIn) {
            setShowAlert(true)
            return
        }
        router.push(`/client/appointments?doctorId=${doctor.id}`)
    }

    const handleViewProfile = () => {
        router.push(`/client/doctors/${doctor.id}`)
    }

    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsFavorite(!isFavorite)
    }

    // Tìm lịch khám sớm nhất
    const nextAvailableSchedule = doctor.Schedules?.find(s => s.is_available)
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
        })
    }

    return (
        <div 
            onClick={handleViewProfile} 
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100 cursor-pointer"
        >
            {/* Header Section */}
            <div className="flex items-start space-x-4 mb-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    {doctor.avatar_url ? (
                        <img 
                            src={doctor.avatar_url} 
                            alt={doctor.full_name}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                                {doctor.full_name.split(' ').slice(-2).map(n => n[0]).join('')}
                            </span>
                        </div>
                    )}
                    {doctor.is_available && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>

                {/* Doctor Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">
                                {doctor.title && `${doctor.title} `}{doctor.full_name}
                            </h3>
                            <p className="text-blue-600 font-medium mb-1">
                                {doctor.Specialty?.name }
                            </p>
                            {(doctor.introduction || doctor.work_experience) && (
                                <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                                    {doctor.introduction || doctor.work_experience}
                                </p>
                            )}
                        </div>
                        
                        {/* Favorite Button */}
                        <button
                            onClick={toggleFavorite}
                            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Yêu thích"
                        >
                            <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                        </button>
                    </div>

                    {/* Experience */}
                    {doctor.experience_years && (
                        <div className="flex items-center text-sm text-gray-500">
                            <Award className="w-4 h-4 mr-1" />
                            <span>{doctor.experience_years} năm kinh nghiệm</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-4">
                {/* Next Available */}
                {nextAvailableSchedule && (
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Calendar className="w-4 h-4 mr-1 text-blue-600" />
                        <span className="text-gray-500">Sớm nhất:</span>
                        <span className="ml-1 font-medium text-gray-900">
                            {formatDate(nextAvailableSchedule.schedule_date)} • {nextAvailableSchedule.start_time}
                        </span>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        {doctor.is_available ? (
                            <span className="text-green-600 font-medium">● Đang hoạt động</span>
                        ) : (
                            <span className="text-gray-400">○ Không khả dụng</span>
                        )}
                    </div>
                    
                    {showAlert && (
                        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-xs text-yellow-800">
                                Bạn cần đăng nhập để thực hiện chức năng này.
                            </p>
                        </div>
                    )}
                    
                    {showBookButton && (
                        <button
                            onClick={(e) => { 
                                e.stopPropagation()
                                handleBookAppointment() 
                            }}
                            className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                                doctor.is_available 
                                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={!doctor.is_available}
                        >
                            Đặt lịch khám
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}