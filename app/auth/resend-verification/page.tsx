'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import Alert from '@/components/ui/Alert'
import InputField from '@/components/ui/InputField'
import { useAuth } from '@/contexts/AuthContext'

export default function ResendVerificationPage() {
    const { resendVerificationEmail, loading } = useAuth()
    
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | null; duration?: number }>({ 
        message: '', 
        type: null,
        duration: 5000
    })

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setAlert({ message: '', type: null, duration: 5000 })

        // Validation
        const newErrors: Record<string, string> = {}
        if (!email) {
            newErrors.email = 'Vui lòng nhập email'
        } else if (!validateEmail(email)) {
            newErrors.email = 'Email không hợp lệ'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            const result = await resendVerificationEmail(email)
            
            setAlert({ 
                message: result.message, 
                type: result.success ? 'success' : 'error',
                duration: result.success ? 6000 : 5000
            })

            if (result.success) {
                setEmail('') // Clear form on success
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Gửi email thất bại'
            setAlert({ 
                message: errorMessage, 
                type: 'error',
                duration: 5000
            })
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
                    Gửi lại email xác thực
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    Nhập email của bạn để nhận lại link xác thực
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        icon={<Mail />}
                        label="Email"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        error={errors.email}
                        placeholder="email@example.com"
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang gửi...
                            </span>
                        ) : (
                            'Gửi email xác thực'
                        )}
                    </button>

                    <Link 
                        href="/auth/login" 
                        className="w-full block text-center border border-blue-600 text-blue-700 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                        tabIndex={loading ? -1 : 0}
                    >
                        Quay lại đăng nhập
                    </Link>
                </form>

                <p className="mt-6 text-center text-gray-600 text-sm">
                    Chưa nhận được email?{' '}
                    <span className="text-gray-500">Kiểm tra thư mục spam hoặc chờ vài phút trước khi gửi lại.</span>
                </p>
            </div>

            {alert.type && (
                <Alert 
                    message={alert.message} 
                    type={alert.type} 
                    duration={alert.duration || 5000} 
                />
            )}
        </div>
    )
}