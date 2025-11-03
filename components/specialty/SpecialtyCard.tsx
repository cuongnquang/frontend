'use client'

import { ChevronRight, Stethoscope, Users } from 'lucide-react'

interface SpecialtyCardProps {
    id: string
    name: string
    description: string
    doctors: number
    image_url?: string
    color?: string
}

export default function SpecialtyCard({
    id,
    name,
    description,
    doctors,
    image_url,
    color = 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600'
}: SpecialtyCardProps) {
    return (
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 cursor-pointer">
            {/* Header with Image/Icon */}
            <div className="relative h-40 overflow-hidden">
                {image_url ? (
                    <div className="relative w-full h-full">
                        <img 
                            src={image_url} 
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    </div>
                ) : (
                    <div className={`w-full h-full ${color} flex items-center justify-center relative overflow-hidden`}>
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
                        </div>
                        <Stethoscope className="w-16 h-16 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                )}
                
                {/* Doctor count badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                    <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-bold text-gray-900">{doctors}</span>
                        <span className="text-xs text-gray-600">BS</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Title */}
                <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {name}
                </h3>

                {/* Description */}
                {description && (
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                        {description}
                    </p>
                )}

                {/* Divider */}
                <div className="border-t border-gray-100 pt-4 mt-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            <span className="font-medium text-gray-700">{doctors}</span> bác sĩ chuyên khoa
                        </div>
                        
                        <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-700">
                            <span>Xem chi tiết</span>
                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}