'use client';

import React from 'react';
import { Patient, Gender } from '@/types/types';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import { User, Phone, Calendar as CalendarIcon, MapPin, Info } from 'lucide-react';

/**
 * Props for the StepThreePatientInfoForm component.
 */
interface StepThreeProps {
  patientInfo: Partial<Patient>;
  handlePatientInfoChange: (field: keyof Patient, value: string | Gender) => void;
}

/**
 * Component for Step 3: Entering patient information.
 */
export default function StepThreePatientInfoForm({ patientInfo, handlePatientInfoChange }: StepThreeProps): React.ReactElement {
  const genderOptions = Object.values(Gender).map(gender => ({
    value: gender,
    label: gender.charAt(0).toUpperCase() + gender.slice(1),
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Thông tin Bệnh nhân</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Họ và Tên"
          value={patientInfo.full_name || ''}
          onChange={(value: string) => handlePatientInfoChange('full_name', value)}
          placeholder="Nguyễn Văn A"
          icon={<User className='w-5 h-5 text-gray-400' />}
        />
        <InputField
          label="Số điện thoại"
          value={patientInfo.phone_number || ''}
          onChange={(value: string) => handlePatientInfoChange('phone_number', value)}
          placeholder="09xxxxxxxx"
          icon={<Phone className='w-5 h-5 text-gray-400' />}
        />
        <InputField
          label="Ngày sinh"
          type="date"
          value={patientInfo.date_of_birth || ''}
          onChange={(value: string) => handlePatientInfoChange('date_of_birth', value)}
          icon={<CalendarIcon className='w-5 h-5 text-gray-400' />}
        />
        <SelectField
          label="Giới tính"
          value={patientInfo.gender || ''}
          onChange={(value: string) => handlePatientInfoChange('gender', value as Gender)}
          options={genderOptions}
        />
        <div className="md:col-span-2">
            <InputField
              label="Địa chỉ"
              value={patientInfo.address || ''}
              onChange={(value: string) => handlePatientInfoChange('address', value)}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
              icon={<MapPin className='w-5 h-5 text-gray-400' />}
            />
        </div>
        <div className="md:col-span-2">
            <InputField
              label="Triệu chứng hoặc lý do khám"
              value={patientInfo.symptoms || ''}
              onChange={(value: string) => handlePatientInfoChange('symptoms', value)}
              placeholder="Ho, sốt, đau đầu,..."
              icon={<Info className='w-5 h-5 text-gray-400' />}
            />
        </div>
      </div>
    </div>
  );
}
