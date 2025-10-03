import React from 'react'
import { Award, Shield, Stethoscope, Bed, CheckCircle } from 'lucide-react'

interface HospitalInfoSectionProps {
    title: string
    content?: string
    items?: string[]
    type?: 'specialties' | 'facilities' | 'default'
    mission?: string
    vision?: string
}

const IconMap = {
    specialties: Stethoscope,
    facilities: Bed,
    default: CheckCircle,
}

export default function HospitalInfoSection({
    title,
    content,
    items,
    type = 'default',
    mission,
    vision,
}: HospitalInfoSectionProps) {
    const IconComponent = IconMap[type]

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-3">{title}</h2>

            {/* Nội dung dạng đoạn văn (Giới thiệu chung) */}
            {content && <p className="text-gray-700 leading-relaxed mb-6">{content}</p>}

            {/* Nhiệm vụ và tầm nhìn */}
            {(mission || vision) && (
                <div className="space-y-4">
                    {mission && (
                        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                            <h3 className="font-semibold text-blue-800 flex items-center mb-1">
                                <Award className="w-5 h-5 mr-2" /> Nhiệm vụ
                            </h3>
                            <p className="text-blue-700">{mission}</p>
                        </div>
                    )}
                    {vision && (
                        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                            <h3 className="font-semibold text-green-800 flex items-center mb-1">
                                <Shield className="w-5 h-5 mr-2" /> Tầm nhìn
                            </h3>
                            <p className="text-green-700">{vision}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Nội dung dạng danh sách (Chuyên khoa/Tiện nghi) */}
            {items && items.length > 0 && (
                <div className="grid md:grid-cols-2 gap-4">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                            <IconComponent className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                            <span className="ml-3 text-gray-700">{item}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}