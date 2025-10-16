import { Lock, X, Eye, EyeOff } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

interface ChangePasswordModalProps {
    showChangePassword: boolean
    setShowChangePassword: Dispatch<SetStateAction<boolean>>
    isLoading: boolean
    handleChangePassword: () => Promise<void>
    passwordForm: {
        currentPassword: string
        newPassword: string
        confirmPassword: string
    }
    setPasswordForm: Dispatch<SetStateAction<any>> // Simplified type for setPasswordForm
    showPasswords: { [key: string]: boolean }
    setShowPasswords: Dispatch<SetStateAction<any>> // Simplified type for setShowPasswords
}

export default function ChangePasswordModal({
    showChangePassword,
    setShowChangePassword,
    isLoading,
    handleChangePassword,
    passwordForm,
    setPasswordForm,
    showPasswords,
    setShowPasswords
}: ChangePasswordModalProps) {

    if (!showChangePassword) return null

    const handleToggleShow = (field: string) => {
        setShowPasswords((prev: any) => ({ ...prev, [field]: !prev[field] }))
    }

    const isFormValid =
        passwordForm.currentPassword.length > 0 &&
        passwordForm.newPassword.length >= 8 &&
        passwordForm.newPassword === passwordForm.confirmPassword

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity" onClick={() => setShowChangePassword(false)}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <Lock className="w-5 h-5 mr-2 text-blue-600" /> Đổi mật khẩu
                    </h3>
                    <button onClick={() => setShowChangePassword(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body - Form */}
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">Mật khẩu mới phải có ít nhất 8 ký tự.</p>

                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                        <div className="relative">
                            <input
                                type={showPasswords.current ? 'text' : 'password'}
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm((prev: any) => ({ ...prev, currentPassword: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập mật khẩu hiện tại"
                                disabled={isLoading}
                            />
                            <button type="button" onClick={() => handleToggleShow('current')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                                {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? 'text' : 'password'}
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm((prev: any) => ({ ...prev, newPassword: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Tối thiểu 8 ký tự"
                                disabled={isLoading}
                            />
                            <button type="button" onClick={() => handleToggleShow('new')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                                {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm((prev: any) => ({ ...prev, confirmPassword: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập lại mật khẩu mới"
                                disabled={isLoading}
                            />
                            <button type="button" onClick={() => handleToggleShow('confirm')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                                {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {passwordForm.confirmPassword.length > 0 && passwordForm.newPassword !== passwordForm.confirmPassword && (
                            <p className="mt-1 text-xs text-red-500">Mật khẩu xác nhận không khớp.</p>
                        )}
                    </div>
                </div>

                {/* Footer - Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 rounded-b-xl">
                    <button
                        onClick={() => setShowChangePassword(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleChangePassword}
                        disabled={isLoading || !isFormValid}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Đang lưu...
                            </>
                        ) : (
                            'Lưu mật khẩu mới'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}