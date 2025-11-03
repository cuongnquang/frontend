'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Award, Clock } from 'lucide-react'
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

    // Tìm lịch khám sớm nhất
    const nextAvailableSchedule = doctor.Schedules?.find(s => s.is_available)
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
        })
    }

    return (
        <div 
            onClick={handleViewProfile} 
            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-gray-100 hover:border-blue-200 cursor-pointer overflow-hidden relative"
        >
            {/* Gradient Background Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative">
                {/* Header Section */}
                <div className="flex items-start space-x-4 mb-5">
                    {/* Avatar with gradient border */}
                    <div className="flex-shrink-0 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                        {doctor.avatar_url ? (
                            <img 
                                src={doctor.avatar_url} 
                                alt={doctor.full_name}
                                className="relative w-20 h-20 rounded-full object-cover ring-2 ring-white shadow-md"
                            />
                        ) : (
                            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center ring-2 ring-white shadow-md">
                                <span className="text-white font-bold text-xl">
                                    {doctor.full_name.split(' ').slice(-2).map(n => n[0]).join('')}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Doctor Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl text-gray-900 mb-1.5 truncate group-hover:text-blue-600 transition-colors">
                            {doctor.full_name}
                        </h3>
                        
                        <div className="inline-flex items-center px-2.5 py-1 bg-blue-50 rounded-full mb-2">
                            <span className="text-sm font-semibold text-blue-700">
                                {doctor.specialty_name}
                            </span>
                        </div>
                        
                        {(doctor.introduction || doctor.achievements) && (
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                {doctor.introduction || doctor.achievements}
                            </p>
                        )}
                    </div>
                </div>

                {/* Info Cards */}
                <div className="space-y-3 mb-5">
                    {/* Experience */}
                    {doctor.experience_years && (
                        <div className="flex items-center px-3 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm">
                                <Award className="w-4 h-4 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Kinh nghiệm</p>
                                <p className="text-sm font-bold text-gray-900">{doctor.experience_years} năm</p>
                            </div>
                        </div>
                    )}

                    {/* Next Available Schedule */}
                    {nextAvailableSchedule && (
                        <div className="flex items-center px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm">
                                <Calendar className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium">Lịch khám sớm nhất</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-gray-900">
                                        {formatDate(nextAvailableSchedule.schedule_date)}
                                    </p>
                                    <span className="text-gray-300">•</span>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-gray-400" />
                                        <p className="text-sm font-semibold text-gray-700">
                                            {nextAvailableSchedule.start_time}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <div className="relative">
                    {showAlert && (
                        <div className="absolute -top-16 left-0 right-0 p-3 bg-amber-50 border border-amber-200 rounded-lg shadow-lg z-10 animate-in fade-in slide-in-from-top-2">
                            <p className="text-sm text-amber-800 font-medium">
                                ⚠️ Bạn cần đăng nhập để đặt lịch khám
                            </p>
                        </div>
                    )}
                    
                    {showBookButton && (
                        <button
                            onClick={(e) => { 
                                e.stopPropagation()
                                handleBookAppointment() 
                            }}
                            className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                                doctor.is_available 
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5' 
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={!doctor.is_available}
                        >
                            {doctor.is_available ? '📅 Đặt lịch khám ngay' : 'Hiện không khả dụng'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}