// components/admin/doctors/form/DoctorFormHeader.tsx
import { X } from 'lucide-react'

interface DoctorFormHeaderProps {
    mode: 'create' | 'view'
    onClose: () => void
}

export function DoctorFormHeader({ mode, onClose }: DoctorFormHeaderProps) {
    return (
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    {mode === 'create' ? 'Thêm Bác sĩ Mới' : 'Thông tin Bác sĩ'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    {mode === 'create' 
                        ? 'Thêm bác sĩ mới vào hệ thống (mặc định chưa kích hoạt)' 
                        : 'Xem thông tin chi tiết của bác sĩ'
                    }
                </p>
            </div>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition"
                aria-label="Close form"
            >
                <X className="w-6 h-6" />
            </button>
        </div>
    )
}