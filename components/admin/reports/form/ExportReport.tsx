'use client'

import { useState } from 'react'
import { X, Download, FileText, FileSpreadsheet, Printer, Calendar } from 'lucide-react'
import { exportToExcel, exportToCSV, exportToPDF, formatDataForExport } from '@/utils/export'

interface ExportReportModalProps {
    isOpen: boolean
    onClose: () => void
    reportType: 'doctors' | 'patients' | 'appointments' | 'revenue'
    data: any[]
    title: string
}

export function ExportReportModal({ isOpen, onClose, reportType, data, title }: ExportReportModalProps) {
    const [exportFormat, setExportFormat] = useState<'excel' | 'csv' | 'pdf'>('excel')
    const [dateRange, setDateRange] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    })
    const [includeStats, setIncludeStats] = useState(true)
    const [includeCharts, setIncludeCharts] = useState(true)
    const [isExporting, setIsExporting] = useState(false)

    if (!isOpen) return null

    const handleExport = async () => {
        setIsExporting(true)

        try {
            const formattedData = formatDataForExport(data, reportType)
            const fileName = `${title.replace(/\s+/g, '_')}_${dateRange.startDate}_to_${dateRange.endDate}`

            switch (exportFormat) {
                case 'excel':
                    exportToExcel(formattedData, fileName, title)
                    break
                case 'csv':
                    exportToCSV(formattedData, fileName)
                    break
                case 'pdf':
                    exportToPDF('export-preview-content', fileName)
                    break
            }

            setTimeout(() => {
                setIsExporting(false)
                onClose()
            }, 1000)
        } catch (error) {
            console.error('Export error:', error)
            setIsExporting(false)
            alert('Có lỗi xảy ra khi xuất báo cáo')
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Xuất Báo cáo</h2>
                        <p className="text-sm text-gray-600">{title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Export Format */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Định dạng xuất
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => setExportFormat('excel')}
                                className={`p-4 border-2 rounded-lg transition-all ${exportFormat === 'excel'
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <FileSpreadsheet className={`w-8 h-8 mx-auto mb-2 ${exportFormat === 'excel' ? 'text-blue-600' : 'text-gray-400'
                                    }`} />
                                <p className="text-sm font-medium text-gray-900">Excel</p>
                                <p className="text-xs text-gray-500">.xlsx</p>
                            </button>

                            <button
                                onClick={() => setExportFormat('csv')}
                                className={`p-4 border-2 rounded-lg transition-all ${exportFormat === 'csv'
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <FileText className={`w-8 h-8 mx-auto mb-2 ${exportFormat === 'csv' ? 'text-blue-600' : 'text-gray-400'
                                    }`} />
                                <p className="text-sm font-medium text-gray-900">CSV</p>
                                <p className="text-xs text-gray-500">.csv</p>
                            </button>

                            <button
                                onClick={() => setExportFormat('pdf')}
                                className={`p-4 border-2 rounded-lg transition-all ${exportFormat === 'pdf'
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Printer className={`w-8 h-8 mx-auto mb-2 ${exportFormat === 'pdf' ? 'text-blue-600' : 'text-gray-400'
                                    }`} />
                                <p className="text-sm font-medium text-gray-900">PDF</p>
                                <p className="text-xs text-gray-500">.pdf</p>
                            </button>
                        </div>
                    </div>

                    {/* Date Range */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Khoảng thời gian
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Từ ngày</label>
                                <input
                                    type="date"
                                    value={dateRange.startDate}
                                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Đến ngày</label>
                                <input
                                    type="date"
                                    value={dateRange.endDate}
                                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Export Options */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Tùy chọn
                        </label>
                        <div className="space-y-3">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={includeStats}
                                    onChange={(e) => setIncludeStats(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Bao gồm thống kê tổng hợp</span>
                            </label>

                            {exportFormat === 'pdf' && (
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={includeCharts}
                                        onChange={(e) => setIncludeCharts(e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Bao gồm biểu đồ</span>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Preview Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Thông tin báo cáo</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                            <p>• Số lượng bản ghi: <strong>{data.length}</strong></p>
                            <p>• Định dạng: <strong>{exportFormat.toUpperCase()}</strong></p>
                            <p>• Thời gian: <strong>{dateRange.startDate}</strong> đến <strong>{dateRange.endDate}</strong></p>
                            <p>• Kích thước ước tính: <strong>~{Math.ceil(data.length * 0.5)}KB</strong></p>
                        </div>
                    </div>

                    {/* Hidden Preview Content for PDF */}
                    <div id="export-preview-content" className="hidden">
                        <h2>{title}</h2>
                        <p>Từ ngày: {dateRange.startDate} - Đến ngày: {dateRange.endDate}</p>
                        <table>
                            <thead>
                                <tr>
                                    {Object.keys(formatDataForExport(data.slice(0, 1), reportType)[0] || {}).map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {formatDataForExport(data, reportType).map((row, idx) => (
                                    <tr key={idx}>
                                        {Object.values(row).map((value: any, i) => (
                                            <td key={i}>{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {isExporting ? 'Đang xuất...' : 'Xuất báo cáo'}
                    </button>
                </div>
            </div>
        </div>
    )
}
