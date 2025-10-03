import { AppointmentStatus, Gender, Role } from "./emuns";

// User
export interface User {
  user_id: string;
  email: string;
  password_hash: string;
  role: Role;
  is_active: boolean;
  created_at: string;  // Date from backend => string in JSON
  updated_at: string;

  passwordResetToken?: string | null;
  passwordResetTokenExpires?: string | null;

  Patient?: Patient | null;
  Doctor?: Doctor | null;
}

// Patient
export interface Patient {
  patient_id: string;
  user_id: string;
  full_name: string;
  identity_number?: string | null;
  phone_number: string;
  date_of_birth: string;
  gender: Gender;
  address?: string | null;
  ethnicity?: string | null;
  health_insurance_number?: string | null;
  referral_code?: string | null;
  occupation?: string | null;
  created_at: string;
  updated_at: string;

  User?: User;
  Appointments?: Appointment[];
}

// Specialty
export interface Specialty {
  specialty_id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  created_at: string;
  updated_at: string;

  Doctors?: Doctor[];
}

// Doctor
export interface Doctor {
  doctor_id: string;
  user_id: string;
  specialty_id: string;
  full_name: string;
  title?: string | null;
  introduction?: string | null;
  avatar_url?: string | null;   // 👈 ảnh là string (URL), không phải Blob
  specializations?: string | null;
  work_experience?: string | null;
  achievements?: string | null;
  experience_years?: number | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;

  User?: User;
  Specialty?: Specialty;
  Schedules?: DoctorSchedule[];
  Appointments?: Appointment[];
}

// DoctorSchedule
export interface DoctorSchedule {
  schedule_id: string;
  doctor_id: string;
  schedule_date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;

  Doctor?: Doctor;
  Appointments?: Appointment[];
}

// Appointment
export interface Appointment {
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  schedule_id: string;
  symptoms?: string | null;
  notes?: string | null;
  status: AppointmentStatus;
  cancellation_reason?: string | null;
  created_at: string;
  updated_at: string;

  Patient?: Patient;
  Doctor?: Doctor;
  DoctorSchedule?: DoctorSchedule;
}