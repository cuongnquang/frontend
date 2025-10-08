'use client';

import React from 'react';
import { Doctor, Patient } from '@/types/types';
import { Hospital } from '@/app/client/appointments/data';
import { Calendar, Clock, User, Phone, MapPin } from 'lucide-react';

/**
 * Props for the StepFourConfirmation component.
 */
interface StepFourProps {
  selectedDoctor: Doctor | null;
  selectedHospital: Hospital | null;
  selectedDate: Date | null;
  selectedTime: string;
  patientInfo: Partial<Patient>;
}

/**
 * A reusable component to display a piece of information in the confirmation step.
 */
const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value?: string | null }> = ({ icon, label, value }) => (
  <div className="flex items-start py-3">
    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-blue-600">{icon}</div>
    <div className="ml-4">
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      <p className="text-md font-medium text-gray-900">{value || 'N/A'}</p>
    </div>
  </div>
);

/**
 * Component for Step 4: Confirming all appointment details.
 */
export default function StepFourConfirmation({ 
    selectedDoctor, 
    selectedHospital, 
    selectedDate, 
    selectedTime, 
    patientInfo 
}: StepFourProps): React.ReactElement {

  const entity = selectedDoctor || selectedHospital;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">Xác nhận Thông tin Lịch hẹn</h2>
      
      <div className="divide-y divide-gray-200">
        {/* Appointment Details */}
        <InfoRow 
          icon={<User />} 
          label={selectedDoctor ? "Bác sĩ" : "Bệnh viện"} 
          value={entity?.full_name || entity?.name}
        />
        <InfoRow 
          icon={<Calendar />} 
          label="Ngày khám" 
          value={selectedDate ? selectedDate.toLocaleDateString('vi-VN') : 'Chưa chọn'}
        />
        <InfoRow 
          icon={<Clock />} 
          label="Giờ khám" 
          value={selectedTime || 'Chưa chọn'}
        />

        {/* Patient Details */}
        <div className="pt-4">
            <h3 className="text-lg font-bold text-gray-700 mb-2">Thông tin Bệnh nhân</h3>
            <InfoRow icon={<User />} label="Họ và tên" value={patientInfo.full_name} />
            <InfoRow icon={<Phone />} label="Số điện thoại" value={patientInfo.phone_number} />
            <InfoRow icon={<Calendar />} label="Ngày sinh" value={patientInfo.date_of_birth} />
            <InfoRow icon={<User />} label="Giới tính" value={patientInfo.gender} />
            <InfoRow icon={<MapPin />} label="Địa chỉ" value={patientInfo.address} />
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg">
        <p className="font-semibold">Vui lòng kiểm tra kỹ lại toàn bộ thông tin trước khi xác nhận đặt lịch.</p>
      </div>
    </div>
  );
}
