import { PatientActionFormProps } from "./PatientFormType";

export function PatientFormActions({ onClose, isReadOnly, mode }: PatientActionFormProps) {
    return (
        <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
                {isReadOnly ? 'Đóng' : 'Hủy'}
            </button>
            {!isReadOnly && (
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    {mode === 'create' ? 'Thêm Bệnh nhân' : 'Cập nhật'}
                </button>
            )}
        </div>
    )
}