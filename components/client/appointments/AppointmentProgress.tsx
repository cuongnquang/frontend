'use client';

import React from 'react';

/**
 * Props for the AppointmentProgress component.
 * @property currentStep - The current active step in the process.
 * @property totalSteps - The total number of steps.
 */
interface AppointmentProgressProps {
  currentStep: number;
  totalSteps?: number; // Optional total steps, defaults to 4
}

const steps = [
  { id: 1, title: 'Chọn Bác sĩ/Bệnh viện' },
  { id: 2, title: 'Chọn Ngày & Giờ' },
  { id: 3, title: 'Thông tin Bệnh nhân' },
  { id: 4, title: 'Xác nhận & Hoàn tất' },
];

/**
 * A component to display the progress of the appointment booking process.
 * It shows the current step and the titles of all steps.
 *
 * @param {AppointmentProgressProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered progress bar component.
 */
export default function AppointmentProgress({ currentStep }: AppointmentProgressProps): React.ReactElement {
  return (
    <section className="container mx-auto px-4 max-w-4xl">
    <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-colors duration-300 ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                    {isCompleted ? '✓' : step.id}
                  </div>
                  <p
                    className={`mt-2 text-sm font-semibold ${
                      isActive ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
    </section>
  );
}
