import { Search } from 'lucide-react'
import { Specialty, Doctor } from '@/types/types'
import SpecialtyListItem from './SpecialtyListItem'

interface SpecialtySidebarProps {
    Specialties: Specialty[]
    Doctors: Doctor[]
    selectedSpecialty: string | null
    setSelectedSpecialty: (id: string | null) => void
    setActiveTab: (tab: 'overview' | 'doctors') => void
    searchQuery: string
    setSearchQuery: (query: string) => void
}

export default function SpecialtySidebar({
    Specialties,
    Doctors,
    selectedSpecialty,
    setSelectedSpecialty,
    setActiveTab,
    searchQuery,
    setSearchQuery,
}: SpecialtySidebarProps) {
    // Get doctors count by specialty
    const getDoctorCount = (specialtyId: string) => {
        return Doctors.filter(d => d.specialty_id === specialtyId).length
    }

    const handleSelectAll = () => {
        setSelectedSpecialty(null)
        setActiveTab('overview')
    }

    const handleSelectSpecialty = (specialtyId: string) => {
        setSelectedSpecialty(specialtyId)
        setActiveTab('overview')
    }

    const filteredSpecialties = Specialties.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div>
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Danh sách chuyên khoa
                </h2>

                {/* Search specialties */}
                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm chuyên khoa..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {/* All Specialties button */}
                    <button
                        onClick={handleSelectAll}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedSpecialty === null
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'hover:bg-gray-50 text-gray-700'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Tất cả chuyên khoa</span>
                            <span className="text-sm text-gray-500">
                                {Doctors.length} bác sĩ
                            </span>
                        </div>
                    </button>

                    {/* Specialty List */}
                    {filteredSpecialties.map((specialty: Specialty) => (
                        <SpecialtyListItem
                            key={specialty.specialty_id}
                            specialty={specialty}
                            doctorCount={getDoctorCount(specialty.specialty_id)}
                            isSelected={selectedSpecialty === specialty.specialty_id}
                            onClick={() => handleSelectSpecialty(specialty.specialty_id)}
                        />
                    ))}
                    {filteredSpecialties.length === 0 && searchQuery && (
                        <div className="text-center text-gray-500 text-sm py-4">
                            Không tìm thấy chuyên khoa phù hợp với {searchQuery}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Thống kê tổng quan</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Tổng số bác sĩ:</span>
                        <span className="font-semibold text-blue-600">
                            {Doctors.length}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Số chuyên khoa:</span>
                        <span className="font-semibold text-green-600">
                            {Specialties.length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}