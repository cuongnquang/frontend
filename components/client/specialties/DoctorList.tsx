import { Doctor } from '@/types/types'
import DoctorCard from './DoctorCard'
import { User } from 'lucide-react'

interface DoctorListProps {
    filteredDoctors: Doctor[]
}

export default function DoctorList({ filteredDoctors }: DoctorListProps) {
    return (
        <div className="space-y-4">
            {filteredDoctors.map((doctor: Doctor) => (
                <DoctorCard 
                    key={doctor.id} 
                    doctor={doctor} 
                />
            ))}
            {filteredDoctors.length === 0 && (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">Không tìm thấy bác sĩ phù hợp</p>
                </div>
            )}
        </div>
    )
}