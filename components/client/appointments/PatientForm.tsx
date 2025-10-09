import { User, Calendar, FileText, ChevronRight, ChevronLeft } from 'lucide-react'
import { Patient, Gender } from '@/types/types'

interface PatientFormProps {
    patientData: Patient
    symptoms: string
    notes: string
    canProceed: boolean
    handlePatientDataChange: (field: keyof Patient, value: string) => void
    setSymptoms: (value: string) => void
    setNotes: (value: string) => void
    onBack: () => void
    onNext: () => void
}

export default function PatientForm({ 
    patientData, 
    symptoms, 
    notes, 
    canProceed, 
    handlePatientDataChange, 
    setSymptoms, 
    setNotes,
    onBack,
    onNext
}: PatientFormProps) {

    return (
        <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Bước 2: Thông tin bệnh nhân</h2>
            
            {/* Form fields */}
            <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                {/* Full Name */}
                <div className="md:col-span-1">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 mr-2 text-blue-600" />Họ và tên <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input type="text" value={patientData.full_name} onChange={(e) => handlePatientDataChange('full_name', e.target.value)} className="w-full px-4 py-3 text-black focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Nhập họ và tên đầy đủ" required />
                </div>
                {/* Phone */}
                <div className="md:col-span-1">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 mr-2 text-blue-600" />Số điện thoại <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input type="tel" value={patientData.phone_number} onChange={(e) => handlePatientDataChange('phone_number', e.target.value)} className="w-full px-4 py-3 text-black focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0123 456 789" required />
                </div>
                {/* Date of Birth */}
                <div className="md:col-span-1">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 mr-2 text-blue-600" />Ngày sinh <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input type="date" value={patientData.date_of_birth} onChange={(e) => handlePatientDataChange('date_of_birth', e.target.value)} className="w-full px-4 py-3 text-black focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                {/* Gender */}
                <div className="md:col-span-1">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 mr-2 text-blue-600" />Giới tính
                    </label>
                    <select value={patientData.gender} onChange={(e) => handlePatientDataChange('gender', e.target.value as Gender)} className="w-full px-4 py-3 text-black focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                        <option value={Gender.MALE}>Nam</option>
                        <option value={Gender.FEMALE}>Nữ</option>
                        <option value={Gender.OTHER}>Khác</option>
                    </select>
                </div>
                {/* Identity Number */}
                <div className="md:col-span-1">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4 mr-2 text-blue-600" />CMND/CCCD
                    </label>
                    <input type="text" value={patientData.identity_number || ''} onChange={(e) => handlePatientDataChange('identity_number', e.target.value)} className="w-full px-4 py-3 text-black focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Số CMND/CCCD (Tùy chọn)" />
                </div>
                {/* Health Insurance */}
                <div className="md:col-span-1">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4 mr-2 text-blue-600" />Số thẻ BHYT
                    </label>
                    <input type="text" value={patientData.health_insurance_number || ''} onChange={(e) => handlePatientDataChange('health_insurance_number', e.target.value)} className="w-full px-4 py-3 text-black focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Số thẻ bảo hiểm y tế (Tùy chọn)" />
                </div>
                {/* Address */}
                <div className="md:col-span-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4 mr-2 text-blue-600" />Địa chỉ
                    </label>
                    <input type="text" value={patientData.address || ''} onChange={(e) => handlePatientDataChange('address', e.target.value)} className="w-full px-4 py-3 border border-gray-300 text-black focus:outline-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Nhập địa chỉ (Tùy chọn)" />
                </div>
                {/* Symptoms (Full Width) */}
                <div className="md:col-span-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4 mr-2 text-blue-600" />Triệu chứng <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={3} className="w-full px-4 py-3 border border-gray-300 text-black focus:outline-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Mô tả triệu chứng của bạn (Ví dụ: Đau ngực, khó thở, ho kéo dài...)" required></textarea>
                </div>
                {/* Notes (Full Width) */}
                <div className="md:col-span-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4 mr-2 text-blue-600" />Ghi chú thêm
                    </label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full px-4 py-3 border border-gray-300 text-black focus:outline-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Thông tin bổ sung (Lịch sử bệnh, yêu cầu đặc biệt...)"></textarea>
                </div>
            </div>

            <div className="flex justify-between mt-8 pt-4 border-t">
                <button onClick={onBack} className="px-6 py-3 rounded-lg font-medium flex items-center text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors">
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Quay lại
                </button>
                <button onClick={onNext} disabled={!canProceed} className={`px-8 py-3 rounded-lg font-semibold text-lg flex items-center transition-all ${canProceed ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                    Tiếp theo
                    <ChevronRight className="w-6 h-6 ml-2" />
                </button>
            </div>
        </div>
    )
}