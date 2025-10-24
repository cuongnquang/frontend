import { Doctor } from '@/types/types'
import DoctorCard from './DoctorCard'

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
                <div className="text-center text-gray-500 text-sm py-8">
                    Không có bác sĩ phù hợp
                </div>
            )}
        </div>
    )
}