'use client'

import { useState } from 'react'
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar'
import { AdminHeader } from '@/components/admin/layout/AdminHeader'
import { DoctorProvider } from '@/contexts/DoctorContext'
import { PatientProvider } from '@/contexts/PatientContext'
import { AppointmentProvider } from '@/contexts/AppointmentContext'
import { SpecialtyProvider } from '@/contexts/SpecialtyContext'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <DoctorProvider>
            <PatientProvider>
                <AppointmentProvider>
                    <SpecialtyProvider>
                        <div className="flex h-screen bg-gray-100">
                            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                            {/* Main content */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Top header */}
                                <AdminHeader setSidebarOpen={setSidebarOpen} />

                                {/* Main content */}
                                <main className="flex-1 overflow-auto p-6">
                                    {children}
                                </main>
                            </div>
                        </div >
                    </SpecialtyProvider>
                </AppointmentProvider>
            </PatientProvider>
        </DoctorProvider>
    )
}