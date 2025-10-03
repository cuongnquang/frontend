import React from 'react'
import { Check, ChevronRight } from 'lucide-react'

interface AppointmentProgressProps {
    currentStep: number
}

const steps = [
    { id: 2, name: 'Chọn thời gian' },
    { id: 3, name: 'Thông tin bệnh nhân' },
    { id: 4, name: 'Xác nhận' }
]

export default function AppointmentProgress({ currentStep }: AppointmentProgressProps) {
    return (
        <section className="bg-white border-b py-6">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center space-x-8">
                    {steps.map((step, idx) => (
                        <div key={step.id} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= step.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-500'
                                }`}>
                                {currentStep > step.id ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    idx + 1
                                )}
                            </div>
                            <span className={`ml-2 font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}`}>
                                {step.name}
                            </span>
                            {step.id < 4 && (
                                <ChevronRight className="w-5 h-5 text-gray-300 ml-4" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}