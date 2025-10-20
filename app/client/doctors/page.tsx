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

  // Filters - State là nguồn chân lý (source of truth)
  const [selectedSpecialtyName, setselectedSpecialtyName] = useState<string>(
    searchParams.get("specialty") || "all"
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'relevance');

  // Tối ưu 2: Tạo giá trị debounce cho searchQuery để cập nhật URL
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);


  // Contexts
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
    if (doctors.length === 0) {
      fetchDoctors({ limit: 500 }).catch(() => {});
    }
  }, [doctors.length, fetchDoctors]);

  // Tối ưu 2: Update URL với giá trị 'debounced'
  useEffect(() => {
    const qp = new URLSearchParams();
    const trimmedQuery = debouncedSearchQuery.trim(); // Dùng giá trị debounced
    
    if (trimmedQuery) qp.set('q', trimmedQuery);
    if (selectedSpecialtyName && selectedSpecialtyName !== 'all') {
      qp.set('specialty', selectedSpecialtyName);
    }
    if (sortBy && sortBy !== 'relevance') qp.set('sort', sortBy);

    const qs = qp.toString();
    const base = '/client/doctors';
    router.replace(qs ? `${base}?${qs}` : base, { scroll: false });
  }, [debouncedSearchQuery, selectedSpecialtyName, sortBy, router]); // Dùng giá trị debounced

  // Lọc và sắp xếp TOÀN BỘ ở Client (với cấu trúc backend mới)
  // Logic này giờ là nguồn chân lý duy nhất cho việc hiển thị
  const filteredDoctors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase(); // Dùng searchQuery (tức thì)
    
    let result = doctors || [];
    
    // 1. Lọc theo Chuyên khoa (từ Dropdown)
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
    
    // 2. Lọc theo Tên (từ Ô tìm kiếm)
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

    // 3. Sắp xếp
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
  }, [doctors, searchQuery, sortBy, selectedSpecialtyName, specialties]); // Dùng searchQuery (tức thì)

  // Memoized handlers
  const handleAppointmentDoctor = useCallback((doctorId: string) => {
    router.push(`/client/appointments?doctorId=${doctorId}`);
  }, [router]);

  const handleSelectDoctor = useCallback((doctorId: string) => {
    router.push(`/client/doctors/${doctorId}`);
  }, [router]);

  // Tối ưu 3: Đã xóa useEffect dùng để debug

  // Highlight specific doctor if search matches ID or exact name
  const highlightedDoctorId = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || !doctors) return null;
    
    // Dùng mảng đã lọc (filteredDoctors) sẽ nhanh hơn
    const byId = filteredDoctors.find(d => String(d.doctor_id) === q);
    if (byId) return byId.doctor_id;
    
    const byName = filteredDoctors.find(d => 
      (d.full_name || '').toLowerCase() === q
    );
    return byName ? byName.doctor_id : null;
  }, [filteredDoctors, searchQuery]);

  // 'doctorsLoading' giờ đây chỉ 'true' khi tải lần đầu
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