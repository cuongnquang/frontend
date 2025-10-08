"use client";
import React from 'react';
import { Plus } from 'lucide-react';

/**
 * Props for the ClientAppointmentHeader component.
 * @property onBookAppointment - Function to be called when the "Book New Appointment" button is clicked.
 */
interface ClientAppointmentHeaderProps {
  onBookAppointment: () => void;
}

/**
 * Header component for the client's appointment page.
 * Displays the page title, a brief description, and a button to book a new appointment.
 *
 * @param {ClientAppointmentHeaderProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered header component.
 */
export default function ClientAppointmentHeader({ onBookAppointment }: ClientAppointmentHeaderProps): React.ReactElement {
  return (
    <div className="container mx-auto px-4 max-w-4xl">
    <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lịch hẹn của tôi</h1>
        <p className="text-gray-600 mt-1">
          Xem và quản lý các lịch hẹn sắp tới và đã qua của bạn.
        </p>
      </div>
      <button
        onClick={onBookAppointment}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors duration-200"
      >
        <Plus className="w-5 h-5 mr-2" />
        Đặt lịch hẹn mới
      </button>
    </div></div>
  );
}
