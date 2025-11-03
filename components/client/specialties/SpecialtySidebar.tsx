import { Search } from 'lucide-react'
import { Specialty } from '@/types/types'
import SpecialtyListItem from './SpecialtyListItem'

interface SpecialtySidebarProps {
    Specialties: Specialty[]
    doctorCounts: Map<string, number>
    selectedSpecialty: string | null
    setSelectedSpecialty: (id: string | null) => void
    setActiveTab: (tab: 'overview' | 'doctors') => void
    searchQuery: string
    setSearchQuery: (query: string) => void
}

export default function SpecialtySidebar({
    Specialties = [],
    doctorCounts,
    selectedSpecialty,
    setSelectedSpecialty,
    searchQuery,
    setSearchQuery,
}: SpecialtySidebarProps) {
    const handleSelectAll = () => {
        setSelectedSpecialty(null)
    }

    const handleSelectSpecialty = (specialtyId: string) => {
        setSelectedSpecialty(specialtyId)
    }

    const totalDoctors = Array.from(doctorCounts.values()).reduce(
        (sum, count) => sum + count, 0
    )

    const filteredSpecialties = Specialties.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Chuyên khoa
                </h2>

                {/* Search */}
                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                    {/* All Specialties */}
                    <button
                        onClick={handleSelectAll}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                            selectedSpecialty === null
                                ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm'
                                : 'hover:bg-gray-50 text-gray-700'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">Tất cả</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                                selectedSpecialty === null 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-200 text-gray-600'
                            }`}>
                                {totalDoctors}
                            </span>
                        </div>
                    </button>

                    {/* Specialty List */}
                    {filteredSpecialties.map((specialty: Specialty) => (
                        <SpecialtyListItem
                            key={specialty.id}
                            specialty={specialty}
                            doctorCount={doctorCounts.get(specialty.name) || 0}
                            isSelected={selectedSpecialty === specialty.name}
                            onClick={() => handleSelectSpecialty(specialty.name)}
                        />
                    ))}
                    {filteredSpecialties.length === 0 && searchQuery && (
                        <div className="text-center text-gray-500 text-sm py-8">
                            Không tìm thấy kết quả
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-5 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm">Thống kê</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <span className="text-gray-600 text-sm">Bác sĩ</span>
                        <span className="font-bold text-blue-600 text-lg">
                            {totalDoctors}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <span className="text-gray-600 text-sm">Chuyên khoa</span>
                        <span className="font-bold text-indigo-600 text-lg">
                            {Specialties.length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}