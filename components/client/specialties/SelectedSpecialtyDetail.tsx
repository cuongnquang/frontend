import { Specialty, Doctor } from '@/types/types'
import SpecialtyHeader from './SpecialtyHeader'
import SpecialtyTabs from './SpecialtyTabs'
import SpecialtyOverview from './SpecialtyOverview'
import DoctorList from './DoctorList'

interface SelectedSpecialtyDetailProps {
    selectedSpecialtyData: Specialty
    filteredDoctors: Doctor[]
    activeTab: 'overview' | 'doctors'
    setActiveTab: (tab: 'overview' | 'doctors') => void
    getDoctorCount: (specialtyId: string) => number
}

export default function SelectedSpecialtyDetail({
    selectedSpecialtyData,
    filteredDoctors,
    activeTab,
    setActiveTab,
    getDoctorCount,
}: SelectedSpecialtyDetailProps) {
    const doctorCount = getDoctorCount(selectedSpecialtyData.specialty_id)

    return (
        <div>
            <SpecialtyHeader specialtyData={selectedSpecialtyData} doctorCount={doctorCount} />

            <SpecialtyTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                doctorCount={filteredDoctors.length}
            >
                {activeTab === 'overview' && (
                    <SpecialtyOverview specialtyData={selectedSpecialtyData} />
                )}
                {activeTab === 'doctors' && (
                    <DoctorList filteredDoctors={filteredDoctors} />
                )}
            </SpecialtyTabs>
        </div>
    )
}