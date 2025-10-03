export interface Doctor {
    id: string
    name: string
    email: string
    phone: string
    specialization: string
    licenseNumber: string
    qualification: string
    experience: number // Số năm kinh nghiệm
    consultationFee: number
    rating: number
    totalPatients: number
    availability: 'available' | 'busy' | 'off' // Tình trạng làm việc
    status: 'active' | 'inactive' // Trạng thái hợp đồng/làm việc
    joinDate: string // YYYY-MM-DD
}