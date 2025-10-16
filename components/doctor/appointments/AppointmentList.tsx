import { AppointmentRow } from "./AppointmentRow";
import { Calendar } from "lucide-react";

export const AppointmentList = ({ appointments, onConfirm, onCancel, onViewDetails }) => (
  <div className="divide-y divide-gray-200">
    {appointments.length === 0 ? (
      <div className="p-12 text-center">
        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Không tìm thấy lịch hẹn nào</p>
      </div>
    ) : (
      appointments.map((appt) => (
        <AppointmentRow 
          key={appt.id} 
          appointment={appt}
          onConfirm={onConfirm}
          onCancel={onCancel}
          onViewDetails={onViewDetails}
        />
      ))
    )}
  </div>
);