'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import Alert from '@/components/ui/Alert'
import InputField from '@/components/ui/InputField'
import PasswordField from '@/components/ui/PasswordField'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterForm() {
    const router = useRouter()
    const { register, loading, user } = useAuth()
    
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | null; duration?: number }>({ 
        message: '', 
        type: null,
        duration: 2000
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    })

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push('/')
        }
    }, [user, router])

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setAlert({ message: '', type: null })
        
        const newErrors: Record<string, string> = {}

        // Validation
        if (!form.email) {
            newErrors.email = 'Vui lòng nhập email'
        } else if (!validateEmail(form.email)) {
            newErrors.email = 'Email không hợp lệ'
        }
        
        if (!form.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu'
        } else if (form.password.length < 8) {
            newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự'
        }
        
        if (!form.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp'
        }
        
        if (!form.agreeTerms) {
            newErrors.agreeTerms = 'Bạn cần đồng ý với điều khoản và chính sách'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            const result = await register(form.email, form.password, form.confirmPassword)
            
            if (result.success) {
                // Redirect to login immediately with success message
                router.push(`/auth/login?message=${encodeURIComponent(result.message)}&type=success`)
            } else {
                setAlert({ 
                    message: result.message, 
                    type: 'error'
                })
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Đăng ký thất bại'
            setAlert({ message: errorMessage, type: 'error' })
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Đăng ký</h1>
                <p className="text-center text-gray-600 mb-6">Tạo tài khoản để đặt lịch khám bệnh</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <InputField
                        icon={<Mail />}
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(v: any) => setForm({ ...form, email: v })}
                        error={errors.email}
                        placeholder="email@example.com"
                        disabled={loading}
                    />

                    {/* Password */}
                    <PasswordField
                        label="Mật khẩu"
                        value={form.password}
                        onChange={(v: any) => setForm({ ...form, password: v })}
                        show={showPassword}
                        setShow={setShowPassword}
                        error={errors.password}
                        disabled={loading}
                    />

                    {/* Confirm password */}
                    <PasswordField
                        label="Xác nhận mật khẩu"
                        value={form.confirmPassword}
                        onChange={(v: any) => setForm({ ...form, confirmPassword: v })}
                        show={showConfirmPassword}
                        setShow={setShowConfirmPassword}
                        error={errors.confirmPassword}
                        disabled={loading}
                    />

                    {/* Terms and Conditions */}
                    <div>
                        <label className="flex items-start text-sm text-gray-600">
                            <input
                                type="checkbox"
                                checked={form.agreeTerms}
                                onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                                disabled={loading}
                                className={`mr-2 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                                    errors.agreeTerms ? 'border-red-500' : ''
                                }`}
                            />
                            <span>
                                Tôi đồng ý với{' '}
                                <Link href="/terms" className="text-blue-600 hover:text-blue-700 underline">
                                    Điều khoản sử dụng
                                </Link>
                                {' '}và{' '}
                                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                                    Chính sách bảo mật
                                </Link>
                            </span>
                        </label>
                        {errors.agreeTerms && (
                            <p className="text-sm text-red-600 mt-1">{errors.agreeTerms}</p>
                        )}
                    </div>

                    {/* Submit Button */}
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
                                Đang tạo tài khoản...
                            </span>
                        ) : (
                            'Tạo tài khoản'
                        )}
                    </button>

                    {/* Back to Home */}
                    <Link 
                        href="/" 
                        className="w-full block text-center border border-blue-600 text-blue-700 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                        tabIndex={loading ? -1 : 0}
                    >
                        Quay về trang chủ
                    </Link>
                </form>

                {/* Login Link */}
                <p className="mt-6 text-center text-gray-600 text-sm">
                    Đã có tài khoản?{' '}
                    <Link 
                        href="/auth/login" 
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Đăng nhập ngay
                    </Link>
                </p>
            </div>

            {/* Alert */}
            {alert.type && (
                <Alert message={alert.message} type={alert.type} duration={2000} />
            )}
        </div>
    )
}