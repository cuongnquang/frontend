export enum AppointmentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
}

export enum Role {
  PATIENT = "patient",
  DOCTOR = "doctor",
  ADMIN = "admin",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export interface User {
  user_id: string;
  email: string;
  role: Role;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  passwordResetToken?: string;
  passwordResetTokenExpires?: string;
  Patient?: Patient;
  Doctor?: Doctor;
}

export interface Patient {
  patient_id: string;
  user_id: string;
  full_name: string;
  identity_number?: string;
  phone_number: string;
  date_of_birth: string;
  gender: Gender;
  address?: string;
  ethnicity?: string;
  health_insurance_number?: string;
  referral_code?: string;
  occupation?: string;
  created_at: string;
  updated_at: string;
  User: User;
  Appointments: Appointment[];
}

export interface Specialty {
  specialty_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  Doctors: Doctor[];
}

export interface Doctor {
  doctor_id: string;
  user_id: string;
  specialty_id: string;
  full_name: string;
  title?: string;
  introduction?: string;
  avatar_url?: string;
  specializations?: string;
  work_experience?: string;
  achievements?: string[];
  experience_years?: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  User: User;
  Specialty: Specialty;
  Schedules: DoctorSchedule[];
  Appointments: Appointment[];
}

export interface DoctorSchedule {
  schedule_id: string;
  doctor_id: string;
  schedule_date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  Doctor: Doctor;
  Appointments: Appointment[];
}

export interface Appointment {
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  schedule_id: string;
  symptoms?: string;
  notes?: string;
  status: AppointmentStatus;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  Patient: Patient;
  Doctor: Doctor;
  DoctorSchedule: DoctorSchedule;
}

export interface TimeSlot {
    id: string;
    day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    maxPatients: number;
    currentPatients: number;
}

export enum BookingStep{
  DATE_TIME = 1,
  PROFILE = 2,
  CONFIRMATION = 3
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  options?: string[]; // Ví dụ: ['Đặt lịch', 'Tìm kiếm Bác sĩ']
  relatedDoctorId?: string; 
}

export interface Review {
id: string;
patient_name: string;
rating: number;
comment: string;
date: string;
verified: boolean;
}