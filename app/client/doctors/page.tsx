'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Search, CheckCircle } from 'lucide-react'
import DoctorCard from '@/components/doctor/DoctorCard'
import { Doctor } from '@/types/types'
import { DoctorCardProps } from '@/types/ui_types'  // tách riêng type UI

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSpecialty, setSelectedSpecialty] = useState('all')
    const [selectedLocation, setSelectedLocation] = useState('all')

    // gọi API lấy danh sách bác sĩ
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await fetch('http://localhost:5000/v1/doctors')
                const data = await res.json()
                setDoctors(data)
            } catch (error) {
                console.error('Lỗi khi gọi API:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchDoctors()
    }, [])

    // Filter
    const filteredDoctors = doctors.filter((doctor) => {
        const matchesSearch =
            doctor.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.Specialty?.name?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesSpecialty =
            selectedSpecialty === 'all' || doctor.Specialty?.name === selectedSpecialty

        // const matchesLocation =
        //     selectedLocation === 'all' || doctor.location?.includes(selectedLocation)

        return matchesSearch && matchesSpecialty
    })

    // Mapping từ Prisma Doctor sang DoctorCardProps
    const toDoctorCardDoctor = (d: Doctor): DoctorCardProps['doctor'] => ({
        id: d.doctor_id, // UUID string
        name: d.full_name || 'Chưa cập nhật',
        title:
            d.full_name?.startsWith('PGS') || d.full_name?.startsWith('TS')
                ? 'PGS.TS.'
                : 'BS.',
        specialty: d.Specialty?.name || 'Chuyên khoa khác',
        hospital: '',
        location: '',
        rating: 0,
        reviews: 0,
        totalPatients: 1000,
        experience: typeof d.experience_years === 'number' ? d.experience_years : 10, // ép về number
        price: {
            consultation: '400.000đ',
            online: '250.000đ',
        },
        availability: {
            days: ['Thứ 2', 'Thứ 4', 'Thứ 6'],
            time: '08:00 - 17:00',
        },
        image: '/api/placeholder/150/150',
        isVerified: true,
        acceptsInsurance: true,
    })

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Đang tải dữ liệu bác sĩ...</p>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            {/* Header */}
            <section className="bg-white border-b py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Tìm bác sĩ</h1>
                    <p className="text-gray-600">
                        Tìm kiếm và đặt lịch với các bác sĩ uy tín tại TP.HCM
                    </p>
                </div>
            </section>

            {/* Search & Filter */}
            <section className="py-6 bg-white border-b">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-4 gap-4">
                        {/* Search box */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm tên bác sĩ, chuyên khoa..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* specialty filter */}
                        <select
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tất cả chuyên khoa</option>
                            {[...new Set(doctors.map((d) => d.Specialty?.name))].map(
                                (s) =>
                                    s && (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    )
                            )}
                        </select>

                        {/* location filter */}
                        {/* <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tất cả địa điểm</option>
                            {[...new Set(doctors.map((d) => d.location))].map(
                                (l) =>
                                    l && (
                                        <option key={l} value={l}>
                                            {l}
                                        </option>
                                    )
                            )}
                        </select> */}

                        {/* Sort */}
                        <select className="px-4 py-3 border border-gray-200 rounded-lg">
                            <option>Sắp xếp theo</option>
                            <option>Đánh giá cao nhất</option>
                            <option>Giá thấp nhất</option>
                            <option>Giá cao nhất</option>
                            <option>Kinh nghiệm</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-600">
                            Tìm thấy{' '}
                            <span className="font-semibold">{filteredDoctors.length}</span> bác sĩ
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredDoctors.map((doctor) => (
                            <DoctorCard
                                key={doctor.doctor_id}
                                variant="compact"
                                doctor={toDoctorCardDoctor(doctor)}
                            />
                        ))}
                    </div>

                    {filteredDoctors.length === 0 && (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Không tìm thấy bác sĩ
                            </h3>
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedSpecialty('all')
                                    setSelectedLocation('all')
                                }}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    )
}
