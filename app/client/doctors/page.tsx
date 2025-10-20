"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Specialty } from "@/types/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DoctorHeader from "@/components/client/doctors/DoctorHeader";
import DoctorSearchBar from "@/components/client/doctors/DoctorSearchBar";
import DoctorList from "@/components/client/doctors/DoctorList";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Alert from "@/components/ui/Alert";
import { useDoctor } from "@/contexts/DoctorContext";
import { useSpecialty } from "@/contexts/SpecialtyContext";

export default function DoctorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();


  const [selectedSpecialtyName, setselectedSpecialtyName] = useState<string>(
    searchParams.get("specialty") || "all"
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'relevance');

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const {
    doctors,
    loading: doctorsLoading,
    error: doctorsError,
    fetchDoctors,
  } = useDoctor();

  const {
    specialties: allSpecialties,
    loading: specialtiesLoading,
    error: specialtiesError,
    fetchSpecialties,
  } = useSpecialty();

  // Type-safe specialties
  const specialties: Specialty[] = useMemo(() => 
    (allSpecialties as unknown as Specialty[]) || [], 
    [allSpecialties]
  );

  // Fetch specialties on mount if not available
  useEffect(() => {
    if (!allSpecialties || allSpecialties.length === 0) {
      fetchSpecialties().catch(() => {});
    }
  }, [allSpecialties, fetchSpecialties]);

  useEffect(() => {
    if (!doctors || doctors.length === 0) {
      fetchDoctors().catch(() => {});
    }
  }, [doctors.length, fetchDoctors]);

  useEffect(() => {
    const qp = new URLSearchParams();
    const trimmedQuery = debouncedSearchQuery.trim();
    
    if (trimmedQuery) qp.set('q', trimmedQuery);
    if (selectedSpecialtyName && selectedSpecialtyName !== 'all') {
      qp.set('specialty', selectedSpecialtyName);
    }
    if (sortBy && sortBy !== 'relevance') qp.set('sort', sortBy);

    const qs = qp.toString();
    const base = '/client/doctors';
    router.replace(qs ? `${base}?${qs}` : base, { scroll: false });
  }, [debouncedSearchQuery, selectedSpecialtyName, sortBy, router]);

  const filteredDoctors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    
    let result = doctors || [];
    
    if (selectedSpecialtyName && selectedSpecialtyName !== "all") {
      const selectedSpecialty = specialties.find(
        (s) => String(s.name) === String(selectedSpecialtyName)
      );
      
      if (selectedSpecialty) {
        const selectedNameLower = selectedSpecialty.name.toLowerCase();
        result = result.filter((doctor) => {
          return (doctor.specialty_name || '').toLowerCase() === selectedNameLower;
        });
      } else {
        result = [];
      }
    }
    
    if (q) {
      result = result.filter((doctor) => {
        const searchableFields = [
          doctor.full_name || '',
          doctor.specialty_name || '',
          doctor.work_experience || '',
          doctor.specializations || '',
          doctor.title || '',
        ].join(' ').toLowerCase();
        
        return searchableFields.includes(q);
      });
    }

    const sorted = [...result];
    switch (sortBy) {
      case "name_asc":
        sorted.sort((a, b) => 
          (a.full_name || "").localeCompare(b.full_name || "", 'vi')
        );
        break;
      case "experience_desc":
        sorted.sort((a, b) => 
          (b.experience_years || 0) - (a.experience_years || 0)
        );
        break;
      default:
        // 'relevance' - giữ nguyên thứ tự
        break;
    }

    return sorted;
  }, [doctors, searchQuery, sortBy, selectedSpecialtyName, specialties]); 

  const handleAppointmentDoctor = useCallback((doctorId: string) => {
    router.push(`/client/appointments?doctorId=${doctorId}`);
  }, [router]);

  const handleSelectDoctor = useCallback((doctorId: string) => {
    router.push(`/client/doctors/${doctorId}`);
  }, [router]);


  const highlightedDoctorId = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || !doctors) return null;
    
    
    const byId = filteredDoctors.find(d => String(d.id) === q);
    if (byId) return byId.id;
    
    const byName = filteredDoctors.find(d => 
      (d.full_name || '').toLowerCase() === q
    );
    return byName ? byName.id : null;
  }, [filteredDoctors, searchQuery]);

  const isLoading = doctorsLoading || specialtiesLoading;
  const error = doctorsError || specialtiesError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      <DoctorHeader />

      <DoctorSearchBar
        specialties={specialties}
        searchQuery={searchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setSearchQuery={setSearchQuery}
        selectedSpecialtyName={selectedSpecialtyName}
        setselectedSpecialtyName={setselectedSpecialtyName}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : (
        <DoctorList 
          doctors={filteredDoctors}
          resultsCount={filteredDoctors.length}
          onSelectDoctor={handleSelectDoctor}
          onAppointmentDoctor={handleAppointmentDoctor}
          searchQuery={searchQuery}
          highlightId={highlightedDoctorId}
        />
      )}

      <Footer />
    </div>
  );
}