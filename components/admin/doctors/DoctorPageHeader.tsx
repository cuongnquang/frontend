import React from 'react'
import { Plus, Download, Upload } from 'lucide-react'
interface DoctorPageHeaderProps {
    onAddDoctor: () => void
    onExport: (type: any) => void
    onImport: () => void
}

export default function DoctorPageHeader({ onAddDoctor, onExport, onImport }: DoctorPageHeaderProps) {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Bác sĩ 🧑‍⚕️</h1>
                <p className="text-gray-600">Quản lý hồ sơ, chuyên môn và lịch làm việc của đội ngũ bác sĩ.</p>
            </div>
            <div className="flex space-x-3">
                <button
                    onClick={onExport}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center transition"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Xuất Excel
                </button>
                <button
                    onClick={onImport}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center transition"
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Nhập Excel
                </button>
                <button
                    onClick={onAddDoctor}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Bác sĩ
                </button>
            </div>
        </div>
    )
}