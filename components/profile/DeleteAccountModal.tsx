import { AlertTriangle, Trash2, X } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

interface DeleteAccountModalProps {
    showDeleteModal: boolean
    setShowDeleteModal: Dispatch<SetStateAction<boolean>>
    isDeleting: boolean
    handleDeleteAccount: () => Promise<void>
}

export default function DeleteAccountModal({
    showDeleteModal,
    setShowDeleteModal,
    isDeleting,
    handleDeleteAccount
}: DeleteAccountModalProps) {

    if (!showDeleteModal) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity" onClick={() => setShowDeleteModal(false)}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 transform transition-all" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-red-600" /> Xóa Tài khoản Vĩnh viễn
                    </h3>
                    <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body - Warning */}
                <div className="p-6 text-center">
                    <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-900 mb-2">Bạn có chắc chắn muốn xóa tài khoản?</p>
                    <p className="text-sm text-gray-600">
                        Hành động này là **vĩnh viễn** và không thể phục hồi. Tất cả thông tin cá nhân và hồ sơ y tế sẽ bị xóa khỏi hệ thống.
                    </p>
                </div>

                {/* Footer - Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 rounded-b-xl">
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                        disabled={isDeleting}
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                    >
                        {isDeleting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Đang xóa...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Xác nhận Xóa
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}