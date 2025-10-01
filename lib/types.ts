import { Patient } from "@/types/types"

export interface User {
    id: string
    email: string
    name: string
    role: Role
    avatar?: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    profile?: UserProfile
}

export interface Review {
    id: string
    date: Date
    verified: boolean
    comment: string
    patient: Patient
    rating: number
}

export interface UserProfile {
    phone?: string
    address?: string
    dateOfBirth?: Date
    gender?: 'male' | 'female' | 'other'
    specialization?: string // For doctors
    licenseNumber?: string // For doctors
    hospitalId?: string // For doctors
    insuranceNumber?: string // For patients
    emergencyContact?: {
        name: string
        phone: string
        relationship: string
    }
}

export enum Role {

    ADMIN = 'admin',
    DOCTOR = 'doctor',

    PATIENT = 'patient',

}

export interface AuthState {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    email: string
    password: string
    confirmPassword: string
    name: string
    role: Role
    phone?: string
}

export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

// Navigation types
export interface NavItem {
    name: string
    href: string
    icon?: string
    permission?: string
    children?: NavItem[]
}

export interface DashboardStats {
    totalDoctors: number
    totalPatients: number
    todayAppointments: number
    monthlyRevenue: number
}