'use client'

import CompleteProfileForm from "@/components/auth/complete-profile/CompleteProfileForm"

export default function CompleteProfilePage() {
    

    return (
        <div className="container mx-auto px-8 py-8 min-h-screen flex items-center justify-center">
            <div className="max-w-fit mx-auto w-full bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center mb-2 text-black">Hoàn tất Hồ sơ Bệnh nhân</h1>
                <p className="text-center text-gray-600 mb-6">Cung cấp thông tin bắt buộc để kích hoạt tài khoản khám bệnh</p>
                
                {/* Gọi component form đã được chia nhỏ */}
                <CompleteProfileForm />
            </div>
        </div>
    )
}