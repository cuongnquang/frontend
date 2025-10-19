import { Specialty, Doctor } from '@/types/types'
import AllSpecialtiesGrid from './AllSpecialtiesGrid'
import SelectedSpecialtyDetail from './SelectedSpecialtyDetail'

interface SpecialtyMainContentProps {
    Specialties: Specialty[]
    filteredDoctors: Doctor[]
    selectedSpecialty: string | null
    setSelectedSpecialty: (id: string) => void
    activeTab: 'overview' | 'doctors'
    setActiveTab: (tab: 'overview' | 'doctors') => void
    getDoctorCount: (specialtyId: string) => number
}

export default function SpecialtyMainContent({
    Specialties,
    filteredDoctors,
    selectedSpecialty,
    setSelectedSpecialty,
    activeTab,
    setActiveTab,
    getDoctorCount,
}: SpecialtyMainContentProps) {
    const selectedSpecialtyData = Specialties.find((s: Specialty) => s.specialty_id === selectedSpecialty)

    return (
        <div>
            {/* Overview Tab - All Specialties Grid */}
            {selectedSpecialty === null && (
                <AllSpecialtiesGrid
                    Specialties={Specialties}
                    getDoctorCount={getDoctorCount}
                    setSelectedSpecialty={setSelectedSpecialty}
                />
            )}

            {/* Selected Specialty Detail */}
            {selectedSpecialty && selectedSpecialtyData && (
                <SelectedSpecialtyDetail
                    selectedSpecialtyData={selectedSpecialtyData}
                    filteredDoctors={filteredDoctors}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    getDoctorCount={getDoctorCount}
                />
            )}
        </div>
    )
}