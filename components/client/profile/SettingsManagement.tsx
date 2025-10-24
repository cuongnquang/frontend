import { Shield, Bell, AlertTriangle, Trash2 } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

interface SettingsManagementProps {
    setShowChangePassword: Dispatch<SetStateAction<boolean>>
    setShowDeleteModal: Dispatch<SetStateAction<boolean>>
}

export default function SettingsManagement({ setShowChangePassword, setShowDeleteModal }: SettingsManagementProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Cài đặt Tài khoản</h1>
                <p className="text-gray-600 mt-1">Quản lý bảo mật, thông báo và các tùy chọn khác</p>
            </div>

            <div className="p-6 space-y-8">
                {/* Security Settings */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-blue-600" /> Bảo mật
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex-1">
                                <p className="font-medium text-gray-700">Đổi mật khẩu</p>
                                <p className="text-sm text-gray-500">Thay đổi mật khẩu tài khoản của bạn.</p>
                            </div>
                            <button
                                onClick={() => setShowChangePassword(true)}
                                className="px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                Đổi mật khẩu
                            </button>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex-1">
                                <p className="font-medium text-gray-700">Xác thực hai yếu tố (2FA)</p>
                                <p className="text-sm text-gray-500">Thêm một lớp bảo mật bổ sung cho tài khoản của bạn.</p>
                            </div>
                            <span className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                                Chưa kích hoạt
                            </span>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Notification Settings */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Bell className="w-5 h-5 mr-2 text-blue-600" /> Thông báo
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="font-medium text-gray-700">Nhận thông báo lịch hẹn qua Email</p>
                            <input type="checkbox" className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="font-medium text-gray-700">Nhận thông báo từ hệ thống (ưu đãi, cập nhật)</p>
                            <input type="checkbox" className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Danger Zone */}
                <div>
                    <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" /> Vùng Nguy Hiểm
                    </h2>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-medium text-red-700">Xóa Tài khoản</p>
                            <p className="text-sm text-red-500">Hành động này sẽ xóa vĩnh viễn dữ liệu tài khoản và không thể hoàn tác.</p>
                        </div>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-4 py-2 text-sm text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa tài khoản
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}