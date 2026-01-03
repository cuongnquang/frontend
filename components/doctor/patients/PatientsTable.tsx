import { PatientTableRow } from "./PatientTableRow";

interface PatientWithStats {
  id: string;
  full_name: string;
  phone_number: string;
  date_of_birth?: string;
  totalVisits: number;
  lastVisitDate?: string;
}

interface PatientsTableProps {
  patients: PatientWithStats[];
  onViewDetails: (patient: PatientWithStats) => void;
}

export const PatientsTable = ({ patients, onViewDetails }: PatientsTableProps) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">Bệnh nhân</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Thông tin liên hệ</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tuổi</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Lần khám cuối</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tổng số lần khám</th>
            <th scope="col" className="relative py-3.5 pl-3 pr-6"><span className="sr-only">Hành động</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {patients.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-8 text-center text-gray-500">
                Không tìm thấy bệnh nhân nào
              </td>
            </tr>
          ) : (
            patients.map((patient) => (
              <PatientTableRow 
                key={patient.id} 
                patient={patient}
                onViewDetails={onViewDetails}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);