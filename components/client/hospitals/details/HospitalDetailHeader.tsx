import React from 'react'
import { Hospital } from '@/components/client/hospitals/HospitalType'
import { Star, MapPin, Phone, Shield, Heart } from 'lucide-react'

interface HospitalDetailHeaderProps {
    hospital: Hospital
}

export default function HospitalDetailHeader({ hospital }: HospitalDetailHeaderProps) {
    const isPublic = hospital.type === 'Công lập'
    const typeClass = isPublic ? 'bg-green-600' : 'bg-blue-600'

    return (
        <section className="bg-white border-b">
            <div className="h-72 bg-gray-300 relative" style={{ backgroundImage: `url(${hospital.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>

                <div className="absolute inset-0 flex items-end container mx-auto px-4 pb-6">
                    <div className="text-white">
                        <h1 className="text-4xl font-extrabold mb-1">
                            {hospital.name}
                        </h1>
                        <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${typeClass}`}>
                                {hospital.type}
                            </span>
                            <div className="flex items-center">
                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                <span className="ml-1 text-lg font-bold">{hospital.rating}</span>
                                <span className="ml-1 text-sm">({hospital.reviews} đánh giá)</span>
                            </div>
                            <div className="flex items-center text-sm">
                                <Shield className="w-4 h-4 mr-1 text-green-400" />
                                <span className="font-medium">Được chứng nhận</span>
                            </div>
                        </div>
                        <div className="flex items-center text-sm mt-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {hospital.address}, {hospital.district}, {hospital.city}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white py-4 shadow-sm">
                <div className="container mx-auto px-4 flex justify-end space-x-4">
                    <button className="flex items-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Heart className="w-5 h-5 mr-2" />
                        Lưu vào danh sách yêu thích
                    </button>
                    <button className="flex items-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                        <Phone className="w-5 h-5 mr-2" />
                        Liên hệ & Đặt lịch
                    </button>
                </div>
            </div>
        </section>
    )
}