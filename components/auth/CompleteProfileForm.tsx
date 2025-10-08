'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import InputField from '@/components/ui/InputField'
import { User, MapPin, Calendar, CreditCard, Briefcase, Award, Book, Phone } from 'lucide-react'

export default function CompleteProfileForm() {
    const router = useRouter()
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState({
        fullName: '',
        dateOfBirth: '',
        gender: 'other',
        phoneNumber: '',
        address: '',
        insuranceNumber: '', // Patient
        specialty: '', // Doctor
        yearsOfExperience: '', // Doctor
        education: '', // Doctor
    })

    const handleInputChange = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            if (!user) {
                throw new Error("User not authenticated.");
            }

            const res = await fetch(`/api/user/profile`, { 
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, role: user.role }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to update profile.')
            }

            // Redirect to the appropriate dashboard
            const redirectPath = user.role === 'doctor' ? '/doctor/dashboard' : '/';
            router.push(redirectPath)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="text-center">
                 <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {user?.role === 'doctor' ? 'Hoàn tất hồ sơ Bác sĩ' : 'Hoàn tất hồ sơ'}
                </h1>
                <p className="text-gray-600 mb-6">Vui lòng cung cấp thêm một số thông tin để chúng tôi có thể phục vụ bạn tốt hơn.</p>
            </div>

            {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
    icon={<User />}
    value={form.fullName}
    onChange={(e: any) => handleInputChange('fullName', e.target.value)}
    placeholder="Họ và tên"
    label="Họ và tên"
/>
<InputField
    icon={<Calendar />}
    type="date"
    value={form.dateOfBirth}
    onChange={(e: any) => handleInputChange('dateOfBirth', e.target.value)}
    label="Ngày sinh"
/>
<InputField
    icon={<Phone />}
    value={form.phoneNumber}
    onChange={(e: any) => handleInputChange('phoneNumber', e.target.value)}
    placeholder="Số điện thoại"
    label="Số điện thoại"
/>
<InputField
    icon={<MapPin />}
    value={form.address}
    onChange={(e: any) => handleInputChange('address', e.target.value)}
    placeholder="Địa chỉ"
    label="Địa chỉ"
/>
<InputField
    icon={<CreditCard />}
    value={form.insuranceNumber}
    onChange={(e: any) => handleInputChange('insuranceNumber', e.target.value)}
    placeholder="Số bảo hiểm y tế"
    label="Số bảo hiểm y tế"
/>
<InputField
    icon={<Briefcase />}
    value={form.specialty}
    onChange={(e: any) => handleInputChange('specialty', e.target.value)}
    placeholder="Chuyên ngành"
    label="Chuyên ngành"
/>
<InputField
    icon={<Award />}
    value={form.yearsOfExperience}
    onChange={(e: any) => handleInputChange('yearsOfExperience', e.target.value)}
    placeholder="Kinh nghiệm"
    label="Kinh nghiệm"
/>
<InputField
    icon={<Book />}
    value={form.education}
    onChange={(e: any) => handleInputChange('education', e.target.value)}
    placeholder="Trình độ"
    label="Trình độ"
/>



                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold transition-all"
                >
                    {isLoading ? 'Đang lưu...' : 'Lưu và tiếp tục'}
                </button>
            </form>
        </>
    )
}
