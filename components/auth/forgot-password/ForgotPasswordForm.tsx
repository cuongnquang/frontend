'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Shield } from 'lucide-react'
import EmailStep from './EmailStep'
import VerificationStep from './VerificationStep'
import ResetStep from './ResetStep'
import SuccessStep from './SuccessStep'
import Alert from '@/components/ui/Alert'
import { useAuth } from '@/contexts/AuthContext'

type Step = 'email' | 'verification' | 'reset' | 'success'

export default function ForgotPasswordForm() {
    const router = useRouter()
    const { forgotPassword, verifyResetOTP, resetPassword } = useAuth()
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
    const [alert, setAlert] = useState<{ message: string, type: 'success' | 'error' | 'info' | null, duration?: number }>({
        message: '',
        type: null,
        duration: 4000
    })

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validatePassword = (password: string) => {
        const hasLength = password.length >= 8
        const hasUpper = /[A-Z]/.test(password)
        const hasLower = /[a-z]/.test(password)
        const hasNumber = /\d/.test(password)

        return {
            isValid: hasLength && hasUpper && hasLower && hasNumber,
            checks: { length: hasLength, upper: hasUpper, lower: hasLower, number: hasNumber },
        }
    }

    // Step 1: Gửi email quên mật khẩu
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors({})
        if (!email || !validateEmail(email)) {
            setErrors({ email: 'Email không hợp lệ' })
            setIsLoading(false)
            return
        }
        try {
            const result = await forgotPassword(email)
            if (result.success) {
                setAlert({ message: result.message, type: 'success' })
                setCurrentStep('verification')
                startCountdown()
            } else {
                setAlert({ message: result.message, type: 'error' })
                setErrors({ general: result.message })
            }
        } catch (error) {
            setAlert({ message: 'Có lỗi xảy ra. Vui lòng thử lại.', type: 'error' })
            setErrors({ general: 'Có lỗi xảy ra. Vui lòng thử lại.' })
        } finally {
            setIsLoading(false)
        }
    }

    // Step 2: Xác thực mã OTP
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
            const result = await verifyResetOTP(code)
            if (result.success) {
                setAlert({ message: result.message, type: 'success' })
                setCurrentStep('reset')
            } else {
                setAlert({ message: result.message, type: 'error' })
                setErrors({ general: result.message })
            }
        } catch (error) {
            setAlert({ message: 'Mã xác thực không đúng. Vui lòng thử lại.', type: 'error' })
            setErrors({ general: 'Mã xác thực không đúng. Vui lòng thử lại.' })
        } finally {
            setIsLoading(false)
        }
    }

    // Step 3: Đặt lại mật khẩu mới
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
            const code = verificationCode.join('')
            const result = await resetPassword(code, newPassword, confirmPassword)
            if (result.success) {
                setAlert({ message: result.message, type: 'success' })
                setCurrentStep('success')
            } else {
                setAlert({ message: result.message, type: 'error' })
                setErrors({ general: result.message })
            }
        } catch (error) {
            setAlert({ message: 'Có lỗi xảy ra. Vui lòng thử lại.', type: 'error' })
            setErrors({ general: 'Có lỗi xảy ra. Vui lòng thử lại.' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleCodeInput = (index: number, value: string) => {
        if (value.length > 1) return
        const newCode = [...verificationCode]
        newCode[index] = value
        setVerificationCode(newCode)
        if (value && index < 5) {
            document.getElementById(`code-${index + 1}`)?.focus()
        }
    }

    const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            document.getElementById(`code-${index - 1}`)?.focus()
        }
    }

    // Gửi lại mã xác thực
    const resendCode = async () => {
        if (countdown > 0) return
        setIsLoading(true)
        try {
            const result = await forgotPassword(email)
            if (result.success) {
                setAlert({ message: 'Mã xác thực đã được gửi lại!', type: 'success' })
                startCountdown()
                setVerificationCode(['', '', '', '', '', ''])
            } else {
                setAlert({ message: result.message, type: 'error' })
                setErrors({ general: result.message })
            }
        } catch (error) {
            setAlert({ message: 'Không thể gửi lại mã. Vui lòng thử lại.', type: 'error' })
            setErrors({ general: 'Không thể gửi lại mã. Vui lòng thử lại.' })
        } finally {
            setIsLoading(false)
        }
    }

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

    const passwordValidation = validatePassword(newPassword)

    const renderStep = () => {
        switch (currentStep) {
            case 'email':
                return <EmailStep email={email} setEmail={setEmail} handleEmailSubmit={handleEmailSubmit} isLoading={isLoading} errors={errors} />
            case 'verification':
                return <VerificationStep email={email} verificationCode={verificationCode} handleCodeInput={handleCodeInput} handleCodeKeyDown={handleCodeKeyDown} handleVerificationSubmit={handleVerificationSubmit} resendCode={resendCode} isLoading={isLoading} errors={errors} countdown={countdown} />
            case 'reset':
                return <ResetStep newPassword={newPassword} setNewPassword={setNewPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} showNewPassword={showNewPassword} setShowNewPassword={setShowNewPassword} showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword} handlePasswordReset={handlePasswordReset} isLoading={isLoading} errors={errors} passwordValidation={passwordValidation} />
            case 'success':
                return <SuccessStep router={router} />
            default:
                return null
        }
    }

    return (
        <>
            <div className="mb-8 mt-8">
                <div className="flex items-center justify-center space-x-4">
                    {['email', 'verification', 'reset', 'success'].map((step, index) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${['email', 'verification', 'reset', 'success'].indexOf(currentStep) >= index ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {index + 1}
                            </div>
                            {index < 3 && <div className={`w-8 h-0.5 ml-2 ${['email', 'verification', 'reset', 'success'].indexOf(currentStep) > index ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 mb-8">
                {errors.general && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                            <span className="text-red-700 text-sm">{errors.general}</span>
                        </div>
                    </div>
                )}
                {renderStep()}
            </div>

            {alert.type && (
                <Alert message={alert.message} type={alert.type} duration={alert.duration} />
            )}

            {currentStep !== 'success' && (
                <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
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
        </>
    )
}