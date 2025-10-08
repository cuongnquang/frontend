import { Doctor, TimeSlot, Gender, Specialty, Role } from '@/types/types';

// The Hospital type is not in the main types.ts, so we define it here.
// Ideally, this would be added to the global types file.
export interface Hospital {
    id: number;
    name: string;
    address: string;
    rating: number;
    image: string;
}

export const mockDoctors: Doctor[] = [
    {
        doctor_id: 'doc-1',
        user_id: 'user-doc-1',
        specialty_id: 'spec-1',
        full_name: 'BS. Nguyễn Văn An',
        title: 'Bác sĩ',
        avatar_url: '/api/placeholder/80/80',
        experience_years: 10,
        is_available: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        Specialty: { name: 'Tim mạch' } as Specialty,
        User: { email: 'an.nguyen@email.com', role: Role.DOCTOR } as any, // Simplified for mock
        Schedules: [],
        Appointments: [],
    },
    {
        doctor_id: 'doc-2',
        user_id: 'user-doc-2',
        specialty_id: 'spec-2',
        full_name: 'PGS.TS. Trần Thị Bình',
        title: 'Phó Giáo sư, Tiến sĩ',
        avatar_url: '/api/placeholder/80/80',
        experience_years: 20,
        is_available: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        Specialty: { name: 'Nhi khoa' } as Specialty,
        User: { email: 'binh.tran@email.com', role: Role.DOCTOR } as any, // Simplified for mock
        Schedules: [],
        Appointments: [],
    },
    {
        doctor_id: 'doc-3',
        user_id: 'user-doc-3',
        specialty_id: 'spec-3',
        full_name: 'BS. Lê Minh Châu',
        title: 'Bác sĩ',
        avatar_url: '/api/placeholder/80/80',
        experience_years: 8,
        is_available: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        Specialty: { name: 'Da liễu' } as Specialty,
        User: { email: 'chau.le@email.com', role: Role.DOCTOR } as any, // Simplified for mock
        Schedules: [],
        Appointments: [],
    },
];

export const mockHospitals: Hospital[] = [
    { id: 101, name: 'Bệnh viện Chợ Rẫy', address: '201B Nguyễn Chí Thanh, Q.5, TP.HCM', rating: 4.7, image: '/api/placeholder/80/80' },
    { id: 102, name: 'Bệnh viện Nhi Đồng 1', address: '341 Sư Vạn Hạnh, Q.10, TP.HCM', rating: 4.8, image: '/api/placeholder/80/80' },
    { id: 103, name: 'Bệnh viện Da liễu TP.HCM', address: '2 Nguyễn Thông, Q.3, TP.HCM', rating: 4.6, image: '/api/placeholder/80/80' }
];

// This mock data uses a simplified structure for the frontend.
// The main TimeSlot type from types.ts is more complex.
// We will use this simplified version for the UI and adapt as needed.
export const mockTimeSlots = [
    // --- Khung giờ Thứ Hai (Monday) ---
    {
        id: 'ts-mon-0800',
        day: 'Monday',
        startTime: '08:00',
        endTime: '09:00',
        maxPatients: 5,
        currentPatients: 2,
        isAvailable: true, // Khả dụng
    },
    {
        id: 'ts-mon-0900',
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        maxPatients: 5,
        currentPatients: 5,
        isAvailable: true, // Đã đầy (currentPatients = maxPatients)
    },
    {
        id: 'ts-mon-1400',
        day: 'Monday',
        startTime: '14:00',
        endTime: '15:00',
        maxPatients: 4,
        currentPatients: 0,
        isAvailable: true, // Khả dụng
    },
    {
        id: 'ts-mon-1500',
        day: 'Monday',
        startTime: '15:00',
        endTime: '16:00',
        maxPatients: 3,
        currentPatients: 1,
        isAvailable: false, // Bác sĩ bận (isAvailable = false)
    },

    // --- Khung giờ Thứ Ba (Tuesday) ---
    {
        id: 'ts-tue-0800',
        day: 'Tuesday',
        startTime: '08:00',
        endTime: '09:00',
        maxPatients: 6,
        currentPatients: 4,
        isAvailable: true, // Khả dụng
    },
    {
        id: 'ts-tue-1000',
        day: 'Tuesday',
        startTime: '10:00',
        endTime: '11:00',
        maxPatients: 5,
        currentPatients: 1,
        isAvailable: true, // Khả dụng
    },

    // --- Khung giờ Thứ Sáu (Friday) ---
    {
        id: 'ts-fri-1430',
        day: 'Friday',
        startTime: '14:30',
        endTime: '15:30',
        maxPatients: 4,
        currentPatients: 3,
        isAvailable: true, // Khả dụng
    },
];