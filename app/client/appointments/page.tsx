'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

// Import centralized types and refactored mock data
import { Doctor, Patient, Gender } from '@/types/types'
import { mockDoctors, mockHospitals, mockTimeSlots, Hospital } from './data'

// Import components
import AppointmentHeader from '@/components/client/appointments/AppointmentHeader'
import AppointmentProgress from '@/components/client/appointments/AppointmentProgress'
import SelectedInfoCard from '@/components/client/appointments/SelectedInfoCard'
import StepNavigation from '@/components/client/appointments/StepNavigation'
import StepTwoDateTimeSelection from '@/components/client/appointments/steps/StepTwoDateTimeSelection'
import StepThreePatientInfoForm from '@/components/client/appointments/steps/StepThreePatientInfoForm'
import StepFourConfirmation from '@/components/client/appointments/steps/StepFourConfirmation'

export default function AppointmentPage() {
    // --- State Management ---
    const [currentStep, setCurrentStep] = useState(2);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>('');
    
    // Use Partial<Patient> for the form, as it's built incrementally
    const [patientInfo, setPatientInfo] = useState<Partial<Patient>>({
        full_name: '',
        phone_number: '',
        // email is not in the Patient type, but is useful for forms.
        // We can add it as an optional field to the main type if needed.
        // For now, we handle it locally.
        gender: Gender.MALE,
        date_of_birth: '',
        address: '',
    });

    // --- Data ---
    // Data is now imported from ./data.ts
    const doctors = mockDoctors;
    const hospitals = mockHospitals;
    const timeSlots = mockTimeSlots;

    // --- Utility Functions ---
    const handlePatientInfoChange = (field: keyof Patient, value: string | Gender) => {
        setPatientInfo(prev => ({ ...prev, [field]: value }));
    };

    // --- Validation Logic ---
    const isStepValid = (step: number): boolean => {
        switch (step) {
            case 2:
                const isEntitySelected = selectedDoctor !== null || selectedHospital !== null;
                return isEntitySelected && selectedDate !== null && selectedTime !== '';
            case 3:
                // Check for core patient info fields
                return !!patientInfo.full_name && !!patientInfo.phone_number && !!patientInfo.date_of_birth;
            case 4:
                return isStepValid(2) && isStepValid(3);
            default:
                return false;
        }
    };

    // --- Effects ---
    const searchParams = useSearchParams();
    useEffect(() => {
        const doctorId = searchParams.get('doctorId');
        const hospitalId = searchParams.get('hospitalId');

        if (doctorId) {
            const found = doctors.find(d => d.doctor_id === doctorId);
            if (found) {
                setSelectedDoctor(found);
                setSelectedHospital(null);
            }
        } else if (hospitalId) {
            const found = hospitals.find(h => String(h.id) === hospitalId);
            if (found) {
                setSelectedHospital(found);
                setSelectedDoctor(null);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    useEffect(() => {
        if (!selectedDoctor && !selectedHospital) {
            setSelectedDoctor(doctors[0]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Handlers ---
    const handleSubmit = () => {
        console.log('Appointment submitted:', {
            doctor: selectedDoctor,
            hospital: selectedHospital,
            date: selectedDate,
            time: selectedTime,
            patientInfo
        });
        alert('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
    };

    const handleNext = () => setCurrentStep(currentStep + 1);
    const handleBack = () => setCurrentStep(Math.max(2, currentStep - 1));
    const handleBookAppointment = () => {
        // Logic to navigate to the beginning of the flow or open a modal
        alert('Chức năng Đặt lịch hẹn mới sẽ được thực hiện');
    };

    // --- Render ---
    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            <AppointmentHeader onBookAppointment={handleBookAppointment} />

            <AppointmentProgress currentStep={currentStep} />

            <section className="py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <SelectedInfoCard
                        selectedDoctor={selectedDoctor}
                        selectedHospital={selectedHospital}
                    />

                    {currentStep === 2 && (
                        <StepTwoDateTimeSelection
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            timeSlots={timeSlots}
                            setSelectedDate={setSelectedDate}
                            setSelectedTime={setSelectedTime}
                        />
                    )}

                    {currentStep === 3 && (
                        <StepThreePatientInfoForm
                            patientInfo={patientInfo}
                            handlePatientInfoChange={handlePatientInfoChange}
                        />
                    )}

                    {currentStep === 4 && (
                        <StepFourConfirmation
                            selectedDoctor={selectedDoctor}
                            selectedHospital={selectedHospital}
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            patientInfo={patientInfo}
                        />
                    )}

                    <StepNavigation
                        currentStep={currentStep}
                        onBack={handleBack}
                        onNext={handleNext}
                        onSubmit={handleSubmit}
                        isNextDisabled={!isStepValid(currentStep)}
                    />
                </div>
            </section>

            <Footer />
        </main>
    );
}
