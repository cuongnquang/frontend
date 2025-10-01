import React from 'react'
import { Doctor } from '@/types/types'
import { MapPin, Video, CheckCircle } from 'lucide-react'

interface TabContentExpertiseProps {
    doctor: Doctor
}

// Component helper đã được tách ra
const DetailList: React.FC<{ title: string, items: string[] }> = ({ title, items }) => (
    <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
            <div className="w-1 h-6 bg-indigo-500 mr-3 rounded"></div>
            {title}
        </h3>
        <ul className="space-y-3 text-gray-700">
            {items.map((item, index) => (
                <li key={index} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="font-medium">{item}</span>
                </li>
            ))}
        </ul>
    </div>
)

export const TabContentExpertise: React.FC<TabContentExpertiseProps> = ({ doctor }) => (
    <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
            <DetailList title="Các bệnh lý thường điều trị" items={doctor.specialConditions} />
            <DetailList title="Các thủ thuật/dịch vụ" items={doctor.procedures} />
        </div>
        <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Dịch vụ khả dụng</h3>
            <div className="grid grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border-2 text-center ${doctor.services.inPerson ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                    <MapPin className={`w-6 h-6 mx-auto mb-2 ${doctor.services.inPerson ? 'text-green-600' : 'text-gray-400'}`} />
                    <p className="font-medium">Khám trực tiếp</p>
                </div>
                <div className={`p-4 rounded-lg border-2 text-center ${doctor.services.online ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                    <Video className={`w-6 h-6 mx-auto mb-2 ${doctor.services.online ? 'text-green-600' : 'text-gray-400'}`} />
                    <p className="font-medium">Tư vấn online</p>
                </div>
                <div className={`p-4 rounded-lg border-2 text-center ${doctor.services.homeVisit ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                    <MapPin className={`w-6 h-6 mx-auto mb-2 ${doctor.services.homeVisit ? 'text-green-600' : 'text-gray-400'}`} />
                    <p className="font-medium">Khám tại nhà</p>
                </div>
            </div>
        </div>
    </div>
)