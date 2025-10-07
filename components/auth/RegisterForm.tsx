'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Mail, Phone, User, Facebook
} from 'lucide-react'
import Alert from '@/components/ui/Alert'
import InputField from '@/components/ui/InputField'
import PasswordField from '@/components/ui/PasswordField'
import { useAuth } from '@/lib/AuthContext'


export default function RegisterForm() {
    const router = useRouter()
    const { login } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'patient',
        specialty: '',
        agreeTerms: false
    })

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault()
    //     setErrors({})
    //     const newErrors: Record<string, string> = {}

    //     if (!form.fullName) newErrors.fullName = 'Nhập họ tên'
    //     if (!form.email) newErrors.email = 'Nhập email'
    //     else if (!validateEmail(form.email)) newErrors.email = 'Email không hợp lệ'
    //     if (!form.phone) newErrors.phone = 'Nhập số điện thoại'
    //     if (!form.password) newErrors.password = 'Nhập mật khẩu'
    //     else if (form.password.length < 8) newErrors.password = 'Mật khẩu ít nhất 8 ký tự'
    //     if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp'
    //     if (!form.agreeTerms) newErrors.agreeTerms = 'Cần đồng ý điều khoản'
    //     if (form.role === 'doctor' && !form.specialty) newErrors.specialty = 'Chọn chuyên khoa'

    //     if (Object.keys(newErrors).length) {
    //         setErrors(newErrors)
    //         return
    //     }

    //     setIsLoading(true)
    //     try {
    //         const res = await fetch('/api/auth/register', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(form)
    //         })
    //         const data = await res.json()

    //         if (!res.ok) {
    //             setAlert({ message: data.error || 'Đăng ký thất bại', type: 'error' })
    //         } else {
    //             await login(form.email, form.password)
    //             setAlert({ message: 'Đăng ký thành công! Vui lòng hoàn tất hồ sơ.', type: 'success' })
    //             router.push('/auth/complete-profile')
    //         }
    //     } catch (err) {
    //         console.error(err)
    //         const errorMessage = err instanceof Error ? err.message : 'Lỗi kết nối server';
    //         setAlert({ message: errorMessage, type: 'error' })
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center mb-2 text-black">Đăng ký</h1>
                <p className="text-center text-gray-600 mb-6">Tạo tài khoản để đặt lịch khám bệnh</p>

                {alert.type && <Alert message={alert.message} type={alert.type} />}

                <form onSubmit={()=>{router.push('/auth/complete-profile')}} className="space-y-4">
                    {/* Full name */}
                    <InputField
                        icon={<User />}
                        label="Họ và tên"
                        value={form.fullName}
                        onChange={(v: any) => setForm({ ...form, fullName: v })}
                        error={errors.fullName}
                        placeholder="Nhập họ tên"
                    />

                    {/* Email */}
                    <InputField
                        icon={<Mail />}
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(v: any) => setForm({ ...form, email: v })}
                        error={errors.email}
                        placeholder="email@example.com"
                    />

                    {/* Phone */}
                    <InputField
                        icon={<Phone />}
                        label="Số điện thoại"
                        value={form.phone}
                        onChange={(v: any) => setForm({ ...form, phone: v })}
                        error={errors.phone}
                        placeholder="0123456789"
                    />

                    {/* Password */}
                    <PasswordField
                        label="Mật khẩu"
                        value={form.password}
                        onChange={(v: any) => setForm({ ...form, password: v })}
                        show={showPassword}
                        setShow={setShowPassword}
                        error={errors.password}
                    />

                    {/* Confirm password */}
                    <PasswordField
                        label="Xác nhận mật khẩu"
                        value={form.confirmPassword}
                        onChange={(v: any) => setForm({ ...form, confirmPassword: v })}
                        show={showConfirmPassword}
                        setShow={setShowConfirmPassword}
                        error={errors.confirmPassword}
                    />

                    {/* Terms */}
                    <label className="flex items-start text-sm text-gray-600">
                        <input
                            type="checkbox"
                            checked={form.agreeTerms}
                            onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                            className={`mr-2 rounded border-gray-300 text-blue-600 ${errors.agreeTerms ? 'border-red-300' : ''}`}
                        />
                        Tôi đồng ý với{" "}
                        <Link href="/terms" className="text-blue-600 ml-1">Điều khoản</Link> và{" "}
                        <Link href="/privacy" className="text-blue-600 ml-1">Chính sách</Link>
                    </label>
                    {errors.agreeTerms && <p className="text-sm text-red-600 mt-1">{errors.agreeTerms}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                    </button>
                </form>

                {/* Social login */}
                <div className="mt-6 space-y-3">
                    <button className="w-full px-4 py-3 border border-gray-300 text-black rounded-lg flex justify-center">
                        Tiếp tục với Google
                    </button>
                    <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg flex justify-center">
                        <Facebook className="w-5 h-5 mr-2" /> Tiếp tục với Facebook
                    </button>
                </div>
            </div>
        </div>
    )
}
