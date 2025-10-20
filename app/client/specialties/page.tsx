"use client"

import { useState, useMemo } from "react"
import { Doctor } from "@/types/types"
import SpecialtySidebar from "@/components/client/specialties/SpecialtySidebar"
import SpecialtyMainContent from "@/components/client/specialties/SpecialtyMainContent"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { useSpecialty } from "@/contexts/SpecialtyContext"
import { useDoctor } from "@/contexts/DoctorContext"

export default function SpecialtiesPage() {
    const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'overview' | 'doctors'>('overview')
    const [searchQuery, setSearchQuery] = useState('')

    const { specialties, loading: specialtiesLoading, error: specialtiesError } = useSpecialty()
    const { doctors, loading: doctorsLoading, error: doctorsError } = useDoctor()

    // Get doctors count by specialty
    const getDoctorCount = (specialtyId: string): number => {
        return doctors.filter(d => d.specialty_id === specialtyId).length
    }

    // Get filtered doctors
    const filteredDoctors = useMemo(() => {
        return doctors.filter((doctor: Doctor) =>
            (!selectedSpecialty || doctor.specialty_id === selectedSpecialty) &&
            (searchQuery === '' ||
                doctor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (doctor.Specialty?.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
        )
    }, [doctors, selectedSpecialty, searchQuery])

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
                        Specialties={specialties}
                        Doctors={doctors}
                        selectedSpecialty={selectedSpecialty}
                        setSelectedSpecialty={setSelectedSpecialty}
                        setActiveTab={setActiveTab}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                    </div>
                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        {isLoading && (
                            <div className="p-6 bg-white rounded-xl shadow-sm text-center">Đang tải dữ liệu...</div>
                        )}

                        {error && (
                            <div className="p-6 bg-red-50 rounded-xl shadow-sm text-red-700">{error}</div>
                        )}

                        {!isLoading && !error && (
                            <SpecialtyMainContent
                                Specialties={specialties}
                                filteredDoctors={filteredDoctors}
                                selectedSpecialty={selectedSpecialty}
                                setSelectedSpecialty={setSelectedSpecialty as (id: string) => void}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                getDoctorCount={getDoctorCount}
                            />
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}