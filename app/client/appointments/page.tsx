'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Calendar, Clock, CheckCircle, ChevronRight } from 'lucide-react'
import {BookingStep, Doctor, DoctorSchedule, Patient} from '@/types/types'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import DateSelector from '@/components/client/appointments/DateSelector'
import TimeSlotSelector from '@/components/client/appointments/TimeSlotSelector'
import DoctorSidebar from '@/components/client/appointments/DoctorSidebar'
import BookingProgressBar from '@/components/client/appointments/AppointmentsProgressBar'
import PatientForm from '@/components/client/appointments/PatientForm'
import AppointmentConfirmation from '@/components/client/appointments/AppointmentConfirmation'
import { mockDoctors, mockSchedules, mockPatients } from '@/public/data'
// --- Hàm tiện ích ---
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
        display: date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        iso: dateStr // Giữ lại định dạng YYYY-MM-DD
    }
}

// --- Mock Data (Giữ nguyên) ---
const doctor: Doctor = mockDoctors[0];
const schedule: DoctorSchedule[] = mockSchedules;

function AppointmentFlow() {
    const router = useRouter()
    const searchParams = useSearchParams();
    const scheduleId = searchParams.get('scheduleId');

    const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.DATE_TIME)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [selectedSchedule, setSelectedSchedule] = useState<DoctorSchedule | null>(null)
    const [patientData, setPatientData] = useState<Patient>({} as Patient) 
    const [symptoms, setSymptoms] = useState('')
    const [notes, setNotes] = useState('')

    useEffect(() => {
        if (scheduleId) {
            const preSelectedSchedule = schedule.find(s => s.schedule_id === scheduleId);
            if (preSelectedSchedule) {
                setSelectedSchedule(preSelectedSchedule);
                setSelectedDate(preSelectedSchedule.schedule_date);
                setCurrentStep(BookingStep.PROFILE);
            }
        }
    }, [scheduleId]);
    

    // Load mock patient data
    useEffect(() => {
        const patient: Patient = mockPatients[0]

        setPatientData(patient)
    }, [])
    
    // Group schedules by date
    const groupedSchedules = useMemo(() => {
        const grouped: { [key: string]: DoctorSchedule[] } = {}
        schedule.forEach(schedule => {
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
        
        setSelectedSchedule(null)
        setSelectedDate(null)
        setSymptoms('')
        setNotes('')
        router.push('/')
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

// --- Main Page Component ---
export default function AppointmentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AppointmentFlow />
        </Suspense>
    )
}