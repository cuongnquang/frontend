import { X } from "lucide-react"
import { PatientFormInfoProps } from "./PatientFormType"
import { useState } from "react"

export function PatientAlleries({ formData, setFormData, isReadOnly }: PatientFormInfoProps) {
    const [newAllergy, setNewAllergy] = useState('')

    const addAllergy = () => {
        if (newAllergy && !formData.allergies.includes(newAllergy)) {
            setFormData({
                ...formData,
                allergies: [...formData.allergies, newAllergy]
            })
            setNewAllergy('')
        }
    }

    const removeAllergy = (allergy: string) => {
        setFormData({
            ...formData,
            allergies: formData.allergies.filter((a: string) => a !== allergy)
        })
    }

    return (
        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Dị ứng
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
                {formData.allergies.map((allergy: string) => (
                    <span
                        key={allergy}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                    >
                        {allergy}
                        {!isReadOnly && (
                            <button
                                type="button"
                                onClick={() => removeAllergy(allergy)}
                                className="ml-2 text-red-600 hover:text-red-800"
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
                        value={newAllergy}
                        onChange={(e) => setNewAllergy(e.target.value)}
                        placeholder="Thêm dị ứng"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="button"
                        onClick={addAllergy}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Thêm
                    </button>
                </div>
            )}
        </div>

    )
}