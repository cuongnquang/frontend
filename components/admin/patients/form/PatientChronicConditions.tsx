import {
    PatientFormProps
} from '@/components/admin/patients/form/PatientFormType'
import { X } from 'lucide-react'
import { useState } from 'react'


export function PatientChronicConditions({ formData, setFormData, isReadOnly }: PatientFormProps) {
    const [newCondition, setNewCondition] = useState('')

    const addCondition = () => {
        if (newCondition && !formData.chronicConditions.includes(newCondition)) {
            setFormData({
                ...formData,
                chronicConditions: [...formData.chronicConditions, newCondition]
            })
            setNewCondition('')
        }
    }

    const removeCondition = (condition: string) => {
        setFormData({
            ...formData,
            chronicConditions: formData.chronicConditions.filter((c: string) => c !== condition)
        })
    }
    return (
        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Bệnh mãn tính
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
                {formData.chronicConditions.map((condition: string) => (
                    <span
                        key={condition}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                    >
                        {condition}
                        {!isReadOnly && (
                            <button
                                type="button"
                                onClick={() => removeCondition(condition)}
                                className="ml-2 text-yellow-600 hover:text-yellow-800"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </span>
                ))}
            </div>
            {!isReadOnly && (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value)}
                        placeholder="Thêm bệnh mãn tính"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                    />
                    <button
                        type="button"
                        onClick={addCondition}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Thêm
                    </button>
                </div>
            )}
        </div>

    )
}