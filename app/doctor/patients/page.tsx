'use client';
import { useState } from "react";
import { patients as allPatients } from "../data";
import { PatientsPageHeader } from "@/components/doctor/patients/PatientsPageHeader";
import { PatientStatsCards } from "@/components/doctor/patients/PatientStatsCards";
import { PatientSearchBar } from "@/components/doctor/patients/PatientSearchBar";
import { PatientsTable } from "@/components/doctor/patients/PatientsTable";
import { PatientDetailModal } from "@/components/doctor/patients/PatientDetailModal";

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filteredPatients = allPatients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone_number.includes(searchQuery)
  );

  return (
    <div className="space-y-6 p-6">
      <PatientsPageHeader />
      
      <PatientStatsCards />
      
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