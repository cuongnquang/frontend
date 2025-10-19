import React from 'react'
import { Search } from 'lucide-react'

interface PatientFiltersProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
}

export default function PatientFilters({
    searchTerm,
    setSearchTerm,
}: PatientFiltersProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm bệnh nhân</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên, mã BN, SĐT, CMND..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}