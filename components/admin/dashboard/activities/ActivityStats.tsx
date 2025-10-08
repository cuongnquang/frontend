import { Activity, CheckCircle, Clock, XCircle } from "lucide-react";

export default function ActivityStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Tổng hoạt động</p>
                        <p className="text-2xl font-bold text-gray-900">1,254</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Thành công</p>
                        <p className="text-2xl font-bold text-gray-900">1,198</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-red-100 text-red-600 mr-4">
                        <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Thất bại</p>
                        <p className="text-2xl font-bold text-gray-900">45</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600 mr-4">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Đang xử lý</p>
                        <p className="text-2xl font-bold text-gray-900">11</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
