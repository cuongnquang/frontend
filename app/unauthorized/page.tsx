'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { Shield, ArrowLeft, Home } from 'lucide-react'

export default function UnauthorizedPage() {
    const router = useRouter()
    const { user, logout } = useAuth()

    const handleGoHome = () => {
        if (user) {
            // Redirect to appropriate dashboard based on user role
            const dashboardUrls: Record<string, string> = {
                'admin': '/admin/dashboard',
                'doctor': '/doctor/dashboard',
                'patient': '/'
            }
            router.push(dashboardUrls[user.role] || '/')
        } else {
            router.push('/')
        }
    }

    const handleGoBack = () => {
        router.back()
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Icon */}
                    <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <Shield className="w-10 h-10 text-red-600" />
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Không có quyền truy cập
                    </h1>

                    {/* Message */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên
                        hoặc đăng nhập với tài khoản có quyền phù hợp.
                    </p>

                    {/* User Info */}
                    {user && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-600">Tài khoản hiện tại:</p>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">
                                Vai trò: {user.role === 'admin' ? 'Quản trị viên' :
                                    user.role === 'doctor' ? 'Bác sĩ' :
                                        user.role === 'patient' ? 'Bệnh nhân' : user.role}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={handleGoHome}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Về trang chủ
                        </button>

                        <button
                            onClick={handleGoBack}
                            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại
                        </button>

                        {user && (
                            <button
                                onClick={logout}
                                className="w-full text-red-600 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors text-sm"
                            >
                                Đăng xuất và đăng nhập tài khoản khác
                            </button>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                            Cần hỗ trợ? Liên hệ:{' '}
                            <a href="tel:1900-2805" className="text-blue-600 font-medium">
                                1900-2805
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}