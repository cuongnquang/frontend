'use client'

import { ForwardRefExoticComponent, RefAttributes, useState } from 'react'
import {
    ChevronRight,
    LucideProps
} from 'lucide-react'
interface Specialty {
    id: number;
    name: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    doctors: number;
    hospitals: number;
    description: string;
    commonConditions: string[];
    averagePrice: string;
    color: string
}

export default function SpecialtyCard(specialty: Specialty) {
    return (
        <div key={specialty.id} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group">
            <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${specialty.color} rounded-lg flex items-center justify-center mr-4`}>
                    <specialty.icon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {specialty.name}
                    </h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span>{specialty.doctors} bác sĩ</span>
                        <span>•</span>
                        <span>{specialty.hospitals} bệnh viện</span>
                    </div>
                </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {specialty.description}
            </p>

            <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Bệnh thường gặp:</h4>
                <div className="flex flex-wrap gap-1">
                    {specialty.commonConditions.map((condition, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-700 rounded text-xs">
                            {condition}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
                <div>
                    <div className="text-lg font-bold text-green-600">
                        {specialty.averagePrice}
                    </div>
                    <div className="text-xs text-gray-500">Giá khám TB</div>
                </div>
                <div className="flex items-center text-blue-600 font-medium text-sm">
                    <span>Tìm hiểu thêm</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>

    )
}
