// Đây là component giả định, bạn có thể cần điều chỉnh tùy theo thư viện UI của mình.
import { ChevronDown } from 'lucide-react'
import React from 'react'

interface SelectFieldProps {
    label: string
    value: string
    onChange: (value: string) => void
    options: { value: string; label: string }[]
    error?: string
    placeholder?: string
}

const SelectField: React.FC<SelectFieldProps> = ({
    label,
    value,
    onChange,
    options,
    error,
    placeholder = 'Chọn một mục'
}) => {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg text-black appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                        error ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    )
}

export default SelectField