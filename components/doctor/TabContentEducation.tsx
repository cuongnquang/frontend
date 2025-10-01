import React from 'react'
import { Doctor } from '@/types/types'
import { Globe } from 'lucide-react'

interface TabContentEducationProps {
    doctor: Doctor
}

// Re-use DetailList from TabContentExpertise or define here if not sharing
const DetailList: React.FC<{ title: string, items: string[] }> = ({ title, items }) => (
    <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
            <div className="w-1 h-6 bg-indigo-500 mr-3 rounded"></div>
            {title}
        </h3>
        <ul className="space-y-3 text-gray-700">
            {items.map((item, index) => (
                <li key={index} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium">{item}</span>
                </li>
            ))}
        </ul>
    </div>
)

export const TabContentEducation: React.FC<TabContentEducationProps> = ({ doctor }) => (
    <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
            <DetailList title="Quá trình Học vấn" items={doctor.education} />
            <DetailList title="Chứng chỉ & Giải thưởng" items={doctor.certifications} />
        </div>
        <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Ngôn ngữ giao tiếp</h3>
            <div className="flex flex-wrap gap-3">
                {doctor.languages.map((lang, index) => (
                    <span key={index} className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200">
                        <Globe className="w-4 h-4 inline mr-2" />
                        {lang}
                    </span>
                ))}
            </div>
        </div>
    </div>
)