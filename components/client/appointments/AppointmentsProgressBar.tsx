import { CheckCircle } from 'lucide-react'
import { BookingStep } from '@/types/types'

interface AppointmentsProgressBarProps {
    currentStep: BookingStep
}

export default function AppointmentsProgressBar({ currentStep }: AppointmentsProgressBarProps) {
    return (
        <div className="bg-white border-b shadow-md">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-center">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${currentStep >= BookingStep.DATE_TIME ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {currentStep > BookingStep.DATE_TIME ? <CheckCircle className="w-6 h-6" /> : '1'}
                        </div>
                        <span className={`mt-2 text-center text-sm font-medium ${currentStep >= BookingStep.DATE_TIME ? 'text-blue-600' : 'text-gray-500'}`}>Chọn ngày giờ</span>
                    </div>
                    <div className={`w-16 h-1 mx-4 transition-colors ${currentStep > BookingStep.DATE_TIME ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    {/* Step 2 */}
                    <div className="flex flex-col items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${currentStep >= BookingStep.PROFILE ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {currentStep > BookingStep.PROFILE ? <CheckCircle className="w-6 h-6" /> : '2'}
                        </div>
                        <span className={`mt-2 text-center text-sm font-medium ${currentStep >= BookingStep.PROFILE ? 'text-blue-600' : 'text-gray-500'}`}>Thông tin bệnh nhân</span>
                    </div>
                    <div className={`w-16 h-1 mx-4 transition-colors ${currentStep > BookingStep.PROFILE ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    {/* Step 3 */}
                    <div className="flex flex-col items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${currentStep >= BookingStep.CONFIRMATION ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            3
                        </div>
                        <span className={`mt-2 text-center text-sm font-medium ${currentStep >= BookingStep.CONFIRMATION ? 'text-blue-600' : 'text-gray-500'}`}>Xác nhận</span>
                    </div>
                </div>
            </div>
        </div>
    )
}