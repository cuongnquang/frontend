import { X, Phone, Mail, Calendar, FileText } from "lucide-react";

export const PatientDetailModal = ({ patient, onClose }) => {
  if (!patient) return null;
  
  const medicalHistory = [
    { date: "2025-10-14", diagnosis: "Kiểm tra sức khỏe định kỳ", doctor: "BS. Nguyễn Văn A" },
    { date: "2025-09-20", diagnosis: "Tái khám tim mạch", doctor: "BS. Nguyễn Văn A" },
    { date: "2025-08-15", diagnosis: "Khám tổng quát", doctor: "BS. Nguyễn Văn A" },
  ];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Hồ sơ bệnh nhân</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Patient Info Header */}
          <div className="flex items-start space-x-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <img className="h-24 w-24 rounded-full ring-4 ring-white" src={patient.avatar} alt={patient.full_name} />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">{patient.full_name}</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div><p className="text-sm text-gray-600">Tuổi</p><p className="text-lg font-semibold text-gray-900">{patient.age} tuổi</p></div>
                <div><p className="text-sm text-gray-600">Nhóm máu</p><p className="text-lg font-semibold text-gray-900">{patient.blood_type}</p></div>
                <div><p className="text-sm text-gray-600">Tổng số lần khám</p><p className="text-lg font-semibold text-gray-900">{patient.total_visits} lần</p></div>
                <div><p className="text-sm text-gray-600">Lần khám cuối</p><p className="text-lg font-semibold text-gray-900">{patient.last_visit}</p></div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg"><div className="flex items-center text-gray-600 mb-3"><Phone className="h-5 w-5 mr-2" /><span className="font-medium">Số điện thoại</span></div><p className="text-gray-900 font-semibold">{patient.phone_number}</p></div>
            <div className="p-4 border border-gray-200 rounded-lg"><div className="flex items-center text-gray-600 mb-3"><Mail className="h-5 w-5 mr-2" /><span className="font-medium">Email</span></div><p className="text-gray-900 font-semibold">{patient.email}</p></div>
            <div className="p-4 border border-gray-200 rounded-lg md:col-span-2"><div className="flex items-center text-gray-600 mb-3"><Calendar className="h-5 w-5 mr-2" /><span className="font-medium">Địa chỉ</span></div><p className="text-gray-900 font-semibold">{patient.address}</p></div>
          </div>

          {/* Medical History */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><FileText className="h-5 w-5 mr-2" />Lịch sử khám bệnh</h4>
            <div className="space-y-3">
              {medicalHistory.map((record, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-gray-900">{record.date}</span><span className="text-xs text-gray-500">{record.doctor}</span></div>
                  <p className="text-sm text-gray-700">{record.diagnosis}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"><Calendar className="h-5 w-5 mr-2" />Đặt lịch hẹn</button>
            <button className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"><FileText className="h-5 w-5 mr-2" />Xem hồ sơ đầy đủ</button>
          </div>
        </div>
      </div>
    </div>
  );
};