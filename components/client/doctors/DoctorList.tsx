
'use client'

import DoctorCard from '@/components/doctor/DoctorCard'
import { Doctor } from '@/types/types'

interface DoctorListProps {
    doctors: Doctor[]
}

export default function DoctorList({ doctors }: DoctorListProps) {
    return (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
                <DoctorCard
                    key={doctor.doctor_id}
                    variant="compact"
                    doctor={(doctor)}
                />
            ))}
        </div>
    )
}
