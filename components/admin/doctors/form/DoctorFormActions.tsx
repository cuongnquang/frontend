// components/admin/doctors/form/DoctorFormActions.tsx
interface DoctorFormActionsProps {
    mode: 'create' | 'view'
    onClose: () => void
    isReadOnly: boolean
}

export function DoctorFormActions({ mode, onClose, isReadOnly }: DoctorFormActionsProps) {
    return (
        <div className="flex justify-end space-x-3 pt-6 border-t">
            {/* Nút Hủy/Đóng */}
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
                {isReadOnly ? 'Đóng' : 'Hủy'}
            </button>

            {/* Nút Gửi/Lưu (chỉ hiển thị khi không ở chế độ xem) */}
            {!isReadOnly && (
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                    {mode === 'create' ? 'Thêm Bác sĩ' : 'Lưu Thay đổi'}
                </button>
            )}
        </div>
    )
}