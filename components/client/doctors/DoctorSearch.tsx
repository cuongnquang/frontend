
'use client'

import { Search } from 'lucide-react'
import { Doctor } from '@/types/types'

interface DoctorSearchProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
    selectedSpecialty: string
    setSelectedSpecialty: (specialty: string) => void
    doctors: Doctor[]
}

export default function DoctorSearch({
    searchQuery,
    setSearchQuery,
    selectedSpecialty,
    setSelectedSpecialty,
    doctors,
}: DoctorSearchProps) {
    return (
        <section className="py-6 bg-white border-b">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-4 gap-4">
                    {/* Search box */}
                    <div className="relative lg:col-span-2">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm tên bác sĩ, chuyên khoa..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 text-black focus:outline-none rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* specialty filter */}
                    <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                    {/* Sort */}
                    <select className="px-4 py-3 border text-black focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200 rounded-lg">
                        <option>Sắp xếp theo</option>
                        <option>Đánh giá cao nhất</option>
                        <option>Giá thấp nhất</option>
                        <option>Giá cao nhất</option>
                        <option>Kinh nghiệm</option>
                    </select>
                </div>
            </div>
        </section>
    )
}
