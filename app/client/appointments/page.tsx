'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

// 1. Nhập các components đã tạo
import AppointmentHeader from '@/components/client/appointments/AppointmentHeader'
import AppointmentProgress from '@/components/client/appointments/AppointmentProgress'
import SelectedInfoCard from '@/components/client/appointments/SelectedInfoCard'
import StepNavigation from '@/components/client/appointments/StepNavigation'
import StepTwoDateTimeSelection from '@/components/client/appointments/steps/StepTwoDateTimeSelection'
import StepThreePatientInfoForm from '@/components/client/appointments/steps/StepThreePatientInfoForm'
import StepFourConfirmation from '@/components/client/appointments/steps/StepFourConfirmation'
import { Doctor, Hospital, TimeSlot, PatientInfo } from '@/components/client/appointments/AppointmentTypes'
import { Gender } from '@/types/emuns'


// 3. Main Component
export default function AppointmentPage() {
    // --- State Management ---
    const [currentStep, setCurrentStep] = useState(2) // Bắt đầu từ bước 2 theo yêu cầu
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
    const [selectionType, setSelectionType] = useState<'doctor' | 'hospital'>('doctor') // Giữ lại cho logic pre-select
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<string>('')
    const [patientInfo, setPatientInfo] = useState<PatientInfo>({
        fullName: '',
        phone: '',
        email: '',
        birthDate: '',
        gender: Gender.MALE,
        address: '',
        symptoms: '',
        notes: ''
    })

    // --- Mock Data (Giữ trong file chính hoặc di chuyển sang file data) ---
    const doctors: Doctor[] = [
        { id: 1, name: 'BS. Nguyễn Văn An', specialty: 'Tim mạch', hospital: 'Bệnh viện Chợ Rẫy', rating: 4.8, price: '500.000đ', image: '/api/placeholder/80/80' },
        { id: 2, name: 'PGS.TS. Trần Thị Bình', specialty: 'Nhi khoa', hospital: 'Bệnh viện Nhi Đồng 1', rating: 4.9, price: '600.000đ', image: '/api/placeholder/80/80' },
        { id: 3, name: 'BS. Lê Minh Châu', specialty: 'Da liễu', hospital: 'Bệnh viện Da liễu TP.HCM', rating: 4.7, price: '450.000đ', image: '/api/placeholder/80/80' }
    ]

    const hospitals: Hospital[] = [
        { id: 101, name: 'Bệnh viện Chợ Rẫy', address: '201B Nguyễn Chí Thanh, Q.5, TP.HCM', rating: 4.7, image: '/api/placeholder/80/80' },
        { id: 102, name: 'Bệnh viện Nhi Đồng 1', address: '341 Sư Vạn Hạnh, Q.10, TP.HCM', rating: 4.8, image: '/api/placeholder/80/80' },
        { id: 103, name: 'Bệnh viện Da liễu TP.HCM', address: '2 Nguyễn Thông, Q.3, TP.HCM', rating: 4.6, image: '/api/placeholder/80/80' }
    ]

    const timeSlots: TimeSlot[] = [
        { time: '08:00', available: true }, { time: '08:30', available: true }, { time: '09:00', available: false },
        { time: '09:30', available: true }, { time: '10:00', available: true }, { time: '10:30', available: false },
        { time: '14:00', available: true }, { time: '14:30', available: true }, { time: '15:00', available: true },
        { time: '15:30', available: false }, { time: '16:00', available: true }, { time: '16:30', available: true }
    ]

    // --- Utility Functions ---
    const handlePatientInfoChange = (field: string, value: string) => {
        setPatientInfo(prev => ({ ...prev, [field]: value }))
    }

    // --- Validation Logic ---
    const isStepValid = (step: number): boolean => {
        switch (step) {
            case 2:
                // Thêm điều kiện: Phải có Doctor/Hospital được chọn từ Bước 1 (pre-select)
                const isEntitySelected = selectedDoctor !== null || selectedHospital !== null;
                return isEntitySelected && selectedDate !== null && selectedTime !== '';
            case 3:
                return patientInfo.fullName.trim() !== '' && patientInfo.phone.trim() !== '' && patientInfo.email.trim() !== ''
            case 4:
                return isStepValid(2) && isStepValid(3)
            default:
                return false
        }
    }

    // Logic đặt trước từ URL
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
        // Nếu không có pre-select, cần phải có Bước 1 trong ứng dụng thực tế
        // Hiện tại, code đang mặc định bắt đầu từ Bước 2 và giả định đã có Doctor/Hospital được chọn.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    // --- Submission Handler ---
    const handleSubmit = () => {
        console.log('Appointment submitted:', {
            doctor: selectedDoctor,
            hospital: selectedHospital,
            date: selectedDate,
            time: selectedTime,
            patientInfo
        })
        alert('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.')
    }

    const handleNext = () => setCurrentStep(currentStep + 1);
    const handleBack = () => setCurrentStep(Math.max(2, currentStep - 1));


    // *** Trong ứng dụng thực tế, nên chuyển bước 1 (chọn bác sĩ/bệnh viện) vào code
    // Hiện tại, để code chạy từ bước 2 theo yêu cầu, tôi giả định một lựa chọn mặc định nếu không có URL param.
    useEffect(() => {
        if (!selectedDoctor && !selectedHospital) {
            // Giả định chọn bác sĩ đầu tiên nếu không có URL param
            setSelectedDoctor(doctors[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // --- Render ---
    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            <AppointmentHeader />

            <AppointmentProgress currentStep={currentStep} />

            <section className="py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Thông tin đã chọn (Hiển thị cố định) */}
                    <SelectedInfoCard
                        selectedDoctor={selectedDoctor}
                        selectedHospital={selectedHospital}
                    />

                    {/* Render Steps */}
                    {currentStep === 2 && (
                        <StepTwoDateTimeSelection
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            timeSlots={timeSlots}
                            setSelectedDate={setSelectedDate}
                            setSelectedTime={setSelectedTime}
                        />
                    )}

                    {currentStep === 3 && (
                        <StepThreePatientInfoForm
                            patientInfo={patientInfo}
                            handlePatientInfoChange={handlePatientInfoChange}
                        />
                    )}

                    {currentStep === 4 && (
                        <StepFourConfirmation
                            selectedDoctor={selectedDoctor}
                            selectedHospital={selectedHospital}
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            patientInfo={patientInfo}
                        />
                    )}

                    {/* Navigation buttons */}
                    <StepNavigation
                        currentStep={currentStep}
                        onBack={handleBack}
                        onNext={handleNext}
                        onSubmit={handleSubmit}
                        isNextDisabled={!isStepValid(currentStep)}
                    />

                </div>
            </section>

            <Footer />
        </main>
    )
}