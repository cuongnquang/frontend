'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <ArrowLeft className="w-5 h-5 mr-2 text-gray-600" />
                        <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-xl">Medi</div>
                    </Link>
                    <div className="text-sm text-gray-600">
                        Đã có tài khoản?{" "}
                        <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>

            {/* Form */}
            <RegisterForm />

        </div>
    )
}
