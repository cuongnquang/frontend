import React from 'react'
import { Search, Filter, Eye, Edit, Heart, AlertTriangle, Phone, Mail, User } from 'lucide-react'
import { Patient } from '@/types/types' // Import interface Patient

interface PatientTableProps {
    patients: Patient[]
    searchTerm: string
    setSearchTerm: (term: string) => void
    statusFilter: string
    setStatusFilter: (status: string) => void
    riskFilter: string
    setRiskFilter: (risk: string) => void
    onViewDetails: (patient: Patient) => void
}

const getRiskColor = (risk: string) => {
    switch (risk) {
        case 'low': return 'text-green-600 bg-green-100'
        case 'medium': return 'text-yellow-600 bg-yellow-100'
        case 'high': return 'text-red-600 bg-red-100'
        default: return 'text-gray-600 bg-gray-100'
    }
}

const getRiskText = (risk: string) => {
    switch (risk) {
        case 'low': return 'Thấp'
        case 'medium': return 'Trung bình'
        case 'high': return 'Cao'
        default: return risk
    }
}

const getRiskIcon = (risk: string) => {
    switch (risk) {
        case 'low': return <Heart className="w-4 h-4" />
        case 'medium': return <AlertTriangle className="w-4 h-4" />
        case 'high': return <AlertTriangle className="w-4 h-4" />
        default: return <Heart className="w-4 h-4" />
    }
}

const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birth = new Date(dateOfBirth)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
    }
    return age
}

export const PatientTable: React.FC<PatientTableProps> = ({
    patients,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    riskFilter,
    setRiskFilter,
    onViewDetails,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, ID, SĐT..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Lọc theo:</span>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                    </select>
                    <select
                        value={riskFilter}
                        onChange={(e) => setRiskFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả nguy cơ</option>
                        <option value="high">Nguy cơ Cao</option>
                        <option value="medium">Nguy cơ Trung bình</option>
                        <option value="low">Nguy cơ Thấp</option>
                    </select>
                </div>
            </div>

            {/* Patient Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên bệnh nhân</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thông tin liên hệ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tuổi</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nguy cơ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {patients.length > 0 ? (
                            patients.map(patient => (
                                <tr key={patient.user_id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.user_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <User className="w-5 h-5 text-gray-500 mr-2" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{patient.User.name}</div>
                                                <div className="text-xs text-gray-500">{patient.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <Phone className="w-4 h-4" /><span>{patient.phone_number}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Mail className="w-4 h-4" /><span>{patient.User.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateAge(patient.date_of_birth)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getRiskColor(patient.riskLevel)}`}>
                                            {getRiskIcon(patient.riskLevel)}
                                            <span className="ml-1">{getRiskText(patient.riskLevel)}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => onViewDetails(patient)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                                title="Xem chi tiết"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button className="text-blue-600 hover:text-blue-900" title="Chỉnh sửa">
                                                <Edit className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">
                                    Không tìm thấy bệnh nhân nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}