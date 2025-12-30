'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Heart,
    Stethoscope,
    Users,
    Award,
    Eye,
    ArrowRight,
} from 'lucide-react'
import SpecialtyCard from '@/components/specialty/SpecialtyCard'
import { Doctor } from '@/contexts/DoctorContext'
import { Specialty } from '@/contexts/SpecialtyContext'
import { apiClient } from '@/lib/api'
import FeaturedDoctorCard from '@/components/doctor/DoctorCard'

export default function Features() {
    const router = useRouter()
    const [featuredDoctors, setFeaturedDoctors] = useState<Doctor[]>([])
    const [popularSpecialties, setPopularSpecialties] = useState<Specialty[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                // Gọi API đồng thời để lấy dữ liệu bác sĩ và chuyên khoa
                const [doctorsRes, specialtiesRes] = await Promise.all([
                    apiClient<Doctor[]>('/api/doctors?perpage=4'),
                    apiClient<Specialty[]>('/api/specialties?type=all')

                ])

                if (doctorsRes.status && doctorsRes.data?.data) {
                    setFeaturedDoctors(doctorsRes.data.data)
                  }
                  
                  if (specialtiesRes.status && specialtiesRes.data) {
                    setPopularSpecialties(specialtiesRes.data)
                  }
                  
            } catch (error) {
                console.error("Failed to fetch homepage data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])


    const goAllDoctors = () => router.push('/client/doctors')
    const goAllSpecialties = () => router.push('/client/specialties')
    const handleViewSpecialty = (id: string) => router.push(`/client/specialties/${id}`)

    return (
        <>
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Bác sĩ nổi bật
                            </h2>
                            <p className="text-gray-600">
                                Đặt lịch với các bác sĩ hàng đầu, giàu kinh nghiệm
                            </p>
                        </div>
                        <button onClick={goAllDoctors} className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Xem tất cả
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {featuredDoctors.map((doctor, idx) => (
                            <FeaturedDoctorCard
                                key={idx}
                                doctor={doctor}
                                showBookButton={true}
                            />
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Chuyên khoa phổ biến
                            </h2>
                            <p className="text-gray-600">
                                Tìm kiếm theo chuyên khoa phù hợp với nhu cầu của bạn
                            </p>
                        </div>
                        <button onClick={goAllSpecialties} className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Xem tất cả
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularSpecialties.map((specialty) => (
                            <div
                                key={specialty.id}
                                onClick={() => handleViewSpecialty(specialty.id)}
                            >
                                <SpecialtyCard
                                    id={specialty.id}
                                    name={specialty.name}
                                    description={specialty.description || 'Chuyên khoa chăm sóc sức khỏe toàn diện'}
                                    image_url={specialty.image ?? undefined}
                                    color="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600"

                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}