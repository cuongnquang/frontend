'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    MapPin,
    Star,
    ChevronLeft,
    ChevronRight,
    Check,
    AlertCircle
} from 'lucide-react'
import { AuthGuard } from '@/lib/AuthGuard'

interface Doctor {
    id: number
    name: string
    specialty: string
    hospital: string
    rating: number
    price: string
    image: string
}

interface Hospital {
    id: number
    name: string
    address: string
    rating: number
    image: string
}

interface TimeSlot {
    time: string
    available: boolean
}

export default function AppointmentPage() {
    // Đặt bước mặc định là 2
    const [currentStep, setCurrentStep] = useState(2)
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
    const [selectionType, setSelectionType] = useState<'doctor' | 'hospital'>('doctor')
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<string>('')
    const [patientInfo, setPatientInfo] = useState({
        fullName: '',
        phone: '',
        email: '',
        birthDate: '',
        gender: '',
        address: '',
        symptoms: '',
        notes: ''
    })

    const doctors: Doctor[] = [
        {
            id: 1,
            name: 'BS. Nguyễn Văn An',
            specialty: 'Tim mạch',
            hospital: 'Bệnh viện Chợ Rẫy',
            rating: 4.8,
            price: '500.000đ',
            image: '/api/placeholder/80/80'
        },
        {
            id: 2,
            name: 'PGS.TS. Trần Thị Bình',
            specialty: 'Nhi khoa',
            hospital: 'Bệnh viện Nhi Đồng 1',
            rating: 4.9,
            price: '600.000đ',
            image: '/api/placeholder/80/80'
        },
        {
            id: 3,
            name: 'BS. Lê Minh Châu',
            specialty: 'Da liễu',
            hospital: 'Bệnh viện Da liễu TP.HCM',
            rating: 4.7,
            price: '450.000đ',
            image: '/api/placeholder/80/80'
        }
    ]

    const hospitals: Hospital[] = [
        {
            id: 101,
            name: 'Bệnh viện Chợ Rẫy',
            address: '201B Nguyễn Chí Thanh, Q.5, TP.HCM',
            rating: 4.7,
            image: '/api/placeholder/80/80'
        },
        {
            id: 102,
            name: 'Bệnh viện Nhi Đồng 1',
            address: '341 Sư Vạn Hạnh, Q.10, TP.HCM',
            rating: 4.8,
            image: '/api/placeholder/80/80'
        },
        {
            id: 103,
            name: 'Bệnh viện Da liễu TP.HCM',
            address: '2 Nguyễn Thông, Q.3, TP.HCM',
            rating: 4.6,
            image: '/api/placeholder/80/80'
        }
    ]

    const timeSlots: TimeSlot[] = [
        { time: '08:00', available: true },
        { time: '08:30', available: true },
        { time: '09:00', available: false },
        { time: '09:30', available: true },
        { time: '10:00', available: true },
        { time: '10:30', available: false },
        { time: '14:00', available: true },
        { time: '14:30', available: true },
        { time: '15:00', available: true },
        { time: '15:30', available: false },
        { time: '16:00', available: true },
        { time: '16:30', available: true }
    ]

    const generateCalendarDays = () => {
        const today = new Date()
        const days = []

        for (let i = 0; i < 14; i++) {
            const date = new Date(today)
            date.setDate(today.getDate() + i)
            days.push(date)
        }

        return days
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('vi-VN', {
            weekday: 'short',
            day: 'numeric',
            month: 'numeric'
        })
    }

    // Preselect from URL params: ?doctorId=1 or ?hospitalId=101
    const searchParams = useSearchParams()
    useEffect(() => {
        const doctorId = searchParams.get('doctorId')
        const hospitalId = searchParams.get('hospitalId')

        if (doctorId) {
            const found = doctors.find(d => String(d.id) === doctorId)
            if (found) {
                setSelectedDoctor(found)
                setSelectedHospital(null)
                setSelectionType('doctor')
            }
        } else if (hospitalId) {
            const found = hospitals.find(h => String(h.id) === hospitalId)
            if (found) {
                setSelectedHospital(found)
                setSelectedDoctor(null)
                setSelectionType('hospital')
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    const handlePatientInfoChange = (field: string, value: string) => {
        setPatientInfo(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = () => {
        // Handle appointment submission
        console.log('Appointment submitted:', {
            doctor: selectedDoctor,
            hospital: selectedHospital,
            date: selectedDate,
            time: selectedTime,
            patientInfo
        })
        alert('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.')
    }

    const isStepValid = (step: number) => {
        switch (step) {
            case 1:
                return selectedDoctor !== null || selectedHospital !== null
            case 2:
                return selectedDate !== null && selectedTime !== ''
            case 3:
                return patientInfo.fullName && patientInfo.phone && patientInfo.email
            default:
                return false
        }
    }

    const selectedDoctorId = selectedDoctor ? selectedDoctor.id : null
    const selectedHospitalId = selectedHospital ? selectedHospital.id : null

    return (
        <AuthGuard>
            <main className="min-h-screen bg-gray-50">
                <Header />

                {/* Page header */}
                <section className="bg-white border-b py-8">
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Đặt lịch khám bệnh
                        </h1>
                        <p className="text-gray-600">
                            Đặt lịch khám với bác sĩ uy tín chỉ trong vài bước đơn giản
                        </p>
                    </div>
                </section>

                {/* Progress steps */}
                <section className="bg-white border-b py-6">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-center space-x-8">
                            {[2, 3, 4].map((step, idx) => (
                                <div key={step} className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= step
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        {currentStep > step ? (
                                            <Check className="w-5 h-5" />
                                        ) : (
                                            idx + 1
                                        )}
                                    </div>
                                    <span className={`ml-2 font-medium ${currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                                        }`}>
                                        {step === 2 && 'Chọn thời gian'}
                                        {step === 3 && 'Thông tin bệnh nhân'}
                                        {step === 4 && 'Xác nhận'}
                                    </span>
                                    {step < 4 && (
                                        <ChevronRight className="w-5 h-5 text-gray-300 ml-4" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Appointment content */}
                <section className="py-8">
                    <div className="container mx-auto px-4 max-w-4xl">
                        {/* Thông tin đã chọn */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Thông tin đã chọn
                            </h2>
                            <div className="p-4 bg-gray-50 rounded-lg mb-4">
                                {selectedDoctor && (
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{selectedDoctor.name}</h4>
                                            <p className="text-blue-600">{selectedDoctor.specialty}</p>
                                            <p className="text-gray-600">{selectedDoctor.hospital}</p>
                                            <p className="font-semibold text-blue-600">{selectedDoctor.price}</p>
                                        </div>
                                    </div>
                                )}
                                {selectedHospital && (
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{selectedHospital.name}</h4>
                                            <p className="text-gray-600 flex items-center"><MapPin className="w-4 h-4 mr-1" />{selectedHospital.address}</p>
                                            <div className="flex items-center mt-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="ml-1 text-sm font-medium">{selectedHospital.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Step 2: Select Date & Time */}
                        {currentStep === 2 && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Chọn ngày và giờ khám
                                </h2>

                                {/* Calendar */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4">Chọn ngày</h3>
                                    <div className="grid grid-cols-7 gap-2">
                                        {generateCalendarDays().map((date, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedDate(date)}
                                                className={`p-3 rounded-lg text-center transition-all ${selectedDate?.toDateString() === date.toDateString()
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                    }`}
                                            >
                                                <div className="text-xs mb-1">
                                                    {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                                                </div>
                                                <div className="font-semibold">
                                                    {date.getDate()}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Time slots */}
                                {selectedDate && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Chọn giờ</h3>
                                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                            {timeSlots.map((slot) => (
                                                <button
                                                    key={slot.time}
                                                    disabled={!slot.available}
                                                    onClick={() => setSelectedTime(slot.time)}
                                                    className={`p-3 rounded-lg text-center transition-all ${!slot.available
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : selectedTime === slot.time
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                        }`}
                                                >
                                                    {slot.time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 3: Patient Information */}
                        {currentStep === 3 && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Thông tin bệnh nhân
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={patientInfo.fullName}
                                            onChange={(e) => handlePatientInfoChange('fullName', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Nhập họ và tên"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số điện thoại <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={patientInfo.phone}
                                            onChange={(e) => handlePatientInfoChange('phone', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={patientInfo.email}
                                            onChange={(e) => handlePatientInfoChange('email', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Nhập email"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ngày sinh
                                        </label>
                                        <input
                                            type="date"
                                            value={patientInfo.birthDate}
                                            onChange={(e) => handlePatientInfoChange('birthDate', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Giới tính
                                        </label>
                                        <select
                                            value={patientInfo.gender}
                                            onChange={(e) => handlePatientInfoChange('gender', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Chọn giới tính</option>
                                            <option value="male">Nam</option>
                                            <option value="female">Nữ</option>
                                            <option value="other">Khác</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Địa chỉ
                                        </label>
                                        <input
                                            type="text"
                                            value={patientInfo.address}
                                            onChange={(e) => handlePatientInfoChange('address', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Nhập địa chỉ"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Triệu chứng/Lý do khám
                                        </label>
                                        <textarea
                                            value={patientInfo.symptoms}
                                            onChange={(e) => handlePatientInfoChange('symptoms', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Mô tả triệu chứng hoặc lý do khám bệnh"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ghi chú thêm
                                        </label>
                                        <textarea
                                            value={patientInfo.notes}
                                            onChange={(e) => handlePatientInfoChange('notes', e.target.value)}
                                            rows={2}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Ghi chú thêm (không bắt buộc)"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Confirmation */}
                        {currentStep === 4 && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Xác nhận thông tin đặt lịch
                                </h2>

                                <div className="space-y-6">
                                    {/* Selected entity info */}
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h3 className="font-semibold text-lg mb-3">Thông tin đặt khám</h3>
                                        {selectedDoctor && (
                                            <div className="flex items-center space-x-4">
                                                <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{selectedDoctor.name}</h4>
                                                    <p className="text-blue-600">{selectedDoctor.specialty}</p>
                                                    <p className="text-gray-600">{selectedDoctor.hospital}</p>
                                                    <p className="font-semibold text-blue-600">{selectedDoctor.price}</p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedHospital && (
                                            <div className="flex items-center space-x-4">
                                                <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{selectedHospital.name}</h4>
                                                    <p className="text-gray-600 flex items-center"><MapPin className="w-4 h-4 mr-1" />{selectedHospital.address}</p>
                                                    <div className="flex items-center mt-1">
                                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                        <span className="ml-1 text-sm font-medium">{selectedHospital.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Appointment info */}
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h3 className="font-semibold text-lg mb-3">Thông tin lịch hẹn</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="flex items-center">
                                                <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                                                <span>{selectedDate?.toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                                                <span>{selectedTime}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Patient info */}
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h3 className="font-semibold text-lg mb-3">Thông tin bệnh nhân</h3>
                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                            <div><strong>Họ tên:</strong> {patientInfo.fullName}</div>
                                            <div><strong>Điện thoại:</strong> {patientInfo.phone}</div>
                                            <div><strong>Email:</strong> {patientInfo.email}</div>
                                            <div><strong>Ngày sinh:</strong> {patientInfo.birthDate || 'Chưa cung cấp'}</div>
                                            <div><strong>Giới tính:</strong> {
                                                patientInfo.gender === 'male' ? 'Nam' :
                                                    patientInfo.gender === 'female' ? 'Nữ' :
                                                        patientInfo.gender === 'other' ? 'Khác' : 'Chưa cung cấp'
                                            }</div>
                                            <div><strong>Địa chỉ:</strong> {patientInfo.address || 'Chưa cung cấp'}</div>
                                            {patientInfo.symptoms && (
                                                <div className="md:col-span-2">
                                                    <strong>Triệu chứng:</strong> {patientInfo.symptoms}
                                                </div>
                                            )}
                                            {patientInfo.notes && (
                                                <div className="md:col-span-2">
                                                    <strong>Ghi chú:</strong> {patientInfo.notes}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Terms */}
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div className="flex items-start">
                                            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                            <div className="text-sm text-yellow-800">
                                                <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                                                <ul className="list-disc list-inside space-y-1">
                                                    <li>Vui lòng có mặt trước 15 phút so với giờ hẹn</li>
                                                    <li>Mang theo CMND/CCCD và các giấy tờ y tế liên quan</li>
                                                    <li>Nếu cần hủy lịch, vui lòng thông báo trước 2 giờ</li>
                                                    <li>Phí khám sẽ được thanh toán trực tiếp tại bệnh viện</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation buttons */}
                        <div className="flex justify-between mt-8">
                            <button
                                onClick={() => setCurrentStep(Math.max(2, currentStep - 1))}
                                disabled={currentStep === 2}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5 inline mr-1" />
                                Quay lại
                            </button>

                            {currentStep < 4 ? (
                                <button
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    disabled={!isStepValid(currentStep)}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Tiếp theo
                                    <ChevronRight className="w-5 h-5 inline ml-1" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                                >
                                    Xác nhận đặt lịch
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </AuthGuard>
    )
}