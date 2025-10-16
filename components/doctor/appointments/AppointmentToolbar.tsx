import { Search, Filter } from "lucide-react";

interface AppointmentToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const AppointmentToolbar = ({ searchQuery, onSearchChange }: AppointmentToolbarProps) => (
  <div className="bg-white text-black p-4 rounded-lg shadow-sm border border-gray-200">
    <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên bệnh nhân..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
        <Filter className="h-4 w-4 mr-2" />
        Lọc
      </button>
    </div>
  </div>
);