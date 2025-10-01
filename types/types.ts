import { Role, Gender, AppointmentStatus } from "./emuns";

// User
export interface User {
  user_id: string;
  name: string;
  avatar?: string;
  email: string;
  password_hash: string;
  role: Role;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  Patient?: Patient;
  Doctor?: Doctor;
}

// Patient
export interface Patient {
  patient_id: string;
  user_id: string;
  full_name?: string;
  identity_number?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: Gender;
  address?: string;
  ethnicity?: string;
  health_insurance_number?: string;
  referral_code?: string;
  occupation?: string;
  created_at: string;
  updated_at: string;
  User: User;
  Appointments?: Appointment[];
}

// Specialty
export interface Specialty {
  specialty_id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  Doctors?: Doctor[];
  CommonDiseases?: CommonDisease[];
}

// CommonDisease
export interface CommonDisease {
  disease_id: string;
  specialty_id: string;
  disease_name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  Specialty: Specialty;
}

// Doctor
export interface Doctor {
  [x: string]: any;
  experience: string;
  specialty: string;
  image: string | Blob | undefined;
  name: any;
  // === Backend identifiers ===
  doctor_id: string         // ID chính của bác sĩ
  user_id: string           // ID người dùng liên quan
  specialty_id: string      // ID chuyên khoa

  // === Personal info ===
  full_name: string         // Tên đầy đủ
  title?: string            // "BS.", "PGS.TS."
  avatar_url?: string       // Ảnh đại diện
  introduction?: string     // Giới thiệu bác sĩ
  specializations?: string  // Chuyên môn chi tiết
  work_experience?: string  // Mô tả kinh nghiệm
  experience_years?: number // Số năm kinh nghiệm
  achievements?: string[]   // Thành tựu (mảng string)
  is_available: boolean     // Có đang nhận lịch không
  created_at: string
  updated_at: string

  // === Relations ===
  User: {
    full_name: string
    hospital: string
    address: string
    phone?: string
    email?: string
  }
  Specialty: {
    toLowerCase(): unknown;
    name: string
  }
  Schedules?: DoctorSchedule[] // Lịch làm việc
  Appointments?: Appointment[] // Lịch đã đặt, có thể chứa đánh giá

  // === Frontend-specific fields (từ BE map trực tiếp) ===
  hospital?: string           // Tên bệnh viện (từ User hoặc relation)
  location?: string           // Quận / địa chỉ
  rating?: number             // Trung bình đánh giá (từ Appointments)
  reviews?: number            // Số lượt đánh giá
  availableDays?: string[]    // Ngày có lịch khám (từ Schedules)
  nextAvailable?: string      // Ngày sớm nhất còn lịch
  price?: {
    consultation?: string
    online?: string
  }
  services?: {
    inPerson?: boolean
    online?: boolean
    homeVisit?: boolean
  }
  description?: string        // Giới thiệu ngắn để hiển thị UI
  languages?: string[]
  isVerified?: boolean
  responseTime?: string
  acceptsInsurance?: boolean
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
  Doctor: Doctor;
  Appointments?: Appointment[];
}

// Appointment
export interface Appointment {
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  schedule_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  symptoms?: string;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
  Patient: Patient;
  Doctor: Doctor;
  DoctorSchedule: DoctorSchedule;
}
