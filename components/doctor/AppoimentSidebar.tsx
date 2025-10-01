import React from 'react'
import { Doctor } from '@/types/types'
import { Calendar, Clock, Phone, MessageCircle } from 'lucide-react'

interface AppointmentSidebarWidgetProps {
    doctor: Doctor;
    selectedService: 'consultation' | 'online';
    setSelectedService: (service: 'consultation' | 'online') => void;
}

export const AppointmentSidebarWidget: React.FC<AppointmentSidebarWidgetProps> = ({
    doctor,
    selectedService,
    setSelectedService
}) => {
    const currentPrice = selectedService === 'consultation' ? doctor.price.consultation : doctor.price.online

    return (
        <div className="sticky top-8 bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Đặt Lịch Khám</h2>

            {/* Service selector */}
            <div className="mb-4">
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => setSelectedService('consultation')}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${selectedService === 'consultation'
                            ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                            : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                            }`}
                    >
                        Khám trực tiếp
                    </button>
                    <button
                        onClick={() => setSelectedService('online')}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${selectedService === 'online'
                            ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                            : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                            }`}
                    >
                        Tư vấn online
                    </button>
                </div>
            </div>

            {/* Pricing */}
            <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">
                        {selectedService === 'consultation' ? 'Khám trực tiếp' : 'Tư vấn online'}
                    </span>
                    <span className="text-2xl font-bold text-indigo-600">
                        {currentPrice}
                    </span>
                </div>
            </div>

            {/* Availability info */}
            <div className="mb-6 space-y-3">
                <div className="flex items-center text-green-600">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="font-medium">Lịch trống tiếp theo: {doctor.nextAvailable}</span>
                </div>
                <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">Lịch làm việc:</p>
                    <div className="space-y-1">
                        {Object.entries(doctor.workingHours).map(([day, hours]) => (
                            <div key={day} className="flex justify-between">
                                <span>{day}:</span>
                                <span className="font-medium">{hours}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick actions */}
            <div className="space-y-3">
                <button
                    // Thêm link dẫn đến trang đặt lịch (ví dụ: /appointment?doctorId=1&service=consultation)
                    className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg flex items-center justify-center"
                >
                    <Calendar className="w-5 h-5 mr-2" />
                    Đặt Lịch Ngay
                </button>

                <div className="grid grid-cols-2 gap-2">
                    <button className="py-2 px-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center">
                        <Phone className="w-4 h-4 mr-1" />
                        Gọi ngay
                    </button>
                    <button className="py-2 px-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Nhắn tin
                    </button>
                </div>
            </div>
        </div>
    )
}