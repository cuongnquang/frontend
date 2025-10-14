import { Specialty, Doctor } from '@/types/types'
import AllSpecialtiesGrid from './AllSpecialtiesGrid'
import SelectedSpecialtyDetail from './SelectedSpecialtyDetail'

interface SpecialtyMainContentProps {
    mockSpecialties: Specialty[]
    filteredDoctors: Doctor[]
    selectedSpecialty: string | null
    setSelectedSpecialty: (id: string) => void
    activeTab: 'overview' | 'doctors'
    setActiveTab: (tab: 'overview' | 'doctors') => void
    getDoctorCount: (specialtyId: string) => number
}

export default function SpecialtyMainContent({
    mockSpecialties,
    filteredDoctors,
    selectedSpecialty,
    setSelectedSpecialty,
    activeTab,
    setActiveTab,
    getDoctorCount,
}: SpecialtyMainContentProps) {
    const selectedSpecialtyData = mockSpecialties.find((s: Specialty) => s.specialty_id === selectedSpecialty)

    return (
        <div className="lg:w-2/3">
            {/* Overview Tab - All Specialties Grid */}
            {selectedSpecialty === null && (
                <AllSpecialtiesGrid
                    mockSpecialties={mockSpecialties}
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