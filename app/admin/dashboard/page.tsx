'use client'

import { useState } from 'react'
import { Doctor } from '@/components/admin/doctors/DoctorTypes'
import { Patient } from '@/components/admin/patients/PatientTypes'
import { DoctorForm } from '@/components/admin/doctors/form/DoctorForm'
import { PatientForm } from '@/components/admin/patients/form/PatientForm'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'
import StatsGrid from '@/components/admin/dashboard/StatsGrid'
import RecentActivities from '@/components/admin/dashboard/RecentActivities'
import QuickActions from '@/components/admin/dashboard/QuickActions'
import SystemStatus from '@/components/admin/dashboard/SystemStatus'
import { mockDoctors, mockPatients } from './data'

export default function AdminDashboard() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState<Doctor | undefined>(undefined);
    const [currentPatient, setCurrentPatient] = useState<Patient | undefined>(undefined);
    const [formMode, setFormMode] = useState();
    const [doctors, setDoctors] = useState(mockDoctors);
    const [patients, setPatients] = useState(mockPatients);

    const handleOpenDoctor = () => {
        setCurrentDoctor(undefined);
        setIsFormOpen(true);
    };

    const handleCloseDoctor = () => {
        setIsFormOpen(false);
        setCurrentDoctor(undefined);
    };

    const handleOpenPatient = () => {
        setCurrentPatient(undefined);
        setIsFormOpen(true);
    };

    const handleClosePatient = () => {
        setIsFormOpen(false);
        setCurrentPatient(undefined);
    };

    const handleDoctorSubmit = (data: any) => {
        console.log('Dữ liệu form đã gửi:', data);

        if (formMode === 'create') {
            const newDoctor = { ...data, id: Date.now() } as Doctor;
            setDoctors(prev => [...prev, newDoctor]);
            alert(`Đã thêm bác sĩ: ${data.name}`);
        } else if (formMode === 'edit' && currentDoctor) {
            setDoctors(prev => prev.map(d => d.id === currentDoctor.id ? { ...currentDoctor, ...data } : d));
            alert(`Đã cập nhật bác sĩ: ${data.name}`);
        }

        handleCloseDoctor();
    };

    const handlePatientSubmit = (data: any) => {
        console.log('Dữ liệu form đã gửi:', data);

        if (formMode === 'create') {
            const newPatient = { ...data, id: Date.now() } as Patient;
            setPatients(prev => [...prev, newPatient]);
            alert(`Đã thêm bệnh nhân: ${data.name}`);
        } else if (formMode === 'edit' && currentPatient) {
            setPatients(prev => prev.map(p => p.id === currentPatient.id ? { ...currentPatient, ...data } : p));
            alert(`Đã cập nhật bệnh nhân: ${data.name}`);
        }

        handleClosePatient();
    };

    return (
        <div>
            <DashboardHeader />
            <StatsGrid />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RecentActivities />
                <div className="space-y-6">
                    <QuickActions handleOpenDoctor={handleOpenDoctor} handleOpenPatient={handleOpenPatient} />
                    <SystemStatus />
                </div>
            </div>
            {isFormOpen && (
                <DoctorForm
                    doctor={currentDoctor}
                    onClose={handleCloseDoctor}
                    onSubmit={handleDoctorSubmit}
                    mode='create'
                />
            )}
            {isFormOpen && (
                <PatientForm
                    patient={currentPatient}
                    onClose={handleClosePatient}
                    onSubmit={handlePatientSubmit}
                    mode='create'
                />
            )}
        </div>
    )
}