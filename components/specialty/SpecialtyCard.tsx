'use client'

import { ChevronRight, Stethoscope } from 'lucide-react'

interface SpecialtyCardProps {
    id: string
    name: string
    description: string
    image_url?: string
    color?: string
}

export default function SpecialtyCard({
    id,
    name,
    description,
    image_url,
    color = 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600'
}: SpecialtyCardProps) {
    return (
        <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300 cursor-pointer h-full flex flex-col">
            {/* Image/Icon Section */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                {image_url ? (
                    <div className="relative w-full h-full">
                        <img 
                            src={image_url} 
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>
                ) : (
                    <div className={`w-full h-full ${color} flex items-center justify-center relative overflow-hidden`}>
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16"></div>
                        </div>
                        <Stethoscope className="w-20 h-20 relative z-10 group-hover:scale-125 transition-transform duration-300" />
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col justify-between">
                {/* Title & Description */}
                <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {name}
                    </h3>

                    {description && (
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                            {description}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                        <span>Khám phá</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    )
}