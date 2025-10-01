'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import LoginForm from '@/components/auth/LoginForm'
import AuthGuard from '@/components/auth/AuthGuard'
import { AuthProvider } from '@/components/auth/AuthContext'

export default function LoginPage() {

    return (
        <AuthProvider>
            <AuthGuard publicRoute={true}>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
                    <div className="bg-white shadow-sm border-b">
                        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                            <Link href="/" className="flex items-center">
                                <ArrowLeft className="w-5 h-5 mr-2 text-gray-600" />
                                <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-xl">Medi</div>
                            </Link>
                            <div className="text-sm text-gray-600">
                                Chưa có tài khoản?{" "}
                                <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Đăng ký ngay
                                </Link>
                            </div>
                        </div>
                    </div>

                    <LoginForm />
                </div>
            </AuthGuard>
        </AuthProvider>
    )
}
