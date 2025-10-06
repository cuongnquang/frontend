import { AppointmentStatus } from "@/types/emuns"
export type Appointment = {
    id: string
    patientName: string
    patientId: string
    doctorName: string
    doctorId: string
    specialization: string
    date: string
    time: string
    status: AppointmentStatus
    reason: string
    consultationFee: number
}