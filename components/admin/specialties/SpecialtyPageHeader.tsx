import React from 'react'
import { Plus, Download } from 'lucide-react'

interface SpecialtyPageHeaderProps {
    onAddSpecialty: () => void
    // onExport: () => void
}

export default function SpecialtyPageHeader({ onAddSpecialty }: SpecialtyPageHeaderProps) {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Chuyên khoa 🏥</h1>
                <p className="text-gray-600">Quản lý danh mục chuyên khoa, trưởng khoa và số lượng bác sĩ.</p>
            </div>
            <div className="flex space-x-3">
                {/* <button
                    onClick={onExport}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center transition"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Xuất Excel
                </button> */}
                <button
                    onClick={onAddSpecialty}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center transition"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Chuyên khoa
                </button>
            </div>
        </div>
    )
}