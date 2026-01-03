import { Eye } from "lucide-react";

interface PatientWithStats {
  id: string;
  full_name: string;
  phone_number: string;
  date_of_birth?: string;
  totalVisits: number;
  lastVisitDate?: string;
}

interface PatientTableRowProps {
  patient: PatientWithStats;
  onViewDetails: (patient: PatientWithStats) => void;
}

export const PatientTableRow = ({ patient, onViewDetails }: PatientTableRowProps) => {
  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (date?: string) => {
    if (!date) return 'Chưa khám';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="whitespace-nowrap py-4 pl-6 pr-3">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            {patient.full_name?.charAt(0).toUpperCase() || 'P'}
          </div>
          <div className="ml-4">
            <div className="font-semibold text-gray-900">{patient.full_name}</div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4">
        <div className="text-sm text-gray-900">{patient.phone_number || 'N/A'}</div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
        {calculateAge(patient.date_of_birth)} tuổi
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
        {formatDate(patient.lastVisitDate)}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {patient.totalVisits} lần
        </span>
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right">
        <button 
          onClick={() => onViewDetails(patient)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye className="h-4 w-4 mr-1" />
          Xem hồ sơ
        </button>
      </td>
    </tr>
  );
};