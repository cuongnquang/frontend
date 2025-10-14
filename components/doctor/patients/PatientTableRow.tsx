import { Eye } from "lucide-react";

export const PatientTableRow = ({ patient, onViewDetails }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="whitespace-nowrap py-4 pl-6 pr-3">
      <div className="flex items-center">
        <img className="h-10 w-10 rounded-full ring-2 ring-gray-100" src={patient.avatar} alt={patient.full_name} />
        <div className="ml-4">
          <div className="font-semibold text-gray-900">{patient.full_name}</div>
          <div className="text-sm text-gray-500">{patient.blood_type}</div>
        </div>
      </div>
    </td>
    <td className="whitespace-nowrap px-3 py-4">
      <div className="text-sm text-gray-900">{patient.phone_number}</div>
      <div className="text-sm text-gray-500">{patient.email}</div>
    </td>
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{patient.age} tuổi</td>
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{patient.last_visit}</td>
    <td className="whitespace-nowrap px-3 py-4 text-sm">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {patient.total_visits} lần
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