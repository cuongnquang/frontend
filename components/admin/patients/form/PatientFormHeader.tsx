import { X } from "lucide-react";

interface PatientFormProps {
    mode: 'create' | 'edit' | 'view'
    onClose: () => void
}

export default function PatientFormHeader({ mode, onClose }: PatientFormProps) {
    return (
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'create' ? 'Thêm Bệnh nhân Mới' :
                    mode === 'edit' ? 'Chỉnh sửa Thông tin Bệnh nhân' :
                        'Thông tin Bệnh nhân'}
            </h2>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
            >
                <X className="w-6 h-6" />
            </button>
        </div>
    )
}