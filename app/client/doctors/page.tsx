'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import DoctorSearch from '@/components/client/doctors/DoctorSearch'
import DoctorList from '@/components/client/doctors/DoctorList'
import NoResults from '@/components/client/doctors/NoResults'
import { Doctor } from '@/types/types'
import { Award, ThumbsUp } from 'lucide-react'

const featuredDoctors = [
        { // This is a simplified Doctor object for demonstration purposes
            id: 1,
            name: 'PGS.TS. Nguyễn Văn An',
            specialty: 'Tim mạch can thiệp',
            hospital: 'Bệnh viện Chợ Rẫy',
            location: 'Quận 5, TP.HCM',
            rating: 4.8,
            reviews: 127,
            experience: 15,
            price: '500.000đ',
            nextAvailable: 'Thứ 2, 25/09',
            isVerified: true,
            achievements: ['2000+ ca can thiệp', 'Giải thưởng y khoa 2023'],
            // Add missing properties to match the Doctor interface
            doctor_id: 'DOC001',
            user_id: 'USER001',
            specialty_id: 1,
            full_name: 'Nguyễn Văn An',
            phone_number: '0901234567',
            email: 'an.nguyen@example.com',
            address: '201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP.HCM',
            description: 'Bác sĩ chuyên khoa Tim mạch can thiệp với nhiều năm kinh nghiệm.',
            experience_years: 15,
            rating_average: 4.8,
            review_count: 127,
            consultation_fee: 500000,
            status: 'active',
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
        },
        {
            id: 2,
            name: 'BS.CKI Trần Thị Bình',
            specialty: 'Nhi khoa',
            hospital: 'Bệnh viện Nhi Đồng 1',
            location: 'Quận 10, TP.HCM',
            rating: 4.9,
            reviews: 203,
            experience: 20,
            price: '450.000đ',
            nextAvailable: 'Thứ 3, 26/09',
            isOnline: false,
            achievements: ['Chuyên gia đầu ngành', 'Top bác sĩ nhi 2023'],
            // Add missing properties to match the Doctor interface
            doctor_id: 'DOC002',
            user_id: 'USER002',
            specialty_id: 2,
            full_name: 'Trần Thị Bình',
            phone_number: '0901234568',
            email: 'binh.tran@example.com',
            address: '149 Đường Đồng Khởi, Phường Bến Nghé, Quận 1, TP.HCM',
            description: 'Bác sĩ chuyên khoa Nhi với kinh nghiệm lâu năm trong việc chăm sóc trẻ em.',
            experience_years: 20,
            rating_average: 4.9,
            review_count: 203,
            consultation_fee: 450000,
            status: 'active',
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z', // Add is_available property
 is_available: true,
        },
        {
            id: 3,
            name: 'TS.BS Lê Minh Châu',
            specialty: 'Da liễu thẩm mỹ',
            hospital: 'Bệnh viện Da liễu TP.HCM',
            location: 'Quận 1, TP.HCM',
            rating: 4.7,
            reviews: 89,
            experience: 12,
            price: '400.000đ',
            nextAvailable: 'Thứ 4, 27/09',
            isOnline: true,
            achievements: ['Tỷ lệ hài lòng cao', 'Chuyên gia thẩm mỹ'],
            // Add missing properties to match the Doctor interface
            doctor_id: 'DOC003',
            user_id: 'USER003',
            specialty_id: 3,
            full_name: 'Lê Minh Châu',
            phone_number: '0901234569',
            email: 'chau.le@example.com',
            address: '2 Nguyễn Thông, Phường 6, Quận 3, TP.HCM',
            description: 'Bác sĩ chuyên khoa Da liễu thẩm mỹ, mang lại vẻ đẹp tự nhiên cho khách hàng.',
            experience_years: 12,
            rating_average: 4.7,
            review_count: 89,
            consultation_fee: 400000,
            status: 'active',
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
            Specialty: { id: 3, name: 'Da liễu thẩm mỹ' }, // Add Specialty object
        },
        {
            id: 4,
            name: 'PGS Phạm Văn Dũng',
            specialty: 'Thần kinh',
            hospital: 'Bệnh viện Thống Nhất',
            location: 'Quận Tân Bình, TP.HCM',
            rating: 4.6,
            reviews: 156,
            experience: 18,
            price: '600.000đ',
            nextAvailable: 'Thứ 5, 28/09',
            isOnline: false,
            achievements: ['Phó Giáo sư', 'Chuyên gia đầu ngành'],
            // Add missing properties to match the Doctor interface
            doctor_id: 'DOC004',
            user_id: 'USER004',
            specialty_id: 4,
            full_name: 'Phạm Văn Dũng',
            phone_number: '0901234570',
            email: 'dung.pham@example.com',
            address: '139 Pasteur, Phường 6, Quận 3, TP.HCM',
            description: 'Bác sĩ chuyên khoa Thần kinh, điều trị các bệnh lý phức tạp về não và hệ thần kinh.',
            experience_years: 18,
            rating_average: 4.6,
            review_count: 156,
            consultation_fee: 600000,
            status: 'active',
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
        }
    ]

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSpecialty, setSelectedSpecialty] = useState('all')

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            // Map the simplified featuredDoctors to the full Doctor interface
            const doctorsWithFullProps: Doctor[] = featuredDoctors.map(doc => ({
                ...doc,
                doctor_id: doc.doctor_id || `DOC${doc.id}`, // Fallback if not explicitly set
                user_id: doc.user_id || `USER${doc.id}`,
                specialty_id: doc.specialty_id || doc.id,
                full_name: doc.name,
                phone_number: doc.phone_number || 'N/A',
                email: doc.email || 'N/A',
                address: doc.address || doc.location,
                description: doc.description || 'N/A',
                experience_years: doc.experience,
                rating_average: doc.rating,
                review_count: doc.reviews,
                consultation_fee: parseFloat(doc.price.replace('.', '').replace('đ', '')),
                status: 'active', // Default status
                created_at: '2023-01-01T00:00:00Z', // Default date
                updated_at: '2023-01-01T00:00:00Z', // Default date
                Specialty: { id: doc.specialty_id || doc.id, name: doc.specialty }, // Mock Specialty object
            }));
            setDoctors(doctorsWithFullProps)
            setLoading(false)
        }, 500)
    }, [])
    const filteredDoctors = doctors.filter((doctor) => {
        const matchesSearch =
            doctor.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.Specialty?.name?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesSpecialty =
            selectedSpecialty === 'all' || doctor.Specialty?.name === selectedSpecialty

        return matchesSearch && matchesSpecialty
    })

    const clearFilters = () => {
        setSearchQuery('')
        setSelectedSpecialty('all')
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            <section className="bg-white border-b py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Tìm bác sĩ</h1>
                    <p className="text-gray-600">
                        Tìm kiếm và đặt lịch với các bác sĩ uy tín tại TP.HCM
                    </p>
                </div>
            </section>

            <DoctorSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedSpecialty={selectedSpecialty}
                setSelectedSpecialty={setSelectedSpecialty}
                doctors={doctors}
            />

            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-600">
                            Tìm thấy{' '}
                            <span className="font-semibold">{filteredDoctors.length}</span> bác sĩ
                        </p>
                    </div>

                    {loading ? (
                        <p className="text-center py-12">Đang tải danh sách bác sĩ...</p>
                    ) : filteredDoctors.length > 0 ? (
                        <DoctorList doctors={filteredDoctors} />
                    ) : (
                        <NoResults clearFilters={clearFilters} />
                    )}
                </div>
            </section>

            <Footer />
        </main>
    )
}