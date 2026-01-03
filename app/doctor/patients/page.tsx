'use client';
import { useState, useEffect } from "react";
import { useAppointment } from "@/contexts/AppointmentContext";
import { PatientsPageHeader } from "@/components/doctor/patients/PatientsPageHeader";
import { PatientStatsCards } from "@/components/doctor/patients/PatientStatsCards";
import { PatientSearchBar } from "@/components/doctor/patients/PatientSearchBar";
import { PatientsTable } from "@/components/doctor/patients/PatientsTable";
import { PatientDetailModal } from "@/components/doctor/patients/PatientDetailModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Alert from "@/components/ui/Alert";

interface PatientWithStats {
  id: string;
  full_name: string;
  phone_number: string;
  date_of_birth?: string;
  totalVisits: number;
  lastVisitDate?: string;
}

export default function PatientsPage() {
  const { appointments, loading: appointmentsLoading, error: appointmentError } = useAppointment();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientWithStats | null>(null);
  const [patientsWithStats, setPatientsWithStats] = useState<PatientWithStats[]>([]);

  // Xử lý dữ liệu appointments để tạo danh sách bệnh nhân
  useEffect(() => {
    if (appointments.length > 0) {
      // Lọc appointments đã hoàn thành
      const completedAppointments = appointments.filter(appt => appt.status === 'completed');
      
      // Tạo map bệnh nhân từ appointments đã hoàn thành
      const patientsMap = new Map<string, PatientWithStats>();
      
      completedAppointments.forEach(appt => {
        const key = appt.patient_id;
        if (!patientsMap.has(key)) {
          patientsMap.set(key, {
            id: appt.patient_id,
            full_name: appt.patient_name,
            phone_number: '', // Không có sẵn từ appointments API
            totalVisits: 0,
          });
        }
        const patient = patientsMap.get(key)!;
        patient.totalVisits += 1;
        
        // Cập nhật lần khám cuối
        if (!patient.lastVisitDate || new Date(appt.schedule_date) > new Date(patient.lastVisitDate)) {
          patient.lastVisitDate = appt.schedule_date;
        }
      });

      setPatientsWithStats(Array.from(patientsMap.values()));
    }
  }, [appointments]);

  // Lọc bệnh nhân theo tìm kiếm
  const filteredPatients = patientsWithStats.filter(patient =>
    patient.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone_number.includes(searchQuery)
  );

  // Tính toán thống kê
  const totalPatients = patientsWithStats.length;
  const newPatients = appointments
    .filter(appt => appt.status === 'completed')
    .filter(appt => {
      const appointmentDate = new Date(appt.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return appointmentDate >= thirtyDaysAgo;
    })
    .reduce((acc, appt) => {
      if (!acc.find(a => a.patient_id === appt.patient_id)) {
        acc.push(appt);
      }
      return acc;
    }, [] as typeof appointments).length;

  const completedAppointments = appointments.filter(appt => appt.status === 'completed').length;

  if (appointmentsLoading) {
    return (
      <div className="flex justify-center items-center h-64 p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PatientsPageHeader />
      
      {appointmentError && <Alert message={appointmentError} type="error" />}
      
      <PatientStatsCards 
        totalPatients={totalPatients}
        newPatients={newPatients}
        completedAppointments={completedAppointments}
      />
      
      <PatientSearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <PatientsTable 
        patients={filteredPatients}
        onViewDetails={setSelectedPatient}
      />
      
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}