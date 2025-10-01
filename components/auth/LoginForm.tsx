'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, AlertCircle, Facebook, ArrowLeft } from 'lucide-react'
import Alert from '@/components/ui/Alert'
import InputField from '../ui/InputField'
import PasswordField from '../ui/PasswordField'
import { useAuth } from '@/lib/AuthContext'

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [alert, setAlert] = useState<{ message: string, type: 'success' | 'error' | null }>({ message: '', type: null })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    })

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors({})
        const newErrors: Record<string, string> = {}

        if (!loginData.email) newErrors.email = 'Vui lòng nhập email'
        else if (!validateEmail(loginData.email)) newErrors.email = 'Email không hợp lệ'
        if (!loginData.password) newErrors.password = 'Vui lòng nhập mật khẩu'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setIsLoading(false)
            return
        }

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: loginData.email,
                    password: loginData.password,
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setAlert({ message: data.error || "Đăng nhập thất bại", type: "error" });
                return;
            }
            login(data.user)
            setAlert({ message: "Đăng nhập thành công!", type: "success" });
            router.push("/");
        } catch (error) {
            console.error(error);
            setAlert({ message: "Lỗi kết nối server", type: "error" });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Đăng nhập</h1>
                <p className="text-center text-gray-600 mb-6">Chào mừng bạn quay lại với YouMed</p>

                {errors.general && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                        <span className="text-red-700 text-sm">{errors.general}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">

                    <InputField
                        icon={<Mail />}
                        label="Email"
                        type="email"
                        value={loginData.email}
                        onChange={(v: any) => setLoginData({ ...loginData, email: v })}
                        error={errors.email}
                        placeholder="email@example.com"
                    />
                    <PasswordField
                        label="Mật khẩu"
                        value={loginData.password}
                        onChange={(v: any) => setLoginData({ ...loginData, password: v })}
                        show={showPassword}
                        setShow={setShowPassword}
                        error={errors.password}
                    />

                    {/* Options */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm text-gray-600">
                            <input
                                type="checkbox"
                                checked={loginData.rememberMe}
                                onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                                className="mr-2 rounded border-gray-300 text-blue-600"
                            />
                            Ghi nhớ
                        </label>
                        <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                            Quên mật khẩu?
                        </Link>
                    </div>
                    {alert.type && (
                        <Alert message={alert.message} type={alert.type} />
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    )
}
