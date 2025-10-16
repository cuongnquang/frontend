
import { Search } from "lucide-react";

export const PatientSearchBar = ({ searchQuery, onSearchChange }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border text-black focus:outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  </div>
);