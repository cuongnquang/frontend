import { Download, Plus, Upload } from 'lucide-react'
import React from 'react'
interface AppointmentPageHaderProps {
    onAdd: () => void
    onExport: (type: any) => void
    onImport: () => void
}

export default function AppointmentHeader( { onAdd, onExport, onImport }: AppointmentPageHaderProps ) {
    return (
       <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Lịch hẹn</h1>
                <p className="text-gray-600">Quản lý thông tin và hồ sơ lịch hẹn</p>
            </div>
            <div className="flex space-x-3">
                <button
                    onClick={onExport}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Xuất Excel
                </button>
                <button
                    onClick={onImport}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center"
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Nhập Excel
                </button>
                <button
                    onClick={onAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Lịch hẹn
                </button>
            </div>
        </div>
    )
}