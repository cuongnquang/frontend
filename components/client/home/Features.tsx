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
import DoctorCard from '@/components/doctor/DoctorCard'
import { Doctor, Specialty } from '@/types/types'
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
                    apiClient<Doctor[]>('/api/doctors?featured=true&limit=4'),
                    apiClient<Specialty[]>('/api/specialties?popular=true&limit=6&service_token=1')
                ])

                if (doctorsRes.status && doctorsRes.data) {
                    setFeaturedDoctors(doctorsRes.data)
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

    // Ánh xạ tên chuyên khoa với icon và màu sắc
    const popularSpecialtiesIcons: { [key: string]: React.ElementType } = {
        'Tim mạch': Heart,
        'Nhi khoa': Users,
        'Da liễu': Eye,
        'Sản phụ khoa': Heart,
        'Thần kinh': Award,
        'Ngoại khoa': Stethoscope,
        'Nội tiết': Award,
        'Cơ xương khớp': Stethoscope,
        'Tiêu hóa': Eye
    }

    const popularSpecialtiesColors: { [key: string]: string } = {
        'Tim mạch': 'bg-red-50 text-red-600',
        'Nhi khoa': 'bg-blue-50 text-blue-600',
        'Da liễu': 'bg-green-50 text-green-600',
        'Sản phụ khoa': 'bg-pink-50 text-pink-600',
        'Thần kinh': 'bg-purple-50 text-purple-600',
        'Ngoại khoa': 'bg-orange-50 text-orange-600',
        'Nội tiết': 'bg-yellow-50 text-yellow-600',
        'Cơ xương khớp': 'bg-teal-50 text-teal-600',
        'Tiêu hóa': 'bg-cyan-50 text-cyan-600'
    }

    const goAllDoctors = () => router.push('/client/doctors')
    const goAllSpecialties = () => router.push('/client/specialties')
    const handleViewSpecialty = (id: string) => router.push(`/client/specialties/${id}`)

    // if (loading) {
    //     return (
    //         <div className="py-16 container mx-auto px-4 text-center">
    //             <p>Đang tải dữ liệu trang chủ...</p>
    //         </div>
    //     )
    // }

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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {popularSpecialties.map((specialty, idx) => (
                            <div key={idx} onClick={() => handleViewSpecialty(specialty.specialty_id)}>
                                <SpecialtyCard
                                    specialtyId={specialty.specialty_id}
                                    name={specialty.name}
                                    icon={popularSpecialtiesIcons[specialty.name] || Stethoscope}
                                    doctors={specialty.Doctors?.length || 0}
                                    description={specialty.description || ''}
                                    // Các trường này cần được API trả về hoặc tính toán
                                    commonConditions={['Bệnh A', 'Bệnh B']}
                                    averagePrice="300.000đ"
                                    color={popularSpecialtiesColors[specialty.name] || 'bg-gray-50 text-gray-600'}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}