import { X } from 'lucide-react'

interface AppointmentFormHeaderProps {
    mode: 'create' | 'edit' | 'view'
    onClose: () => void
}

export function AppointmentFormHeader({ mode, onClose }: AppointmentFormHeaderProps) {
    const title = {
        create: 'Tạo Lịch hẹn Mới',
        edit: 'Chỉnh sửa Lịch hẹn',
        view: 'Thông tin Lịch hẹn'
    }

    return (
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
            <h2 className="text-2xl font-bold text-gray-900">{title[mode]}</h2>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close form"
            ><X className="w-6 h-6" /></button>
        </div>
    )
}