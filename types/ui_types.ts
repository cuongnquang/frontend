// 🔹 Type DoctorCardProps (dùng cho UI hiển thị bác sĩ)
export interface DoctorCardProps {
    doctor: {
        id: string;                  // UUID từ Prisma (doctor_id)
        name: string;                // full_name
        title?: string;              // học hàm, học vị
        specialty: string;           // Specialty.name
        hospital?: string;           // có thể bổ sung nếu DB có
        location?: string;           // có thể bổ sung nếu DB có
        rating?: number;             // rating từ Appointments hoặc seed
        reviews?: number;            // số lượng đánh giá
        totalPatients?: number;      // số bệnh nhân đã khám
        experience?: number;         // số năm kinh nghiệm (experience_years)
        price?: {
            consultation: string;      // giá khám trực tiếp
            online: string;            // giá khám online
        };
        availability?: {
            days: string[];
            time: string;
        };
        image: string;               // avatar_url (URL string, luôn string để render img)
        isVerified?: boolean;        // gắn nhãn xác thực
        acceptsInsurance?: boolean;  // có bảo hiểm không
    };
    variant?: 'default' | 'compact' | 'featured' | 'list'
    showBookButton?: boolean
    onBookAppointment?: (doctorId: string) => void
    onViewProfile?: (doctorId: string) => void
}

// 🔹 Type PatientCardProps (nếu có màn hiển thị bệnh nhân)
export interface PatientCardProps {
    patient: {
        id: string;                // patient_id
        name: string;              // full_name
        phone: string;             // phone_number
        dob: string;               // date_of_birth
        gender: "male" | "female" | "other";
        insurance?: string | null; // health_insurance_number
        address?: string | null;
    };
}

// 🔹 Type AppointmentCardProps (hiển thị lịch hẹn)
export interface AppointmentCardProps {
    appointment: {
        id: string;                 // appointment_id
        doctorName: string;         // Doctor.full_name
        patientName: string;        // Patient.full_name
        date: string;               // schedule_date
        time: string;               // start_time - end_time
        status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
        notes?: string;
    };
}
