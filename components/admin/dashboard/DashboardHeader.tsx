export default function DashboardHeader() {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Quản trị</h1>
            <p className="text-gray-600 mt-2">
                Tổng quan hệ thống YouMed - {new Date().toLocaleDateString('vi-VN')}
            </p>
        </div>
    )
}
