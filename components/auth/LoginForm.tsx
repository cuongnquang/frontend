'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail } from 'lucide-react'
import Alert from '@/components/ui/Alert'
import InputField from '../ui/InputField'
import PasswordField from '../ui/PasswordField'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
    const router = useRouter()

    const { login, loading, error: authError, user } = useAuth()
    
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [alert, setAlert] = useState<{ message: string, type: 'success' | 'error' | null }>({ message: '', type: null })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (user) {
            router.push('/')
        }
    }, [user, router])

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setAlert({ message: '', type: null });

        // Client-side validation
        const newErrors: Record<string, string> = {};
        if (!email) newErrors.email = 'Vui lòng nhập email';
        else if (!validateEmail(email)) newErrors.email = 'Email không hợp lệ';
        if (!password) newErrors.password = 'Vui lòng nhập mật khẩu';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            const result = await login(email, password);
            setAlert({
                message: result.message,
                type: result.success ? "success" : "error"
            });
        } catch (error: any) {
            setAlert({ message: "Đăng nhập thất bại", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Đăng nhập</h1>
                <p className="text-center text-gray-600 mb-6">Chào mừng bạn quay lại</p>

                <form onSubmit={handleLogin} className="space-y-4">
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
                    
                    <PasswordField
                        label="Mật khẩu"
                        value={password}
                        onChange={setPassword}
                        show={showPassword}
                        setShow={setShowPassword}
                        error={errors.password}
                        disabled={loading}
                    />

                    {/* Options */}
                    <div className="flex items-center justify-between">
                        <Link 
                            href="/auth/forgot-password" 
                            className="text-sm text-blue-600 hover:text-blue-700"
                            tabIndex={loading ? -1 : 0}
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>
                    
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
                                Đang đăng nhập...
                            </span>
                        ) : (
                            'Đăng nhập'
                        )}
                    </button>
                    <Link href="/" className="w-full block text-center border border-blue-600 text-blue-700 py-3 rounded-lg hover:bg-gray-100">
                        Quay về trang chủ
                    </Link>
                </form>
            </div>

            {alert.type && (
                <Alert message={alert.message} type={alert.type} duration={3000} />
            )}
        </div>
    )
}