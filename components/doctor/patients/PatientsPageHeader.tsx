import { UserPlus } from "lucide-react";

export const PatientsPageHeader = () => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Danh sách Bệnh nhân</h1>
      <p className="text-gray-600 mt-1">Quản lý thông tin bệnh nhân và hồ sơ khám bệnh</p>
    </div>
    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm">
      <UserPlus className="h-5 w-5 mr-2" />
      Thêm bệnh nhân mới
    </button>
  </div>
);