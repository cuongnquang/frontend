'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function VerifyEmailPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { verifyEmail } = useAuth() 
    
    const hasVerified = useRef(false);

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const token = searchParams.get('token');

        const verify = async () => {

            if (hasVerified.current) {
                return;
            }

            hasVerified.current = true;

            if (!token) {
                setStatus('error')
                setMessage('Token xác thực không hợp lệ hoặc đã bị thiếu.')
                return
            }

            try {
                const result = await verifyEmail(token)
                
                if (result.success) {
                    setStatus('success')
                    setMessage(result.message || 'Email của bạn đã được xác thực thành công.')
                    router.push('/auth/login?message=' + encodeURIComponent('Email đã được xác thực. Vui lòng đăng nhập.') + '&type=success')
                } else {
                    setStatus('error')
                    setMessage(result.message || 'Token không hợp lệ hoặc đã hết hạn.')
                }
            } catch (err) {
                setStatus('error')
                setMessage('Đã có lỗi xảy ra. Vui lòng kiểm tra lại kết nối mạng.')
            }
        }

        verify()

    }, [searchParams, router, verifyEmail])
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Đang xác thực email...
                        </h1>
                        <p className="text-gray-600">
                            Vui lòng chờ trong giây lát
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
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
                    </>
                )}

                {status === 'error' && (
                    <>
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
                                Gửi lại email xác thực
                            </Link>
                            <Link 
                                href="/auth/login"
                                className="block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}