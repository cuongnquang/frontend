// src/data/mock.ts

import {
  Role,
  Gender,
  AppointmentStatus,
  User,
  Patient,
  Doctor,
  Specialty,
  DoctorSchedule,
  Appointment,
  Review,
} from '@/types/types'; // Đảm bảo đường dẫn tới file types.ts là chính xác

// =================================================================
// == 1. DỮ LIỆU NGUỒN VÀ CÁC HÀM HỖ TRỢ
// =================================================================

const firstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô"];
const lastNames = ["Văn An", "Thị Bình", "Văn Cường", "Thị Dung", "Hữu Em", "Thị Giang", "Văn Hùng", "Thị Hương", "Văn Kiên", "Thị Lan", "Văn Minh", "Thị Ngọc"];
const specialtyData = [
  { name: 'Tim mạch', desc: 'Chuyên khoa điều trị các bệnh lý liên quan đến tim và hệ tuần hoàn.' },
  { name: 'Da liễu', desc: 'Chuyên khoa chẩn đoán và điều trị các bệnh về da, tóc, móng.' },
  { name: 'Nội tiết', desc: 'Chuyên khoa điều trị các bệnh rối loạn hormone và tiểu đường.' },
  { name: 'Tiêu hóa', desc: 'Chuyên khoa điều trị các bệnh về dạ dày, ruột, gan và tụy.' },
  { name: 'Cơ xương khớp', desc: 'Chuyên khoa điều trị các bệnh về cơ, xương, khớp và mô liên kết.' },
  { name: 'Thần kinh', desc: 'Chuyên khoa điều trị các bệnh về hệ thần kinh trung ương và ngoại biên.' },
];
const symptomsPool = ["Đau đầu chóng mặt", "Ho kéo dài", "Đau bụng âm ỉ", "Nổi mẩn ngứa", "Khó thở", "Đau lưng", "Mất ngủ", "Ợ nóng", "Sụt cân không rõ nguyên nhân"];
const reviewComments = ["Bác sĩ rất tuyệt vời!", "Rất hài lòng với dịch vụ.", "Bác sĩ tư vấn kỹ lưỡng.", "Phòng khám sạch sẽ.", "Thời gian chờ hơi lâu nhưng đáng giá.", "Sẽ quay lại tái khám."];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start: Date, end: Date): Date => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// =================================================================
// == 2. KHỞI TẠO DỮ LIỆU
// =================================================================

const mockUsers: User[] = [];
const mockPatients: Patient[] = [];
const mockDoctors: Doctor[] = [];
const mockSpecialties: Specialty[] = [];
const mockSchedules: DoctorSchedule[] = [];
const mockAppointments: Appointment[] = [];
const mockReviews: Review[] = [];

// --- Tạo Chuyên khoa ---
specialtyData.forEach((spec, index) => {
  mockSpecialties.push({
    specialty_id: `spec-${index + 1}`,
    name: spec.name,
    description: spec.desc,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    Doctors: [], // Sẽ được liên kết sau
  });
});

