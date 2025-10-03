import React from 'react'
import { Search } from 'lucide-react'

interface HospitalsFilterBarProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
    selectedDistrict: string
    setSelectedDistrict: (district: string) => void
    selectedType: string
    setSelectedType: (type: string) => void
    selectedSpecialty: string
    setSelectedSpecialty: (specialty: string) => void
    districts: string[]
    hospitalTypes: string[]
    specialties: string[]
}

export default function HospitalsFilterBar({
    searchQuery, setSearchQuery,
    selectedDistrict, setSelectedDistrict,
    selectedType, setSelectedType,
    selectedSpecialty, setSelectedSpecialty,
    districts, hospitalTypes, specialties,
}: HospitalsFilterBarProps) {
    return (
        <section className="py-6 bg-white border-b">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="relative lg:col-span-2">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm tên bệnh viện, chuyên khoa..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* District filter */}
                    <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Tất cả quận/huyện</option>
                        {districts.map(district => (
                            <option key={district} value={district}>{district}</option>
                        ))}
                    </select>

                    {/* Type filter */}
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Tất cả loại hình</option>
                        {hospitalTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    {/* Specialty filter */}
                    <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Tất cả chuyên khoa</option>
                        {specialties.map(specialty => (
                            <option key={specialty} value={specialty}>{specialty}</option>
                        ))}
                    </select>
                </div>
            </div>
        </section>
    )
}