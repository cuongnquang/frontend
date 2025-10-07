import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, AlertTriangle } from 'lucide-react'
import Alert from '@/components/ui/Alert'
import PersonalInfoSection from './PersonalInfoSection'
import AdditionalInfoSection from './AdditionalInfoSection'

// Tạo một type cho dữ liệu form để dễ quản lý
interface ProfileFormState {
    identity_number: string
    date_of_birth: string
    gender: string
    address: string
    ethnicity: string
    health_insurance_number: string
    occupation: string
    referral_code: string
}

export default function CompleteProfileForm() {
    const router = useRouter()
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null })
    const [errors, setErrors] = useState<Record<keyof ProfileFormState, string>>({})
    const [isLoading, setIsLoading] = useState(false)

    const [form, setForm] = useState<ProfileFormState>({
        identity_number: '',
        date_of_birth: '',
        gender: '',
        address: '',
        ethnicity: '',
        health_insurance_number: '',
        occupation: '',
        referral_code: '',
    })


    const handleChange = (name: keyof ProfileFormState, value: string) => {
        setForm(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
             setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!form.gender) newErrors.gender = 'Chọn giới tính'
        if (!form.date_of_birth) newErrors.date_of_birth = 'Nhập ngày sinh'
        if (!form.address) newErrors.address = 'Nhập địa chỉ'
        if (!form.identity_number) newErrors.identity_number = 'Nhập số CCCD/Mã định danh'
        
        if (form.identity_number && (form.identity_number.length !== 9 && form.identity_number.length !== 12)) {
             newErrors.identity_number = 'CCCD/Mã định danh phải có 9 hoặc 12 chữ số'
        }
        if (form.date_of_birth && new Date(form.date_of_birth) > new Date()) {
             newErrors.date_of_birth = 'Ngày sinh không hợp lệ'
        }
        if (form.health_insurance_number && form.health_insurance_number.length > 0 && form.health_insurance_number.length < 10) {
             newErrors.health_insurance_number = 'Số BHYT không hợp lệ'
        }
        
        setErrors(newErrors as Record<keyof ProfileFormState, string>)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setAlert({ message: '', type: null }); // Xóa alert cũ

        if (!validateForm()) {
            setAlert({ message: 'Vui lòng kiểm tra lại thông tin bị thiếu hoặc không hợp lệ.', type: 'error' })
            return
        }

        setErrors({}); // Xóa errors nếu validation thành công
        setIsLoading(true)
        
        try {
            const res = await fetch('/api/user/complete-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form) 
            })
            const data = await res.json()

            if (!res.ok) {
                setAlert({ message: data.error || 'Hoàn tất hồ sơ thất bại.', type: 'error' })
            } else {
                setAlert({ message: 'Hoàn tất hồ sơ thành công! Đang chuyển hướng...', type: 'success' })
                
                setTimeout(() => {
                    router.push('/')
                }, 1500)
            }
        } catch (err) {
            console.error(err)
            const errorMessage = err instanceof Error ? err.message : 'Lỗi kết nối server';
            setAlert({ message: errorMessage, type: 'error' })
        } finally {
            setIsLoading(false)
        }
    }

    const validationErrors = useMemo(() => Object.values(errors).filter(e => e), [errors]);

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className='flex gap-10'>
                <PersonalInfoSection 
                    form={form} 
                    errors={errors} 
                    onChange={handleChange} 
                />
                
                <AdditionalInfoSection 
                    form={form} 
                    errors={errors} 
                    onChange={handleChange} 
                />
            </div>
            

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Đang hoàn tất...
                    </>
                ) : (
                    'Hoàn tất và sử dụng'
                )}
            </button>
            
            {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg space-y-2">
                    <p className="font-semibold flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Lỗi nhập liệu:
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                        {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            {alert.type && <Alert message={alert.message} type={alert.type} />}
        </form>
    )
}