// --- Tạo 12 Bác sĩ và User tương ứng ---
for (let i = 1; i <= 12; i++) {
  const user: User = {
    user_id: `user-doc-${i}`,
    email: `doctor${i}@clinic.com`,
    role: Role.DOCTOR,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const specialty = getRandomElement(mockSpecialties);
  const doctor: Doctor = {
    doctor_id: `doc-${i}`,
    user_id: user.user_id,
    specialty_id: specialty.specialty_id,
    full_name: `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`,
    title: Math.random() > 0.5 ? 'PGS.TS.BS' : 'ThS.BS',
    work_experience: `Bệnh viện ${specialty.name}`,
    introduction: `Chuyên gia hàng đầu về ${specialty.name} với hơn ${Math.floor(Math.random() * 10) + 5} năm kinh nghiệm.`,
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=Doctor${i}`,
    experience_years: Math.floor(Math.random() * 20) + 5,
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    User: user,
    Specialty: specialty,
    Schedules: [],
    Appointments: [],
  };
  
  user.Doctor = doctor;
  specialty.Doctors.push(doctor);
  mockUsers.push(user);
  mockDoctors.push(doctor);
}

// --- Tạo 20 Bệnh nhân và User tương ứng ---
for (let i = 1; i <= 20; i++) {
  const user: User = {
    user_id: `user-pat-${i}`,
    email: `patient${i}@email.com`,
    role: Role.PATIENT,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const patient: Patient = {
    patient_id: `pat-${i}`,
    user_id: user.user_id,
    full_name: `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`,
    phone_number: `09${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
    date_of_birth: getRandomDate(new Date(1960, 0, 1), new Date(2005, 0, 1)).toISOString().split('T')[0],
    gender: Math.random() > 0.5 ? Gender.MALE : Gender.FEMALE,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    User: user,
    Appointments: [],
  };
  
  user.Patient = patient;
  mockUsers.push(user);
  mockPatients.push(patient);
}

// --- Tạo Lịch làm việc cho các bác sĩ trong 30 ngày tới ---
const today = new Date('2025-10-10T00:00:00Z');
mockDoctors.forEach(doctor => {
  for (let i = 0; i < 30; i++) {
    if (Math.random() > 0.4) { // 60% cơ hội bác sĩ có lịch làm việc
      const scheduleDate = new Date(today);
      scheduleDate.setDate(today.getDate() + i);
      const dateString = scheduleDate.toISOString().split('T')[0];

      // Lịch buổi sáng
      const morningSchedule: DoctorSchedule = {
        schedule_id: `sched-${doctor.doctor_id}-am-${i}`,
        doctor_id: doctor.doctor_id,
        schedule_date: dateString,
        start_time: '08:00',
        end_time: '12:00',
        is_available: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        Doctor: doctor,
        Appointments: [],
      };
      mockSchedules.push(morningSchedule);
      doctor.Schedules.push(morningSchedule);
      
      // Lịch buổi chiều
      const afternoonSchedule: DoctorSchedule = {
        schedule_id: `sched-${doctor.doctor_id}-pm-${i}`,
        doctor_id: doctor.doctor_id,
        schedule_date: dateString,
        start_time: '14:00',
        end_time: '17:00',
        is_available: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        Doctor: doctor,
        Appointments: [],
      };
      mockSchedules.push(afternoonSchedule);
      doctor.Schedules.push(afternoonSchedule);
    }
  }
});

// --- Tạo 50 Lịch hẹn ngẫu nhiên ---
for (let i = 1; i <= 50; i++) {
  const patient = getRandomElement(mockPatients);
  const availableSchedule = getRandomElement(mockSchedules.filter(s => s.is_available));
  
  if (availableSchedule) {
    const doctor = mockDoctors.find(d => d.doctor_id === availableSchedule.doctor_id)!;
    const statusValues = Object.values(AppointmentStatus);
    const status = getRandomElement(statusValues);

    const appointment: Appointment = {
      appointment_id: `appt-${i}`,
      patient_id: patient.patient_id,
      doctor_id: doctor.doctor_id,
      schedule_id: availableSchedule.schedule_id,
      symptoms: getRandomElement(symptomsPool),
      status: status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      Patient: patient,
      Doctor: doctor,
      DoctorSchedule: availableSchedule,
    };

    mockAppointments.push(appointment);
    patient.Appointments.push(appointment);
    doctor.Appointments.push(appointment);
    availableSchedule.Appointments.push(appointment);

    // Nếu cuộc hẹn đã hoàn thành, có 70% cơ hội tạo 1 đánh giá
    if (status === AppointmentStatus.COMPLETED && Math.random() > 0.3) {
      const review: Review = {
        id: `rev-${i}`,
        patient_name: patient.full_name,
        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
        comment: getRandomElement(reviewComments),
        date: new Date().toISOString().split('T')[0],
        verified: true,
      };
      mockReviews.push(review);
    }
    
    // Đánh dấu lịch này không còn trống để tránh trùng lặp
    availableSchedule.is_available = false;
  }
}

// =================================================================
// == 3. EXPORT DỮ LIỆU
// =================================================================
export {
  mockUsers,
  mockPatients,
  mockDoctors,
  mockSpecialties,
  mockSchedules,
  mockAppointments,
  mockReviews,
};