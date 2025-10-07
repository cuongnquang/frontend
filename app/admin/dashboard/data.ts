import { Doctor } from '@/components/admin/doctors/DoctorTypes'
import { Patient } from '@/components/admin/patients/PatientTypes'

export const mockDoctors: Doctor[] = [
    {
        id: 'BS001',
        name: 'BS. Nguyễn Văn An',
        email: 'nva@youmed.vn',
        phone: '0901234567',
        specialization: 'Tim mạch',
        licenseNumber: 'BS-001-2024',
        qualification: 'Thạc sĩ',
        experience: 15,
        consultationFee: 500000,
        rating: 4.9,
        totalPatients: 1250,
        availability: 'available',
        status: 'active',
        joinDate: '2020-01-15'
    },
    {
        id: 'BS002',
        name: 'BS. Trần Thị Bình',
        email: 'ttb@youmed.vn',
        phone: '0901234568',
        specialization: 'Da liễu',
        licenseNumber: 'BS-002-2023',
        qualification: 'Tiến sĩ',
        experience: 8,
        consultationFee: 750000,
        rating: 4.5,
        totalPatients: 800,
        availability: 'busy',
        status: 'active',
        joinDate: '2021-05-20'
    },
    {
        id: 'BS003',
        name: 'BS. Lê Văn Cường',
        email: 'lvc@youmed.vn',
        phone: '0901234569',
        specialization: 'Nhi khoa',
        licenseNumber: 'BS-003-2022',
        qualification: 'Chuyên khoa I',
        experience: 5,
        consultationFee: 400000,
        rating: 4.2,
        totalPatients: 1500,
        availability: 'off',
        status: 'inactive',
        joinDate: '2022-11-01'
    },
    {
        id: 'BS004',
        name: 'BS. Phạm Thị Duyên',
        email: 'ptd@youmed.vn',
        phone: '0901234570',
        specialization: 'Tim mạch',
        licenseNumber: 'BS-004-2021',
        qualification: 'Bác sĩ',
        experience: 10,
        consultationFee: 500000,
        rating: 4.8,
        totalPatients: 950,
        availability: 'available',
        status: 'active',
        joinDate: '2019-03-10'
    }
]

export const mockPatients: Patient[] = [
    {
        id: 'BN001',
        name: 'Nguyễn Văn An',
        email: 'nva@email.com',
        phone: '0901234567',
        dateOfBirth: '1985-03-15',
        gender: 'male',
        address: 'Hà Nội',
        insuranceNumber: 'INS001',
        bloodType: 'O+',
        lastVisit: '2024-02-10',
        nextAppointment: '2024-02-20',
        totalVisits: 15,
        status: 'active',
        riskLevel: 'high'
    },
    {
        id: 'BN002',
        name: 'Trần Thị Bình',
        email: 'ttb@email.com',
        phone: '0901234568',
        dateOfBirth: '1990-07-22',
        gender: 'female',
        address: 'TP.HCM',
        insuranceNumber: 'INS002',
        bloodType: 'A+',
        lastVisit: '2024-02-08',
        totalVisits: 8,
        status: 'active',
        riskLevel: 'medium'
    },
    {
        id: 'BN003',
        name: 'Lê Văn Cường',
        email: 'lvc@email.com',
        phone: '0901234569',
        dateOfBirth: '1995-12-05',
        gender: 'male',
        address: 'Đà Nẵng',
        insuranceNumber: 'INS003',
        bloodType: 'B+',
        lastVisit: '2024-02-12',
        totalVisits: 3,
        status: 'active',
        riskLevel: 'low'
    },
    {
        id: 'BN004',
        name: 'Phạm Thị Duyên',
        email: 'ptd@email.com',
        phone: '0901234570',
        dateOfBirth: '1970-01-01',
        gender: 'female',
        address: 'Cần Thơ',
        insuranceNumber: 'INS004',
        bloodType: 'AB-',
        lastVisit: '2024-01-01',
        totalVisits: 25,
        status: 'inactive',
        riskLevel: 'high'
    }
]
