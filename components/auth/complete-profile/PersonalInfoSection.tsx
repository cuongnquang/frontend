// @/components/auth/PersonalInfoSection.tsx

import React from 'react'
import { Calendar, MapPin, User as UserIcon } from 'lucide-react'
import InputField from '@/components/ui/InputField'
import SelectField from '@/components/ui/SelectField'

interface Props {
    form: any;
    errors: Record<string, string>;
    onChange: (name: keyof typeof form, value: string) => void;
}

const PersonalInfoSection: React.FC<Props> = ({ form, errors, onChange }) => {
    return (
        <div className="space-y-5">
            <InputField
                icon={<UserIcon />}
                label="CCCD/Mã định danh (*)"
                type="text"
                value={form.identity_number}
                onChange={(v: any) => onChange('identity_number', v)}
                placeholder="Nhập 9 hoặc 12 số CCCD"
            />

            <SelectField
                label="Giới tính (*)"
                value={form.gender}
                onChange={(v) => onChange('gender', v)}
                options={[
                    { value: 'male', label: 'Nam' },
                    { value: 'female', label: 'Nữ' },
                    { value: 'other', label: 'Khác' },
                ]}
                placeholder="Chọn giới tính"
            />

            <InputField
                icon={<Calendar />}
                label="Ngày sinh (*)"
                type="date"
                value={form.date_of_birth}
                onChange={(v: any) => onChange('date_of_birth', v)}
                max={new Date().toISOString().split('T')[0]} 
            />

            <InputField
                icon={<MapPin />}
                label="Địa chỉ (*)"
                value={form.address}
                onChange={(v: any) => onChange('address', v)}
                placeholder="Số nhà, Đường, Quận/Huyện, Tỉnh/TP"
            />
        </div>
    )
}

export default PersonalInfoSection