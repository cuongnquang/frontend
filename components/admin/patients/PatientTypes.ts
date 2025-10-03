export interface Patient {
    id: string
    name: string
    email: string
    phone: string
    dateOfBirth: string // YYYY-MM-DD
    gender: 'male' | 'female'
    address: string
    insuranceNumber: string
    bloodType: string
    lastVisit?: string // YYYY-MM-DD
    nextAppointment?: string // YYYY-MM-DD
    totalVisits: number
    status: 'active' | 'inactive'
    riskLevel: 'low' | 'medium' | 'high'
}