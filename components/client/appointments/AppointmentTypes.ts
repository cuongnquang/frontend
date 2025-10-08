import { Gender } from "@/types/emuns"

export interface Doctor {
    id: number
    name: string
    specialty: string
    rating: number
    price: string
    image: string
}

export interface TimeSlot {
    time: string // Ví dụ: '08:30'
    available: boolean // Trạng thái còn trống
}

export interface PatientInfo {
    fullName: string
    phone: string
    email: string
    birthDate: string
    gender: Gender
    address: string
    symptoms: string
    notes: string
}