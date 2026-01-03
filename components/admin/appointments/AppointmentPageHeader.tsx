import React from 'react'
import { Plus, Download } from 'lucide-react'
interface AppointmentPageHeaderProps {
    onAddAppointment: () => void
    onExport: (type: any) => void
}
export default function AppointmentPageHeader({
    onAddAppointment, onExport
}: AppointmentPageHeaderProps) {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Lịch hẹn </h1>
                <p className="text-gray-600">Tổng quan và quản lý tất cả lịch hẹn khám bệnh.</p>
            </div>
        </div>
    )
}