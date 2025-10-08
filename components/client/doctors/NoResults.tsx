
'use client'

interface NoResultsProps {
    clearFilters: () => void
}

export default function NoResults({ clearFilters }: NoResultsProps) {
    return (
        <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Không tìm thấy bác sĩ
            </h3>
            <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Xóa bộ lọc
            </button>
        </div>
    )
}
