import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface StepNavigationProps {
    currentStep: number
    onBack: () => void
    onNext: () => void
    onSubmit: () => void
    isNextDisabled: boolean
}

export default function StepNavigation({ currentStep, onBack, onNext, onSubmit, isNextDisabled }: StepNavigationProps) {
    return (
        <div className="flex justify-between mt-8">
            <button
                onClick={onBack}
                disabled={currentStep === 2}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
                <ChevronLeft className="w-5 h-5 inline mr-1" />
                Quay lại
            </button>

            {currentStep < 4 ? (
                <button
                    onClick={onNext}
                    disabled={isNextDisabled}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                    Tiếp theo
                    <ChevronRight className="w-5 h-5 inline ml-1" />
                </button>
            ) : (
                <button
                    onClick={onSubmit}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                    Xác nhận đặt lịch
                </button>
            )}
        </div>
    )
}