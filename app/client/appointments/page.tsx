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
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { apiClient } from '@/lib/api'
import { toYYYYMMDD } from '@/lib/utils'; // Import toYYYYMMDD
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

    // ✅ Tối ưu: Nếu có scheduleId từ URL, bắt đầu ngay từ bước nhập thông tin.
    const [currentStep, setCurrentStep] = useState<BookingStep>(
        scheduleId ? BookingStep.PROFILE : BookingStep.DATE_TIME
    );
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedSchedule, setSelectedSchedule] = useState<DoctorSchedule | null>(null)
    const [patientData, setPatientData] = useState<Patient | null>(null)
    const [symptoms, setSymptoms] = useState('')
    const [notes, setNotes] = useState('')
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    // const [availableDates, setAvailableDates] = useState<string[]>([]); // Sẽ được thay thế bằng useMemo
    const [allSchedules, setAllSchedules] = useState<DoctorSchedule[]>([]);
    const [schedulesForSelectedDate, setSchedulesForSelectedDate] = useState<DoctorSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchCoreData = useCallback(async (doctorId: string) => {
        const doctorRes = apiClient<Doctor>(`/api/doctors/${doctorId}`);
        // Thay vì chỉ lấy ngày, ta lấy tất cả lịch khám có sẵn
        const allSchedulesRes = apiClient<DoctorSchedule[]>(
            `/api/schedules?doctor_id=${doctorId}`
        );
        const patientRes = apiClient<Patient>('/api/patients/me');

        const [doc, schedules, pat] = await Promise.all([doctorRes, allSchedulesRes, patientRes]);
        let scheduleData: DoctorSchedule[] = [];
 
        if (doc.status && doc.data) {
            setDoctor(doc.data as Doctor);
        } else {
            throw new Error("Không thể tải thông tin bác sĩ.");
        }
 
        if (schedules.status && schedules.data) {
            // The data from the API should already be in the correct format.
            const filteredSchedules = (schedules.data as DoctorSchedule[]).filter(s => s.doctor_id === doctorId);
            scheduleData = filteredSchedules;
            setAllSchedules(scheduleData); 
            if (scheduleData.length === 0) {
                setError("Bác sĩ hiện không có lịch khám nào. Vui lòng quay lại sau.");
            }
        } else {
            setAllSchedules([]);
            // Sử dụng message từ API nếu có, nếu không thì dùng message mặc định
            const errorMessage = schedules.message || "Không thể tải được lịch làm việc của bác sĩ.";
            setError(errorMessage);
        }
 
        if (pat.status && pat.data) {
            setPatientData(pat.data as Patient);
        } else {         
            setError("Bạn cần đăng nhập và có hồ sơ bệnh nhân để đặt lịch. Đang chuyển hướng...");
            router.push(`/auth/login`);
        }

        return scheduleData;
    }, [router]); // Wrap in useCallback with an empty dependency array to ensure it's created only once.
 
    // Dùng useMemo để tính toán các ngày có sẵn từ tất cả lịch khám
    // Chỉ tính toán lại khi `allSchedules` thay đổi
    const availableDates = useMemo(() => {
        const dateStrings = new Set(allSchedules.map(s => s.schedule_date.split('T')[0]));
        // Chuyển đổi chuỗi YYYY-MM-DD thành đối tượng Date.
        // Thêm 'T00:00:00' để tránh các vấn đề về múi giờ khi new Date()
        return Array.from(dateStrings).map(dateStr => new Date(dateStr + 'T00:00:00'));
    }, [allSchedules]);

    // Logic fetchTimeSlotsForDate không còn cần thiết vì đã có allSchedules
    // Tuy nhiên, ta vẫn giữ lại để tương thích với logic khởi tạo từ scheduleId
    // và sẽ điều chỉnh handleSelectDate
     useEffect(() => {
        const initialize = async () => {
            setLoading(true);
            setError(null);            // Lấy doctorId trực tiếp từ query params. Đây là nguồn tin cậy.
            const doctorIdToFetch = doctorIdFromQuery;

            try {
                 // Nếu không có doctorId, không thể tiếp tục.
                 if (!doctorIdToFetch) {
                     throw new Error("Không có thông tin bác sĩ để tải.");
                 }
 
                 // Tải tất cả dữ liệu cốt lõi chỉ với doctorId.
                 const fetchedSchedules = await fetchCoreData(doctorIdToFetch);
 
                 // Sau khi đã có tất cả lịch khám, nếu có scheduleId từ URL,
                 // chúng ta sẽ tìm và chọn lịch khám tương ứng trong danh sách đã tải.
                 if (scheduleId) {
                     // Tìm lịch khám tương ứng trong danh sách vừa tải về.
                     const scheduleToSelect = fetchedSchedules.find(s => s.id === scheduleId);
                     if (scheduleToSelect) {
                         handleSelectSchedule(scheduleToSelect, true, fetchedSchedules); // Chọn lịch và ngày tương ứng
                     }
                 }
            } catch (e: any) {
                setError(e.message || "Đã có lỗi xảy ra khi tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };
        initialize(); // Chỉ chạy một lần khi component được mount.
    }, [scheduleId, doctorIdFromQuery, fetchCoreData]);
     
    // --- Handlers ---
    const handleSelectDate = useCallback((date: Date) => { // Expect Date directly
        const newSelectedDate = date; // Already a Date object from DateSelector
        
        // So sánh ngày bằng cách chuyển về mili-giây
        if (selectedDate?.getTime() === newSelectedDate.getTime()) {
            setSelectedDate(null)
            setSelectedSchedule(null)
            setSchedulesForSelectedDate([]);
        } else {
            setSelectedDate(newSelectedDate);
            // Sử dụng toYYYYMMDD với đối tượng Date đã được chuẩn hóa
            const dateString = toYYYYMMDD(newSelectedDate);
            // Lọc các lịch khám cho ngày đã chọn từ `allSchedules`
            const schedulesForDate = allSchedules.filter(s => s.schedule_date.startsWith(dateString));
            setSchedulesForSelectedDate(schedulesForDate);
            setSelectedSchedule(null); // Reset lựa chọn khung giờ sau khi đã cập nhật danh sách mới
        }
    }, [selectedDate, allSchedules, toYYYYMMDD]);

    const handleSelectSchedule = (schedule: DoctorSchedule, shouldUpdateDate: boolean = false, scheduleSource: DoctorSchedule[] = allSchedules) => {
        setSelectedSchedule(schedule);
        // Nếu được yêu cầu (khi khởi tạo từ scheduleId), cập nhật cả ngày đã chọn
        if (shouldUpdateDate) {
            const date = new Date(schedule.schedule_date.split('T')[0] + 'T00:00:00');
            setSelectedDate(date);
            const dateString = toYYYYMMDD(date);
            const schedulesForDate = scheduleSource.filter(s => s.schedule_date.startsWith(dateString));
            setSchedulesForSelectedDate(schedulesForDate);
        }
    }

    const handlePatientDataChange = (field: keyof Patient, value: string) => {
        setPatientData(prev => {
            // Chỉ cập nhật nếu `prev` không phải là null
            if (!prev) return null;
            return {
                ...prev, [field]: value
            };
        })
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
                doctor_id: doctor.id, // patient_id sẽ được backend tự động lấy từ token
                schedule_id: selectedSchedule.id,
                symptoms: symptoms,
                notes: notes,
                status: 'pending', // Sửa lại thành chữ thường để khớp với yêu cầu của backend
            };

            const response = await apiClient<Appointment>('/api/appointments', {
                method: 'POST',
                body: JSON.stringify(appointmentData),
            });

            if (response.status && response.data) {
                setSubmitError(null);
                setSuccessMessage('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
                setTimeout(() => {
                    router.push('/');
                }, 1500);
                return;
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
    const canProceedStep2 = !!patientData?.full_name && 
                            !!patientData?.phone_number && 
                            !!patientData?.date_of_birth && 
                            !!patientData?.gender && 
                            !!patientData?.address && 
                            !!symptoms

    return (
        <div>
            <Header/>
        <div className="min-h-screen bg-gray-50">
            {/* Success Alert */}
            {successMessage && (
                <Alert message={successMessage} type="success" duration={3000} onClose={() => setSuccessMessage(null)} />
            )}
            
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
                {!loading && doctor && patientData && (

                
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
                                        <div className="mt-8 transition-all duration-300">
                                            {/* Hiển thị thông báo nếu không có lịch khám hoặc không có khung giờ nào.
                                                Sử dụng toYYYYMMDD(selectedDate) để đảm bảo so sánh đúng */}
                                            {!allSchedules.some(s => s.schedule_date.startsWith(toYYYYMMDD(selectedDate))) ? (
                                                <div className="text-center text-gray-500 bg-gray-100 p-4 rounded-lg">
                                                    Bác sĩ không có lịch khám vào ngày này. Vui lòng chọn ngày khác.
                                                </div>
                                            ) : schedulesForSelectedDate.length === 0 ? (
                                                <div className="text-center text-gray-500 bg-gray-100 p-4 rounded-lg">
                                                    Không còn khung giờ nào trống cho ngày này. Vui lòng chọn ngày khác.
                                                </div>
                                            ) : null}
                                            {/* Chỉ hiển thị TimeSlotSelector khi có lịch khám */}
                                            {schedulesForSelectedDate.length > 0 && (
                                                <TimeSlotSelector
                                                    schedules={schedulesForSelectedDate}
                                                    selectedSchedule={selectedSchedule}
                                                    onSelectSchedule={handleSelectSchedule}
                                                    error={error} />
                                            )}
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
                            {currentStep === BookingStep.PROFILE && patientData && (
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
                            {currentStep === BookingStep.CONFIRMATION && doctor && selectedSchedule && patientData && (
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