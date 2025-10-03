import React from 'react'
import { Hospital } from '@/components/client/hospitals/HospitalType' // Import interface
import { Star, MapPin, Bed, Stethoscope, Award, Phone, Clock, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface HospitalCardProps {
    hospital: Hospital
}

// Helper component cho các dòng thống kê nhỏ
const StatItem: React.FC<{ Icon: React.ElementType; value: string }> = ({ Icon, value }) => (
    <div className="flex items-center">
        <Icon className="w-4 h-4 text-blue-600 mr-2" />
        <span className="text-sm text-gray-600">{value}</span>
    </div>
)

export default function HospitalCard({ hospital }: HospitalCardProps) {
    const router = useRouter()

    const handleBookAppointment = () => {
        router.push(`/client/appointments?hospitalId=${hospital.id}`)
    }

    const handleViewDetails = () => {
        router.push(`/client/hospitals/${hospital.id}`)

    }
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="md:flex">
                {/* Hospital image */}
                <div className="md:w-1/3">
                    <div className="h-48 md:h-full bg-gray-200 relative" style={{ backgroundImage: `url(${hospital.image})`, backgroundSize: 'cover' }}>
                        {hospital.emergencyAvailable && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Cấp cứu 24/7
                            </div>
                        )}
                    </div>
                </div>

                {/* Hospital info */}
                <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{hospital.name}</h3>
                            <div className="flex items-center space-x-4 mb-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${hospital.type === 'Công lập' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {hospital.type}
                                </span>
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="ml-1 font-medium">{hospital.rating}</span>
                                    <span className="ml-1 text-gray-500">({hospital.reviews} đánh giá)</span>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-600 mb-3">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>{hospital.address}, {hospital.district}</span>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Đặt lịch
                        </button>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">{hospital.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <StatItem Icon={Bed} value={`${hospital.beds} giường`} />
                        <StatItem Icon={Stethoscope} value={`${hospital.doctors} bác sĩ`} />
                        <StatItem Icon={Award} value={`Từ ${hospital.established}`} />
                        <StatItem Icon={Phone} value={hospital.phone} />
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Chuyên khoa:</h4>
                        <div className="flex flex-wrap gap-2">
                            {hospital.specialties.map((specialty, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                                    {specialty}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Working hours */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>T2-T6: {hospital.workingHours.weekday} | T7-CN: {hospital.workingHours.weekend}</span>
                        </div>
                        <button onClick={handleViewDetails} className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                            Xem chi tiết
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}