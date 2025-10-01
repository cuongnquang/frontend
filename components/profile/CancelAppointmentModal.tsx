import { Calendar, AlertTriangle, X, Trash2 } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

interface CancelAppointmentModalProps {
    showCancelModal: number | null
    setShowCancelModal: Dispatch<SetStateAction<number | null>>
    isLoading: boolean
    handleCancelAppointment: (appointmentId: number) => Promise<void>
}

export default function CancelAppointmentModal({
    showCancelModal,
    setShowCancelModal,
    isLoading,
    handleCancelAppointment
}: CancelAppointmentModalProps) {

    if (showCancelModal === null) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" onClick={() => setShowCancelModal(null)}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 transform transition-all" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-red-600" /> Hủy lịch hẹn
                    </h3>
                    <button onClick={() => setShowCancelModal(null)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body - Warning */}
                <div className="p-6 text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-900 mb-2">Bạn có chắc chắn muốn hủy lịch hẹn này?</p>
                    <p className="text-sm text-gray-600">
                        Việc hủy có thể chịu phí theo chính sách của phòng khám/bệnh viện.
                        <br />
                        **Mã lịch hẹn:** #{showCancelModal}
                    </p>
                </div>

                {/* Footer - Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 rounded-b-xl">
                    <button
                        onClick={() => setShowCancelModal(null)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                    >
                        Không
                    </button>
                    <button
                        onClick={() => handleCancelAppointment(showCancelModal!)}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Đang hủy...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Có, hủy lịch
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}