import { Specialty, Doctor } from '@/types/types'
import AllSpecialtiesGrid from './AllSpecialtiesGrid'
import SelectedSpecialtyDetail from './SelectedSpecialtyDetail'

interface SpecialtyMainContentProps {
    Specialties: Specialty[]
    filteredDoctors: Doctor[]
    selectedSpecialty: string | null
    setSelectedSpecialty: (id: string | null) => void
    activeTab: 'overview' | 'doctors'
    setActiveTab: (tab: 'overview' | 'doctors') => void
    doctorCounts: Map<string, number> // Giữ lại prop này
}

export default function SpecialtyMainContent({
    Specialties,
    filteredDoctors,
    selectedSpecialty,
    setSelectedSpecialty,
    activeTab,
    setActiveTab,
    doctorCounts,
}: SpecialtyMainContentProps) {
    const selectedSpecialtyData = Specialties.find((s: Specialty) => s.name === selectedSpecialty)

    return (
        <div>
            {/* Overview Tab - All Specialties Grid */}
             {selectedSpecialty === null ? (
                <AllSpecialtiesGrid
                    Specialties={Specialties}
                    doctorCounts={doctorCounts}
                    setSelectedSpecialty={setSelectedSpecialty}
                />
            ) : (
                /* Nếu có chuyên khoa được chọn, hiển thị chi tiết chuyên khoa đó */
                selectedSpecialtyData && (
                    <SelectedSpecialtyDetail
                        selectedSpecialtyData={selectedSpecialtyData}
                        filteredDoctors={filteredDoctors}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        getDoctorCount={(specialtyName) => doctorCounts.get(specialtyName) || 0}
                    />
                )
            )}

        </div>
    )
}