'use client'

import { useState } from 'react'
import { Doctor, Specialty } from '@/types/types'
import { mockSpecialties, mockDoctors } from '@/public/data' 

import SpecialtySidebar from '@/components/client/specialties/SpecialtySidebar'
import SpecialtyMainContent from '@/components/client/specialties/SpecialtyMainContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function SpecialtiesPage() {
    const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'overview' | 'doctors'>('overview')
    const [searchQuery, setSearchQuery] = useState('')

    // Get doctors count by specialty
    const getDoctorCount = (specialtyId: string): number => {
        return mockDoctors.filter(d => d.specialty_id === specialtyId).length
    }

    // Get filtered doctors
    const filteredDoctors = mockDoctors.filter((doctor: Doctor) =>
        (!selectedSpecialty || doctor.specialty_id === selectedSpecialty) &&
        (searchQuery === '' ||
            doctor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.Specialty.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <Header/>
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
                    {/* Sidebar */}
                    <SpecialtySidebar
                        mockSpecialties={mockSpecialties}
                        mockDoctors={mockDoctors}
                        selectedSpecialty={selectedSpecialty}
                        setSelectedSpecialty={setSelectedSpecialty}
                        setActiveTab={setActiveTab}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />

                    {/* Main Content */}
                    <SpecialtyMainContent
                        mockSpecialties={mockSpecialties}
                        filteredDoctors={filteredDoctors}
                        selectedSpecialty={selectedSpecialty}
                        setSelectedSpecialty={setSelectedSpecialty as (id: string) => void} // Cần cast nếu setSelectedSpecialty nhận null
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        getDoctorCount={getDoctorCount}
                    />
                </div>
            </div>
            <Footer/>
        </div>
    )
}