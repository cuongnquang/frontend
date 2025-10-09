'use client'

import { useState, useEffect, useMemo } from 'react'
import { Calendar, Clock, CheckCircle, ChevronRight } from 'lucide-react'
import {BookingStep, Doctor, DoctorSchedule, Patient, Gender} from '@/types/types'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import DateSelector from '@/components/client/appointments/DateSelector'
import TimeSlotSelector from '@/components/client/appointments/TimeSlotSelector'
import DoctorSidebar from '@/components/client/appointments/DoctorSidebar'
import BookingProgressBar from '@/components/client/appointments/AppointmentsProgressBar'
import PatientForm from '@/components/client/appointments/PatientForm'
import AppointmentConfirmation from '@/components/client/appointments/AppointmentConfirmation'

// --- Hàm tiện ích ---
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
        display: date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        iso: dateStr // Giữ lại định dạng YYYY-MM-DD
    }
}

// --- Mock Data (Giữ nguyên) ---
const doctor: Doctor = {
    doctor_id: 'doc_001',
    user_id: 'user_001',
    specialty_id: 'spec_001',
    full_name: 'BS.CK2. Nguyễn Văn An',
    title: 'Bác sĩ Chuyên khoa 2',
    introduction: 'Bác sĩ có hơn 15 năm kinh nghiệm trong lĩnh vực Tim mạch, từng công tác tại nhiều bệnh viện lớn.',
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    specializations: 'Tim mạch, Huyết áp, Rối loạn nhịp tim',
    work_experience: 'Bệnh viện Chợ Rẫy (2008-2015), Bệnh viện Đại học Y Dược (2015-hiện tại)',
    achievements: 'Giải thưởng Thầy thuốc trẻ xuất sắc 2018, Nhiều công trình nghiên cứu về Tim mạch',
    experience_years: 15,
    is_available: true,
    Specialty: {
        specialty_id: 'spec_001',
        name: 'Tim mạch',
        description: 'Chuyên khoa Tim mạch'
    }
}

const availableSchedules: DoctorSchedule[] = [
    { schedule_id: 'sch_001', doctor_id: 'doc_001', schedule_date: '2025-10-10', start_time: '08:00', end_time: '08:30', is_available: true, created_at: '', updated_at: '' },
    { schedule_id: 'sch_002', doctor_id: 'doc_001', schedule_date: '2025-10-10', start_time: '09:00', end_time: '09:30', is_available: true, created_at: '', updated_at: '' },
    { schedule_id: 'sch_003', doctor_id: 'doc_001', schedule_date: '2025-10-11', start_time: '14:00', end_time: '14:30', is_available: true, created_at: '', updated_at: '' },
    { schedule_id: 'sch_004', doctor_id: 'doc_001', schedule_date: '2025-10-12', start_time: '08:00', end_time: '08:30', is_available: true, created_at: '', updated_at: '' },
    { schedule_id: 'sch_005', doctor_id: 'doc_001', schedule_date: '2025-10-12', start_time: '10:00', end_time: '10:30', is_available: true, created_at: '', updated_at: '' },
]

