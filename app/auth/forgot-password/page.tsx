'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Mail,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    Clock,
    Shield,
    RefreshCw,
    Lock,
    Eye,
    EyeOff,
    Key
} from 'lucide-react'

type Step = 'email' | 'verification' | 'reset' | 'success'

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState<Step>('email')
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [email, setEmail] = useState('')
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [countdown, setCountdown] = useState(0)

    // Validation functions
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validatePassword = (password: string) => {
        const hasLength = password.length >= 8
        const hasUpper = /[A-Z]/.test(password)
        const hasLower = /[a-z]/.test(password)
        const hasNumber = /\d/.test(password)
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

        return {
            isValid: hasLength && hasUpper && hasLower && hasNumber,
            checks: {
                length: hasLength,
                upper: hasUpper,
                lower: hasLower,
                number: hasNumber,
                special: hasSpecial
            }
        }
    }

    // Handle email submission
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors({})

        if (!email) {
            setErrors({ email: 'Vui lòng nhập email' })
            setIsLoading(false)
            return
        }

        if (!validateEmail(email)) {
            setErrors({ email: 'Email không hợp lệ' })
            setIsLoading(false)
            return
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Mock success
            console.log('Password reset email sent to:', email)
            setCurrentStep('verification')
            startCountdown()
        } catch (error) {
            setErrors({ general: 'Có lỗi xảy ra. Vui lòng thử lại.' })
        } finally {
            setIsLoading(false)
        }
    }

    // Handle verification code
    const handleVerificationSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors({})

        const code = verificationCode.join('')
        if (code.length !== 6) {
            setErrors({ code: 'Vui lòng nhập đầy đủ 6 số' })
            setIsLoading(false)
            return
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock success
            console.log('Verification code verified:', code)
            setCurrentStep('reset')
        } catch (error) {
            setErrors({ general: 'Mã xác thực không đúng. Vui lòng thử lại.' })
        } finally {
            setIsLoading(false)
        }
    }

    // Handle password reset
    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors({})

        const passwordValidation = validatePassword(newPassword)

        if (!passwordValidation.isValid) {
            setErrors({ password: 'Mật khẩu không đủ mạnh' })
            setIsLoading(false)
            return
        }

        if (newPassword !== confirmPassword) {
            setErrors({ confirmPassword: 'Mật khẩu xác nhận không khớp' })
            setIsLoading(false)
            return
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Mock success
            console.log('Password reset successful')
            setCurrentStep('success')
        } catch (error) {
            setErrors({ general: 'Có lỗi xảy ra. Vui lòng thử lại.' })
        } finally {
            setIsLoading(false)
        }
    }

    // Handle verification code input
    const handleCodeInput = (index: number, value: string) => {
        if (value.length > 1) return

        const newCode = [...verificationCode]
        newCode[index] = value
        setVerificationCode(newCode)

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`)
            nextInput?.focus()
        }
    }

    // Handle backspace in verification code
    const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`)
            prevInput?.focus()
        }
    }

    // Resend verification code
    const resendCode = async () => {
        if (countdown > 0) return

        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            console.log('Verification code resent')
            startCountdown()
            setVerificationCode(['', '', '', '', '', ''])
        } catch (error) {
            setErrors({ general: 'Không thể gửi lại mã. Vui lòng thử lại.' })
        } finally {
            setIsLoading(false)
        }
    }

    // Start countdown timer
    const startCountdown = () => {
        setCountdown(60)
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    // Password strength indicator
    const passwordValidation = validatePassword(newPassword)

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/auth/login" className="flex items-center">
                            <ArrowLeft className="w-5 h-5 mr-2 text-gray-600" />
                            <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-xl">
                                Medi
                            </div>
                        </Link>
                        <Link href="/auth/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto">
                    {/* Progress Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center space-x-4">
                            {['email', 'verification', 'reset', 'success'].map((step, index) => (
                                <div key={step} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${['email', 'verification', 'reset', 'success'].indexOf(currentStep) >= index
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    {index < 3 && (
                                        <div className={`w-8 h-0.5 ml-2 ${['email', 'verification', 'reset', 'success'].indexOf(currentStep) > index
                                            ? 'bg-blue-600'
                                            : 'bg-gray-200'
                                            }`}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        {/* Error Alert */}
                        {errors.general && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center">
                                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                                    <span className="text-red-700 text-sm">{errors.general}</span>
                                </div>
                            </div>
                        )}

                        {/* Step 1: Email Input */}
                        {currentStep === 'email' && (
                            <div>
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Key className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        Quên mật khẩu?
                                    </h1>
                                    <p className="text-gray-600">
                                        Nhập email của bạn và chúng tôi sẽ gửi mã xác thực để đặt lại mật khẩu
                                    </p>
                                </div>

                                <form onSubmit={handleEmailSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email đăng ký <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                placeholder="Nhập email của bạn"
                                                autoFocus
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                                Đang gửi...
                                            </div>
                                        ) : (
                                            'Gửi mã xác thực'
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Step 2: Verification Code */}
                        {currentStep === 'verification' && (
                            <div>
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        Kiểm tra email
                                    </h1>
                                    <p className="text-gray-600 mb-2">
                                        Chúng tôi đã gửi mã xác thực 6 số đến:
                                    </p>
                                    <p className="font-semibold text-gray-900">{email}</p>
                                </div>

                                <form onSubmit={handleVerificationSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                                            Nhập mã xác thực
                                        </label>
                                        <div className="flex justify-center space-x-2">
                                            {verificationCode.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    id={`code-${index}`}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleCodeInput(index, e.target.value)}
                                                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                                                    className={`w-12 h-12 text-center text-xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.code ? 'border-red-300' : 'border-gray-300'
                                                        }`}
                                                    autoFocus={index === 0}
                                                />
                                            ))}
                                        </div>
                                        {errors.code && (
                                            <p className="mt-2 text-sm text-red-600 text-center">{errors.code}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || verificationCode.join('').length !== 6}
                                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                                Đang xác thực...
                                            </div>
                                        ) : (
                                            'Xác thực'
                                        )}
                                    </button>

                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-2">
                                            Không nhận được mã?
                                        </p>
                                        <button
                                            type="button"
                                            onClick={resendCode}
                                            disabled={countdown > 0 || isLoading}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                                        >
                                            {countdown > 0 ? (
                                                <div className="flex items-center justify-center">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    Gửi lại sau {countdown}s
                                                </div>
                                            ) : (
                                                'Gửi lại mã'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Step 3: Reset Password */}
                        {currentStep === 'reset' && (
                            <div>
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Lock className="w-8 h-8 text-yellow-600" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        Đặt lại mật khẩu
                                    </h1>
                                    <p className="text-gray-600">
                                        Tạo mật khẩu mới cho tài khoản của bạn
                                    </p>
                                </div>

                                <form onSubmit={handlePasswordReset} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mật khẩu mới <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                type={showNewPassword ? 'text' : 'password'}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                placeholder="Nhập mật khẩu mới"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
                                            >
                                                {showNewPassword ? <EyeOff /> : <Eye />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                        )}

                                        {/* Password Strength Indicator */}
                                        {newPassword && (
                                            <div className="mt-2 space-y-1">
                                                <div className="flex items-center space-x-2 text-xs">
                                                    <div className={`w-2 h-2 rounded-full ${passwordValidation.checks.length ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <span className={passwordValidation.checks.length ? 'text-green-600' : 'text-gray-500'}>
                                                        Tối thiểu 8 ký tự
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-xs">
                                                    <div className={`w-2 h-2 rounded-full ${passwordValidation.checks.upper ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <span className={passwordValidation.checks.upper ? 'text-green-600' : 'text-gray-500'}>
                                                        Ít nhất 1 chữ hoa
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-xs">
                                                    <div className={`w-2 h-2 rounded-full ${passwordValidation.checks.lower ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <span className={passwordValidation.checks.lower ? 'text-green-600' : 'text-gray-500'}>
                                                        Ít nhất 1 chữ thường
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-xs">
                                                    <div className={`w-2 h-2 rounded-full ${passwordValidation.checks.number ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <span className={passwordValidation.checks.number ? 'text-green-600' : 'text-gray-500'}>
                                                        Ít nhất 1 số
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Xác nhận mật khẩu <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                placeholder="Nhập lại mật khẩu mới"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeOff /> : <Eye />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                        )}
                                        {confirmPassword && newPassword === confirmPassword && (
                                            <div className="mt-1 flex items-center text-sm text-green-600">
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Mật khẩu khớp
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || !passwordValidation.isValid || newPassword !== confirmPassword}
                                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                                Đang cập nhật...
                                            </div>
                                        ) : (
                                            'Đặt lại mật khẩu'
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Step 4: Success */}
                        {currentStep === 'success' && (
                            <div className="text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-12 h-12 text-green-600" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    Thành công!
                                </h1>
                                <p className="text-gray-600 mb-8">
                                    Mật khẩu của bạn đã được đặt lại thành công.
                                    Bây giờ bạn có thể đăng nhập với mật khẩu mới.
                                </p>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => router.push('/auth/login')}
                                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors"
                                    >
                                        Đăng nhập ngay
                                    </button>

                                    <Link
                                        href="/"
                                        className="block w-full text-center py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Về trang chủ
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Security Note */}
                    {currentStep !== 'success' && (
                        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center">
                                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Bảo mật cao</p>
                                    <p className="text-sm text-blue-700">
                                        {currentStep === 'email' && 'Mã xác thực sẽ hết hạn sau 10 phút'}
                                        {currentStep === 'verification' && 'Mã xác thực chỉ sử dụng được một lần'}
                                        {currentStep === 'reset' && 'Mật khẩu được mã hóa và bảo vệ an toàn'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}