'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle } from 'lucide-react'
import { apiClient } from '@/lib/api'

export default function VerifyEmailPage() {
    const router = useRouter()
    
    const [status, setStatus] = useState<'input' | 'success' | 'error'>('input')
    const [message, setMessage] = useState('')
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmitOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!otp || otp.trim().length === 0) {
            setMessage('Vui lòng nhập mã OTP')
            setStatus('error')
            return
        }

        setLoading(true)
        try {
            const result = await apiClient('/api/auth/verify-email', {
                method: 'POST',
                body: JSON.stringify({ otp }),
            })
            
            if (result.status) {
                setStatus('success')
                setMessage(result.message || 'Email của bạn đã được xác thực thành công.')
                setTimeout(() => {
                    router.push('/auth/login?message=' + encodeURIComponent('Email đã được xác thực. Vui lòng đăng nhập.') + '&type=success')
                }, 2000)
            } else {
                setStatus('error')
                setMessage(result.message || 'Mã OTP không hợp lệ hoặc đã hết hạn.')
            }
        } catch (err) {
            setStatus('error')
            setMessage('Đã có lỗi xảy ra. Vui lòng kiểm tra lại kết nối mạng.')
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                {status === 'input' && (
                    <>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                            Xác thực Email
                        </h1>
                        <p className="text-gray-600 text-center mb-6">
                            Vui lòng nhập mã OTP đã được gửi
                        </p>
                        
                        <form onSubmit={handleSubmitOTP} className="space-y-4">
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                    Mã OTP
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    maxLength={6}
                                    placeholder="Nhập 6 chữ số"
                                    value={otp}
                                    onChange={(e) => {
                                        setOtp(e.target.value.replace(/\D/g, ''))
                                        setMessage('')
                                        setStatus('input')
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-center text-2xl tracking-widest font-mono"
                                    disabled={loading}
                                />
                            </div>

                            {message && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 text-sm">{message}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                            >
                                {loading ? 'Đang xác thực...' : 'Xác thực'}
                            </button>
                        </form>

                        <div className="mt-6 space-y-3 text-center">
                            <p className="text-sm text-gray-500">
                                Không nhận được mã?
                            </p>
                            <Link 
                                href="/auth/resend-verification"
                                className="block text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Gửi lại mã OTP
                            </Link>
                        </div>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="text-center">
                            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Xác thực thành công!
                            </h1>
                            <p className="text-gray-600 mb-6">
                                {message}
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                Đang chuyển hướng đến trang đăng nhập...
                            </p>
                            <Link 
                                href="/auth/login"
                                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Đăng nhập ngay
                            </Link>
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="text-center">
                            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Xác thực thất bại
                            </h1>
                            <p className="text-gray-600 mb-6">
                                {message}
                            </p>
                            <div className="space-y-3">
                                <Link 
                                    href="/auth/resend-verification"
                                    className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Gửi lại mã OTP
                                </Link>
                                <Link 
                                    href="/auth/login"
                                    className="block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Quay lại đăng nhập
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}