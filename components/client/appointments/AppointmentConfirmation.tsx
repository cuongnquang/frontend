import { Clock, User, Award, Calendar, FileText, CheckCircle, ChevronLeft } from 'lucide-react'
import { Doctor, DoctorSchedule, Patient } from '@/types/types'

interface AppointmentConfirmationProps {
    doctor: Doctor
    selectedSchedule: DoctorSchedule
    patientData: Patient
    symptoms: string
    notes: string
    formatDate: (dateStr: string) => { display: string, iso: string }
    onBack: () => void
    onSubmit: () => void
}

export default function AppointmentConfirmation({
    doctor,
    selectedSchedule,
    patientData,
    symptoms,
    notes,
    formatDate,
    onBack,
    onSubmit
}: AppointmentConfirmationProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Bước 3: Xác nhận thông tin đặt lịch</h2>
            
            {/* Appointment Info */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-300">
                <h3 className="font-bold text-xl text-blue-800 mb-4 flex items-center"><Clock className="w-6 h-6 mr-2" />Thông tin lịch hẹn</h3>
                <div className="space-y-3 text-base">
                    <div className="grid grid-cols-3">
                        <span className="font-medium text-gray-700 flex items-center"><Calendar className="w-4 h-4 mr-2 text-blue-600" /> Ngày khám:</span>
                        <span className="font-semibold text-blue-700">{formatDate(selectedSchedule.schedule_date).display}</span>
                    </div>
                    <div className="grid grid-cols-3">
                        <span className="font-medium text-gray-700 flex items-center"><Clock className="w-4 h-4 mr-2 text-blue-600" /> Khung giờ:</span>
                        <span className="font-semibold text-blue-700">{selectedSchedule.start_time} - {selectedSchedule.end_time}</span>
                    </div>
                    <div className="grid grid-cols-3">
                        <span className="font-medium text-gray-700 flex items-center"><User className="w-4 h-4 mr-2 text-blue-600" /> Bác sĩ:</span>
                        <span className="text-gray-900">{doctor.full_name}</span>
                    </div>
                    <div className="grid grid-cols-3">
                        <span className="font-medium text-gray-700 flex items-center"><Award className="w-4 h-4 mr-2 text-blue-600" /> Chuyên khoa:</span>
                        <span className="text-gray-900">{doctor.Specialty.name}</span>
                    </div>
                </div>
            </div>
            
            {/* Patient Info */}
            <div className="border border-gray-300 rounded-lg p-6 mt-6">
                <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center"><User className="w-6 h-6 mr-2 text-blue-600" />Thông tin bệnh nhân</h3>
                <div className="space-y-3 text-base">
                    <div className="grid grid-cols-3"><span className="font-medium text-gray-700">Họ và tên:</span><span className="text-gray-800 font-semibold">{patientData.full_name}</span></div>
                    <div className="grid grid-cols-3"><span className="font-medium text-gray-700">Số ĐT:</span><span className="text-gray-800">{patientData.phone_number}</span></div>
                    <div className="grid grid-cols-3"><span className="font-medium text-gray-700">Ngày sinh:</span><span className="text-gray-800">{new Date(patientData.date_of_birth).toLocaleDateString('vi-VN')}</span></div>
                    <div className="border-t pt-3 mt-3"><span className="font-medium text-gray-700 block mb-1">Triệu chứng:</span><p className="text-gray-800 italic bg-gray-50 p-2 rounded-md">{symptoms}</p></div>
                    {notes && (<div><span className="font-medium text-gray-700 block mb-1">Ghi chú thêm:</span><p className="text-gray-800 italic bg-gray-50 p-2 rounded-md">{notes}</p></div>)}
                </div>
            </div>

            {/* Note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 shadow-sm mt-6">
                <p className="text-sm text-gray-700 flex items-start"><FileText className="w-5 h-5 mr-2 text-yellow-600 flex-shrink-0 mt-0.5" /><span><strong>Lưu ý quan trọng:</strong> Vui lòng đến trước giờ hẹn **15 phút**...</span></p>
            </div>

            <div className="flex justify-between mt-8 pt-4 border-t">
                <button onClick={onBack} className="px-6 py-3 rounded-lg font-medium flex items-center text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors">
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Quay lại
                </button>
                <button onClick={onSubmit} className="px-8 py-3 rounded-lg font-semibold text-lg flex items-center bg-blue-600 text-white hover:bg-blue-700 shadow-lg transform hover:scale-[1.01] transition-transform">
                    <CheckCircle className="w-6 h-6 mr-2" />
                    Xác nhận & Đặt lịch
                </button>
            </div>
        </div>
    )
}