// --- Main Page Component ---
export default function AppointmentPage() {
    const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.DATE_TIME)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [selectedSchedule, setSelectedSchedule] = useState<DoctorSchedule | null>(null)
    const [patientData, setPatientData] = useState<Patient>({} as Patient) 
    const [symptoms, setSymptoms] = useState('')
    const [notes, setNotes] = useState('')

    // Load mock patient data
    useEffect(() => {
        const mockPatientData: Patient = {
            patient_id: 'pat_001',
            user_id: 'user_002',
            full_name: 'Trần Thị Bình',
            identity_number: '079123456789',
            phone_number: '0901234567',
            date_of_birth: '1990-05-15',
            gender: Gender.FEMALE,
            address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
            ethnicity: 'Kinh',
            health_insurance_number: 'HS1234567890',
            occupation: 'Nhân viên văn phòng',
            created_at: '2024-01-01',
            updated_at: '2024-01-01'
        }
        setPatientData(mockPatientData)
    }, [])
    
    // Group schedules by date
    const groupedSchedules = useMemo(() => {
        const grouped: { [key: string]: DoctorSchedule[] } = {}
        availableSchedules.forEach(schedule => {
            if (!grouped[schedule.schedule_date]) {
                grouped[schedule.schedule_date] = []
            }
            grouped[schedule.schedule_date].push(schedule)
        })
        return grouped
    }, [])
    
    const availableDates = Object.keys(groupedSchedules)

    // Schedules cho ngày được chọn
    const schedulesForSelectedDate = selectedDate ? groupedSchedules[selectedDate] || [] : []

    // --- Handlers ---
    const handleSelectDate = (date: string) => {
        if (selectedDate === date) {
            setSelectedDate(null)
            setSelectedSchedule(null)
        } else {
            setSelectedDate(date)
            setSelectedSchedule(null) 
        }
    }

    const handleSelectSchedule = (schedule: DoctorSchedule) => {
        setSelectedSchedule(schedule)
    }

    const handlePatientDataChange = (field: keyof Patient, value: string) => {
        setPatientData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = () => {
        console.log('Appointment data submitted!')
        alert('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.')
        setCurrentStep(BookingStep.DATE_TIME)
        setSelectedSchedule(null)
        setSelectedDate(null)
        setSymptoms('')
        setNotes('')
    }

    // --- Điều kiện chuyển bước ---
    const canProceedStep1 = selectedSchedule !== null
    const canProceedStep2 = !!patientData.full_name && !!patientData.phone_number && !!patientData.date_of_birth && !!symptoms

    return (
        <div>
            <Header/>
        <div className="min-h-screen bg-gray-50">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-2">Đặt Lịch Khám Bệnh</h1>
                    <p className="text-blue-100">Đặt lịch với bác sĩ chuyên khoa một cách nhanh chóng</p>
                </div>
            </div>

            {/* Progress Steps */}
            <BookingProgressBar currentStep={currentStep} />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Doctor Info Sidebar */}
                        <DoctorSidebar doctor={doctor} />

                        {/* Main Content Area (Steps) */}
                        <div className="lg:col-span-2">
                            {/* Step 1: Chọn ngày giờ */}
                            {currentStep === BookingStep.DATE_TIME && (
                                <div className="bg-white rounded-xl shadow-lg p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Bước 1: Chọn lịch khám</h2>
                                    
                                    <div className="mb-6">
                                        <h3 className="font-bold text-xl text-gray-900 mb-3 flex items-center">
                                            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                                            Chọn Ngày
                                        </h3>
                                        <DateSelector
                                            availableDates={availableDates}
                                            selectedDate={selectedDate}
                                            onSelectDate={handleSelectDate}
                                        />
                                    </div>

                                    {/* Time Slot Selector (Chỉ hiện thị khi đã chọn ngày) */}
                                    {selectedDate && (
                                        <div className="mt-8">
                                            <TimeSlotSelector
                                                schedules={schedulesForSelectedDate}
                                                selectedSchedule={selectedSchedule}
                                                onSelectSchedule={handleSelectSchedule}
                                            />
                                        </div>
                                    )}

                                    {/* Summary */}
                                    <div className={`mt-6 p-4 rounded-lg text-sm transition-all ${selectedSchedule ? 'bg-green-50 border border-green-300' : 'bg-gray-100 border border-gray-300'}`}>
                                        <p className="font-semibold text-gray-700 flex items-center">
                                            {selectedSchedule ? (
                                                <CheckCircle className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
                                            ) : (
                                                <Clock className="w-5 h-5 mr-2 text-gray-500 flex-shrink-0" />
                                            )}
                                            {selectedSchedule 
                                                ? `Lịch hẹn đã chọn: ${selectedSchedule.start_time} ngày ${formatDate(selectedSchedule.schedule_date).display}`
                                                : 'Vui lòng chọn ngày và khung giờ khám để tiếp tục.'
                                            }
                                        </p>
                                    </div>

                                    <div className="flex justify-end mt-8 pt-4 border-t">
                                        <button
                                            onClick={() => setCurrentStep(BookingStep.PROFILE)}
                                            disabled={!canProceedStep1}
                                            className={`px-8 py-3 rounded-lg font-semibold text-lg flex items-center transition-all ${
                                                canProceedStep1
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            Tiếp theo
                                            <ChevronRight className="w-6 h-6 ml-2" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Nhập thông tin */}
                            {currentStep === BookingStep.PROFILE && (
                                <PatientForm
                                    patientData={patientData}
                                    symptoms={symptoms}
                                    notes={notes}
                                    canProceed={canProceedStep2}
                                    handlePatientDataChange={handlePatientDataChange}
                                    setSymptoms={setSymptoms}
                                    setNotes={setNotes}
                                    onBack={() => setCurrentStep(BookingStep.DATE_TIME)}
                                    onNext={() => setCurrentStep(BookingStep.CONFIRMATION)}
                                />
                            )}

                            {/* Step 3: Xác nhận */}
                            {currentStep === BookingStep.CONFIRMATION && selectedSchedule && (
                                <AppointmentConfirmation
                                    doctor={doctor}
                                    selectedSchedule={selectedSchedule}
                                    patientData={patientData}
                                    symptoms={symptoms}
                                    notes={notes}
                                    formatDate={formatDate}
                                    onBack={() => setCurrentStep(BookingStep.PROFILE)}
                                    onSubmit={handleSubmit}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        <Footer/>
        </div>
    )
}