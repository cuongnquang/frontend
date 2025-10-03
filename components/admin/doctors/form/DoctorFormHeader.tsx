import { X } from 'lucide-react'

interface DoctorFormHeaderProps {
    mode: 'create' | 'edit' | 'view'
    onClose: () => void
}

export function DoctorFormHeader({ mode, onClose }: DoctorFormHeaderProps) {
    return (
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
            <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'create' ? 'Thêm Bác sĩ Mới' :
                    mode === 'edit' ? 'Chỉnh sửa Thông tin Bác sĩ' :
                        'Thông tin Bác sĩ'}
            </h2>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close form"
            >
                <X className="w-6 h-6" />
            </button>
        </div>
    )
}