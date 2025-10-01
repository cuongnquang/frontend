'use client'

import React, { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type { Doctor } from '@/types/types'
import {
    ThumbsUp, Award, BookOpen, Users, MapPin
} from 'lucide-react'

// --- Imports Component Con ---
import { DoctorHeroSection } from '@/components/doctor/DoctorHero'
import { AchievementsGrid } from '@/components/doctor/AchievementsGrid'
import { DoctorTabs } from '@/components/doctor/DoctorTabs'
import { AppointmentSidebarWidget } from '@/components/doctor/AppoimentSidebar'

export interface Achievement {
    icon: React.ElementType;
    text: string;
    count: number;
    unit: string;
}


export interface Review {
    id: number;
    patientName: string;
    rating: number;
    date: string;
    comment: string;
    verified: boolean;
}

const reviews: Review[] = [
    { id: 1, patientName: 'Trần Thị B', rating: 5, date: '20/09/2025', comment: 'Bác sĩ rất tận tình, giải thích kỹ càng về tình trạng bệnh. Cảm ơn bác sĩ!', verified: true },
    { id: 2, patientName: 'Lê Văn C', rating: 5, date: '18/09/2025', comment: 'Thái độ chuyên nghiệp, kinh nghiệm cao. Rất hài lòng với dịch vụ.', verified: true },
    { id: 3, patientName: 'Nguyễn Thị D', rating: 4, date: '15/09/2025', comment: 'Khám bệnh kỹ lưỡng, tư vấn chi tiết. Chỉ có điều thời gian chờ hơi lâu.', verified: true }
]
// =========================================================

export default function DoctorDetailPage() {
    const [activeTab, setActiveTab] = useState('about')
    // State cho Sidebar
    const [selectedService, setSelectedService] = useState<'consultation' | 'online'>('consultation')

    return (
        <>
            <Header />
            <main className="bg-gray-50 min-h-screen">
                {/* 1. HERO SECTION */}
                <DoctorHeroSection doctor={Doctor} />

                <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
                    {/* Cột chính */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* 2. THÀNH TÍCH NỔI BẬT */}
                        <AchievementsGrid achievements={Doctor.achievements} />

                        {/* 3. TABS CONTENT */}
                        <DoctorTabs
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            doctor={Doctor}
                            reviews={reviews}
                        />
                    </div>

                    {/* Cột phụ - Sidebar */}
                    <div className="space-y-6">
                        {/* 4. WIDGET ĐẶT LỊCH */}
                        <AppointmentSidebarWidget
                            doctor={Doctor}
                            selectedService={selectedService}
                            setSelectedService={setSelectedService}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}