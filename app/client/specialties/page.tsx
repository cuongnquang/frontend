"use client"
import { useState, useMemo } from "react";
import { Doctor } from "@/types/types";
import SpecialtySidebar from "@/components/client/specialties/SpecialtySidebar"
import SpecialtyMainContent from "@/components/client/specialties/SpecialtyMainContent"
import Header from "@/components/layout/Header"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import Footer from "@/components/layout/Footer"
import { useSpecialty } from "@/contexts/SpecialtyContext"
import { useDoctor } from "@/contexts/DoctorContext"

export default function SpecialtiesPage() {
    // FIX: selectedSpecialty now holds the NAME of the specialty, or null for "All"
    const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'overview' | 'doctors'>('overview')
    const [searchQuery, setSearchQuery] = useState('')

    const { specialties, loading: specialtiesLoading, error: specialtiesError } = useSpecialty()
    const { doctors, loading: doctorsLoading, error: doctorsError } = useDoctor()

    const doctorCountsByName = useMemo(() => {
        const counts = new Map<string, number>();
        if (Array.isArray(doctors)) {
            for (const doctor of doctors) {
                const name = doctor.specialty_name;
                if (name) {
                    counts.set(name, (counts.get(name) || 0) + 1);
                }
            }
        }
        return counts;
    }, [doctors]);

    // FIX: The parameter is a name, not an ID.
    const handleSelectSpecialty = (specialtyName: string | null) => {
        setSelectedSpecialty(specialtyName)
        setActiveTab(specialtyName ? 'overview' : 'doctors' )
    }

    const filteredDoctors = useMemo(() => {
        if (!Array.isArray(doctors)) return [];

        return doctors.filter((d) => {
            // FIX: Filter directly by specialty name.
            const matchesSpecialty = !selectedSpecialty || d.specialty_name === selectedSpecialty;
            const matchesSearch = !searchQuery || d.full_name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSpecialty && matchesSearch;
        });
    }, [doctors, selectedSpecialty, searchQuery]);

    const isLoading = specialtiesLoading || doctorsLoading
    const error = specialtiesError || doctorsError

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            {/* Page Header */}
            <section className="bg-white border-b py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Chuyên khoa y tế
                    </h1>
                    <p className="text-gray-600">
                        Tìm kiếm bác sĩ theo chuyên khoa phù hợp với nhu cầu của bạn
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/3">
                    {/* Sidebar */}
                    <SpecialtySidebar
                        Specialties={specialties || []}
                        doctorCounts={doctorCountsByName}
                        selectedSpecialty={selectedSpecialty}
                        setSelectedSpecialty={handleSelectSpecialty}
                        setActiveTab={setActiveTab}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                    </div>
                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        {isLoading && (
                            <div className="p-6 bg-white rounded-xl shadow-sm text-center">
                                <LoadingSpinner />
                            </div>
                        )}

                        {error && (
                            <div className="p-6 bg-red-50 rounded-xl shadow-sm text-red-700">{error}</div>
                        )}

                        {!isLoading && !error && (
                            <SpecialtyMainContent
                                Specialties={specialties || []}
                                filteredDoctors={filteredDoctors}
                                selectedSpecialty={selectedSpecialty}
                                setSelectedSpecialty={handleSelectSpecialty}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                doctorCounts={doctorCountsByName}
                            />
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}