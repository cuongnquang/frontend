import { Search } from "lucide-react"

interface AppointmentFiltersProps{
    searchTerm: string
    setSearchTerm: (term: string) => void
    statusFilter: string
    setStatusFilter: (status: string) => void

}

export default function AppointmentFilters({searchTerm, setSearchTerm, statusFilter, setStatusFilter}: AppointmentFiltersProps){
    return(
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm (Tên, Mã)</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tên, mã BS, số điện thoại..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className=" pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focusoutline-none text-black"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái làm việc</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                    >
                        <option value="all">Tất cả</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="pending">Chờ xác nhận</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>
            </div>
        </div>
    )
}