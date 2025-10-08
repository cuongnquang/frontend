'use client'
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation'


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const pathname = usePathname()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-4xl font-extrabold tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
                            Medi
                        </span>
                        <span className="text-purple-700">Contect</span>
                    </Link>
                    {pathname === '/auth/login' ? (
                      <div className="text-sm text-gray-600">
                        Chưa có tài khoản?{" "}
                        <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
                            Đăng ký ngay
                        </Link>
                      </div>
                    ): null}
                    {pathname === '/auth/register' ? (
                      <div className="text-sm text-gray-600">
                        Đã có tài khoản?{" "}
                        <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            Đăng nhập
                        </Link>
                      </div>
                    ): null}
                    
                </div>
            </div>

            {children}
        </div>
  );
}
