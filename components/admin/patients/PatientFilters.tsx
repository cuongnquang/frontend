import React from 'react'
import { Search } from 'lucide-react'

interface PatientFiltersProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    statusFilter: string
    setStatusFilter: (status: string) => void
    riskFilter: string
    setRiskFilter: (risk: string) => void
}

export default function PatientFilters({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    riskFilter,
    setRiskFilter,
}: PatientFiltersProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tên, mã BN, SĐT..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Tất cả</option>
                        <option value="active">Đang theo dõi</option>
                        <option value="inactive">Không hoạt động</option>
                    </select>
                </div>

                {/* Risk Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mức rủi ro</label>
                    <select
                        value={riskFilter}
                        onChange={(e) => setRiskFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Tất cả</option>
                        <option value="low">Thấp</option>
                        <option value="medium">Trung bình</option>
                        <option value="high">Cao</option>
                    </select>
                </div>
            </div>
        </div>
    )
}