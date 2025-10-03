import React from 'react'
import { Star, MapPin } from 'lucide-react'
import { Hospital } from '@/components/client/hospitals/HospitalType' // Import interface

interface FeaturedHospitalsProps {
    hospitals: Hospital[] // Nhận danh sách bệnh viện nổi bật
}

// Component thẻ nhỏ cho mục nổi bật
const FeaturedCard: React.FC<{ hospital: Hospital }> = ({ hospital }) => (
    <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="h-48 bg-gray-200 relative" style={{ backgroundImage: `url(${hospital.image})`, backgroundSize: 'cover' }}>
            <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium">
                {hospital.type}
            </div>
        </div>
        <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{hospital.name}</h3>
            <div className="flex items-center mb-3">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 font-medium">{hospital.rating}</span>
                <span className="ml-1 text-gray-500 text-sm">({hospital.reviews} đánh giá)</span>
            </div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{hospital.description}</p>
            <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {hospital.district}
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Xem chi tiết
                </button>
            </div>
        </div>
    </div>
)

export default function FeaturedHospitals({ hospitals }: FeaturedHospitalsProps) {
    if (hospitals.length === 0) return null

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Bệnh viện nổi bật
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {hospitals.map(hospital => (
                        <FeaturedCard key={hospital.id} hospital={hospital} />
                    ))}
                </div>
            </div>
        </section>
    )
}