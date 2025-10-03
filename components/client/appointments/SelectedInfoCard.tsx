import React from 'react'
import { MapPin, Star } from 'lucide-react'

interface Doctor {
    id: number
    name: string
    specialty: string
    hospital: string
    rating: number
    price: string
    image: string
}

interface Hospital {
    id: number
    name: string
    address: string
    rating: number
    image: string
}

interface SelectedInfoCardProps {
    selectedDoctor: Doctor | null
    selectedHospital: Hospital | null
}

export default function SelectedInfoCard({ selectedDoctor, selectedHospital }: SelectedInfoCardProps) {
    if (!selectedDoctor && !selectedHospital) return null // Không hiển thị nếu chưa chọn gì

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Thông tin đã chọn
            </h2>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                {selectedDoctor && (
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0" style={{ backgroundImage: `url(${selectedDoctor.image})`, backgroundSize: 'cover' }}></div>
                        <div>
                            <h4 className="font-semibold text-gray-900">{selectedDoctor.name}</h4>
                            <p className="text-blue-600">{selectedDoctor.specialty}</p>
                            <p className="text-gray-600">{selectedDoctor.hospital}</p>
                            <p className="font-semibold text-blue-600">{selectedDoctor.price}</p>
                        </div>
                    </div>
                )}
                {selectedHospital && (
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" style={{ backgroundImage: `url(${selectedHospital.image})`, backgroundSize: 'cover' }}></div>
                        <div>
                            <h4 className="font-semibold text-gray-900">{selectedHospital.name}</h4>
                            <p className="text-gray-600 flex items-center"><MapPin className="w-4 h-4 mr-1 text-blue-500" />{selectedHospital.address}</p>
                            <div className="flex items-center mt-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm font-medium text-gray-700">{selectedHospital.rating}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}