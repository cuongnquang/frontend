// @/components/auth/AdditionalInfoSection.tsx

import React from 'react'
import { CreditCard, Briefcase, Hash, Globe } from 'lucide-react'
import InputField from '@/components/ui/InputField'

interface Props {
    form: any;
    errors: Record<string, string>;
    onChange: (name: keyof typeof form, value: string) => void;
}

const AdditionalInfoSection: React.FC<Props> = ({ form, errors, onChange }) => {
    return (
        <div className="space-y-5">
            
            {/* Dân tộc (ethnicity) */}
            <InputField
                icon={<Globe />}
                label="Dân tộc"
                type="text"
                value={form.ethnicity}
                onChange={(v: any) => onChange('ethnicity', v)}
                placeholder="Ví dụ: Kinh"
            />

            {/* Số thẻ BHYT (health_insurance_number) */}
            <InputField
                icon={<CreditCard />}
                label="Số thẻ BHYT"
                type="text"
                value={form.health_insurance_number}
                onChange={(v: any) => onChange('health_insurance_number', v)}
                placeholder="Ví dụ: DN4012300000000"
            />

            {/* Nghề nghiệp (occupation) */}
            <InputField
                icon={<Briefcase />}
                label="Nghề nghiệp"
                type="text"
                value={form.occupation}
                onChange={(v: any) => onChange('occupation', v)}
                placeholder="Ví dụ: Nhân viên văn phòng"
            />

            {/* Mã giới thiệu (referral_code) */}
            <InputField
                icon={<Hash />}
                label="Mã giới thiệu (Nếu có)"
                type="text"
                value={form.referral_code}
                onChange={(v: any) => onChange('referral_code', v)}
                placeholder="Nhập mã giới thiệu"
            />
        </div>
    )
}

export default AdditionalInfoSection