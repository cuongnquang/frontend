import React from 'react'
import { Hospital } from '@/components/client/hospitals/HospitalType'
import { Clock, MapPin, Phone, Calendar, Users } from 'lucide-react'

interface HospitalSidebarCardProps {
    hospital: Hospital
}

export default function HospitalSidebarCard({ hospital }: HospitalSidebarCardProps) {
    const detailItem = (Icon: React.ElementType, label: string, value: string) => (
        <div className="flex items-start py-3 border-b border-gray-100 last:border-b-0">
            <Icon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-lg font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    )

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">Thông tin liên hệ</h3>

            {detailItem(Phone, 'Số điện thoại', hospital.phone)}

            <div className="py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                    <Clock className="w-5 h-5 text-blue-600 mr-2" /> Giờ làm việc
                </p>
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">Thứ 2 - Thứ 6:</span> {hospital.workingHours.weekday}
                </p>
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">Thứ 7 - Chủ nhật:</span> {hospital.workingHours.weekend}
                </p>
                {hospital.emergencyAvailable && (
                    <p className="mt-2 text-sm font-semibold text-red-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" /> Cấp cứu 24/7
                    </p>
                )}
            </div>

            {detailItem(Users, 'Đội ngũ bác sĩ', `${hospital.doctors} người`)}
            {detailItem(MapPin, 'Địa chỉ chính', hospital.address)}
        </div>
    )
}