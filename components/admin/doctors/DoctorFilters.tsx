import React from 'react'
import { Search, Filter } from 'lucide-react'

interface DoctorFiltersProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    statusFilter: string
    setStatusFilter: (status: string) => void
    specializationFilter: string
    setSpecializationFilter: (spec: string) => void
    availableSpecializations: string[]
}

export default function DoctorFilters({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    specializationFilter,
    setSpecializationFilter,
    availableSpecializations
}: DoctorFiltersProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm (Tên, Mã, SĐT)</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tên, mã BS, số điện thoại..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Specialization Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên khoa</label>
                    <select
                        value={specializationFilter}
                        onChange={(e) => setSpecializationFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Tất cả Chuyên khoa</option>
                        {availableSpecializations.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái làm việc</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Tất cả</option>
                        <option value="active">Đang làm việc</option>
                        <option value="inactive">Đã nghỉ</option>
                    </select>
                </div>
            </div>
        </div>
    )
}