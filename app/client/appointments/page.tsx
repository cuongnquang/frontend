'use client'

import { useState, useEffect, useMemo, Suspense, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Calendar, Clock, CheckCircle, ChevronRight, AlertCircle } from 'lucide-react'
import {BookingStep, Doctor, DoctorSchedule, Patient, Appointment} from '@/types/types'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import Alert from '@/components/ui/Alert'
import DateSelector from '@/components/client/appointments/DateSelector'
import TimeSlotSelector from '@/components/client/appointments/TimeSlotSelector'
import { apiClient } from '@/lib/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
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

function AppointmentFlow() {
    const router = useRouter()
    const searchParams = useSearchParams();
    const doctorIdFromQuery = searchParams.get('doctorId');
    const scheduleId = searchParams.get('scheduleId');

    const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.DATE_TIME)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [selectedSchedule, setSelectedSchedule] = useState<DoctorSchedule | null>(null)
    const [patientData, setPatientData] = useState<Patient | null>(null)
    const [symptoms, setSymptoms] = useState('')
    const [notes, setNotes] = useState('')

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                let doctorId = doctorIdFromQuery;
                if (doctorId === 'undefined') {
                    doctorId = null;
                }

                let fetchedSchedules: DoctorSchedule[] = [];

                // 1. Determine Doctor ID
                if (scheduleId && !doctorId) {
                    const scheduleRes = await apiClient<DoctorSchedule>(`/v1/schedules/${scheduleId}`);
                    if (scheduleRes.status && scheduleRes.data) {
                        const scheduleData = scheduleRes.data as DoctorSchedule;
                        doctorId = scheduleData.doctor_id;
                        setSelectedSchedule(scheduleData);
                        setSelectedDate(scheduleData.schedule_date);
                        setCurrentStep(BookingStep.PROFILE);
                    } else {
                        throw new Error("Không tìm thấy lịch khám.");
                    }
                }

                if (!doctorId) {
                    throw new Error("Không có thông tin bác sĩ.");
                }

                // 2. Fetch Doctor and Schedules
                const doctorRes = apiClient<Doctor>(`/v1/doctors/${doctorId}`);
                const schedulesRes = apiClient<DoctorSchedule[]>(`/v1/doctors/${doctorId}/schedules`);
                const patientRes = apiClient<Patient>('/v1/patients/me');

                const [doc, sched, pat] = await Promise.all([doctorRes, schedulesRes, patientRes]);

                if (doc.status && doc.data) {
                    setDoctor(doc.data as Doctor);
                } else {
                    throw new Error("Không thể tải thông tin bác sĩ.");
                }

                if (sched.status && sched.data) {
                    fetchedSchedules = sched.data as DoctorSchedule[];
                    setSchedules(fetchedSchedules);
                } else {
                    // Silently fail on schedules for now, maybe doctor has no schedule
                }

                if (pat.status && pat.data) {
                    setPatientData(pat.data as Patient);
                } else {
                    // It's possible user is not logged in or has no patient profile
                    // We can create a blank one
                    setPatientData({} as Patient);
                }

                // If scheduleId was passed, find it in the full list
                if (scheduleId && !selectedSchedule) {
                    const preSelected = fetchedSchedules.find(s => s.schedule_id === scheduleId);
                    if (preSelected) {
                        setSelectedSchedule(preSelected);
                        setSelectedDate(preSelected.schedule_date);
                        setCurrentStep(BookingStep.PROFILE);
                    }
                }

            } catch (e: any) {
                setError(e.message || "Đã có lỗi xảy ra khi tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [scheduleId, doctorIdFromQuery]);
    
    // Group schedules by date
    const groupedSchedules = useMemo(() => {
        const grouped: { [key: string]: DoctorSchedule[] } = {}
        schedules.forEach(schedule => {
            if (!grouped[schedule.schedule_date]) {
                grouped[schedule.schedule_date] = []
            }
            grouped[schedule.schedule_date].push(schedule)
        })
        return grouped
    }, [schedules])
    
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
        setPatientData(prev => prev && ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = useCallback(async () => {
        if (!doctor || !selectedSchedule || !patientData) {
            setSubmitError("Thiếu thông tin cần thiết để đặt lịch.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const appointmentData = {
                doctor_id: doctor.doctor_id,
                schedule_id: selectedSchedule.schedule_id,
                symptoms: symptoms,
                notes: notes,
            };

            const response = await apiClient<Appointment>('/v1/appointments', {
                method: 'POST',
                body: JSON.stringify(appointmentData),
            });

            if (response.status && response.data) {
                alert('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
                router.push('/client/me/appointments');
            } else {
                throw new Error(response.message || "Đặt lịch thất bại. Vui lòng thử lại.");
            }
        } catch (e: any) {
            setSubmitError(e.message || "Đã có lỗi xảy ra. Vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false);
        }
    }, [doctor, selectedSchedule, patientData, symptoms, notes, router]);

    // --- Điều kiện chuyển bước ---
    const canProceedStep1 = selectedSchedule !== null
    const canProceedStep2 = !!patientData?.full_name && !!patientData?.phone_number && !!patientData?.date_of_birth && !!symptoms

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
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <LoadingSpinner />
                    </div>
                )}
                {submitError && (
                    <Alert message={submitError} type="error" duration={5000} />
                )}
                {error && !loading && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative max-w-3xl mx-auto" role="alert">
                        <strong className="font-bold flex items-center"><AlertCircle className="w-5 h-5 mr-2"/>Lỗi!</strong>
                        <span className="block sm:inline ml-8">{error}</span>
                    </div>
                )}
                {!loading && !error && doctor && patientData && (

                
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
                                    isSubmitting={isSubmitting}
                                />
                            )}
                        </div>
                    </div>
                </div>
                )}
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