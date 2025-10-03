'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HospitalDetailHeader from '@/components/client/hospitals/details/HospitalDetailHeader'
import HospitalInfoSection from '@/components/client/hospitals/details/HospitalInfoSection'
import HospitalSidebarCard from '@/components/client/hospitals/details/HospitalSidebarCard'
import HospitalMap from '@/components/client/hospitals/details/HospitalMap'
import { Hospital } from '@/components/client/hospitals/HospitalType'

// Mock Data
const MOCK_HOSPITAL_DETAIL: Hospital = {
    id: 1,
    name: 'Bệnh viện Chợ Rẫy',
    type: 'Công lập',
    address: '201B Nguyễn Chí Thanh, Phường 12',
    district: 'Quận 5',
    city: 'TP.HCM',
    rating: 4.6,
    reviews: 1250,
    phone: '028 3855 4269',
    image: '/api/placeholder/800/450',
    description: 'Bệnh viện đa khoa hạng I, là trung tâm y tế lớn nhất miền Nam với đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại, và được Bộ Y tế công nhận là bệnh viện tuyến cuối hàng đầu. Bệnh viện nổi tiếng với các chuyên khoa sâu như Tim mạch, Ung bướu và Thần kinh.',
    specialties: ['Tim mạch', 'Thần kinh', 'Ung bướu', 'Ngoại khoa', 'Nội khoa', 'Hồi sức cấp cứu'],
    beds: 1200,
    doctors: 450,
    established: 1900,
    certifications: ['JCI', 'ISO 9001:2015', 'Bộ Y tế'],
    facilities: ['Phòng cấp cứu 24/7', 'Phòng mổ hiện đại', 'Khoa ICU', 'Chẩn đoán hình ảnh', 'Phòng khám chuyên gia', 'Phòng nội trú tiêu chuẩn'],
    workingHours: { weekday: '6:00 - 20:00', weekend: '6:00 - 18:00' },
    emergencyAvailable: true,
    // mission: 'Cung cấp dịch vụ chăm sóc sức khỏe toàn diện, chất lượng cao, phục vụ cộng đồng.',
    // vision: 'Trở thành trung tâm y tế đa khoa hàng đầu khu vực Đông Nam Á.'
}

export default function HospitalDetailPage({ params }: { params: { id: string } }) {
    const [hospital, setHospital] = useState<Hospital | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Giả lập gọi API để lấy thông tin chi tiết bệnh viện dựa trên ID
        // Trong thực tế, bạn sẽ dùng 'params.id' để fetch data
        const fetchData = () => {
            setHospital(MOCK_HOSPITAL_DETAIL)
            setLoading(false)
        }
        fetchData()
    }, [params.id])

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50">
                <Header />
                <div className="text-center py-20">Đang tải thông tin bệnh viện...</div>
                <Footer />
            </main>
        )
    }

    if (!hospital) {
        return (
            <main className="min-h-screen bg-gray-50">
                <Header />
                <div className="text-center py-20">Không tìm thấy bệnh viện này.</div>
                <Footer />
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            <HospitalDetailHeader hospital={hospital} />

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cột chính (2/3 màn hình) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* 1. Giới thiệu và thông tin chung */}
                        <HospitalInfoSection
                            title="Giới thiệu chung"
                            content={hospital.description}
                        // mission={hospital.mission}
                        // vision={hospital.vision}
                        />

                        {/* 2. Chuyên khoa và Dịch vụ */}
                        <HospitalInfoSection
                            title="Chuyên khoa & Dịch vụ nổi bật"
                            items={hospital.specialties}
                            type="specialties"
                        />

                        {/* 3. Cơ sở vật chất */}
                        <HospitalInfoSection
                            title="Cơ sở vật chất & Tiện nghi"
                            items={hospital.facilities}
                            type="facilities"
                        />

                        {/* 4. Đánh giá */}
                        {/* <HospitalReviews hospitalName={hospital.name} hospitalId={hospital.id} /> */}
                    </div>

                    {/* Sidebar (1/3 màn hình) */}
                    <aside className="lg:col-span-1 space-y-8">
                        {/* 5. Thông tin liên hệ và giờ làm */}
                        <HospitalSidebarCard hospital={hospital} />

                        {/* 6. Bản đồ */}
                        <HospitalMap address={hospital.address} name={hospital.name} />

                        {/* 7. Bác sĩ liên quan (Tái sử dụng DoctorCard) - Không có trong scope này, chỉ là ý tưởng */}
                    </aside>
                </div>
            </div>

            <Footer />
        </main>
    )
}