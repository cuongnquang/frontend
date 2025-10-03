import React from 'react'
import { Calendar, Clock, MapPin, Star, AlertCircle } from 'lucide-react'
import { Doctor, PatientInfo, Hospital } from '@/components/client/appointments/AppointmentTypes'

interface StepFourProps {
    selectedDoctor: Doctor | null
    selectedHospital: Hospital | null
    selectedDate: Date | null
    selectedTime: string
    patientInfo: PatientInfo
}

export default function StepFourConfirmation({
    selectedDoctor,
    selectedHospital,
    selectedDate,
    selectedTime,
    patientInfo
}: StepFourProps) {
    const displayGender = patientInfo.gender === 'male' ? 'Nam' :
        patientInfo.gender === 'female' ? 'Nữ' :
            patientInfo.gender === 'other' ? 'Khác' : 'Chưa cung cấp'

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Xác nhận thông tin đặt lịch
            </h2>

            <div className="space-y-6">
                {/* Selected entity info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-blue-600">Thông tin đặt khám</h3>
                    {selectedDoctor && (
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{selectedDoctor.name}</h4>
                                <p className="text-blue-600 text-sm">{selectedDoctor.specialty}</p>
                                <p className="text-gray-600 text-sm">{selectedDoctor.hospital}</p>
                                <p className="font-semibold text-blue-600 text-sm">{selectedDoctor.price}</p>
                            </div>
                        </div>
                    )}
                    {selectedHospital && (
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{selectedHospital.name}</h4>
                                <p className="text-gray-600 text-sm flex items-center"><MapPin className="w-4 h-4 mr-1 text-blue-500" />{selectedHospital.address}</p>
                                <div className="flex items-center mt-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="ml-1 text-sm font-medium text-gray-700">{selectedHospital.rating}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Appointment info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-blue-600">Thông tin lịch hẹn</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                            <span>Ngày: **{selectedDate?.toLocaleDateString('vi-VN')}**</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-5 h-5 text-blue-600 mr-2" />
                            <span>Giờ: **{selectedTime}**</span>
                        </div>
                    </div>
                </div>

                {/* Patient info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-blue-600">Thông tin bệnh nhân</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div><strong>Họ tên:</strong> {patientInfo.fullName}</div>
                        <div><strong>Điện thoại:</strong> {patientInfo.phone}</div>
                        <div><strong>Email:</strong> {patientInfo.email}</div>
                        <div><strong>Ngày sinh:</strong> {patientInfo.birthDate || 'Chưa cung cấp'}</div>
                        <div><strong>Giới tính:</strong> {displayGender}</div>
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
                                <li>Vui lòng có mặt trước **15 phút** so với giờ hẹn</li>
                                <li>Mang theo **CMND/CCCD** và các giấy tờ y tế liên quan</li>
                                <li>Nếu cần hủy lịch, vui lòng thông báo trước 2 giờ</li>
                                <li>Phí khám sẽ được thanh toán trực tiếp tại bệnh viện</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}