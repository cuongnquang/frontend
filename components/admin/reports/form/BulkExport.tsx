'use client'

import { useState } from 'react'
import { X, Download, CheckSquare } from 'lucide-react'

interface BulkExportModalProps {
    isOpen: boolean
    onClose: () => void
}

export function BulkExportModal({ isOpen, onClose }: BulkExportModalProps) {
    const [selectedReports, setSelectedReports] = useState<string[]>([])
    const [exportFormat, setExportFormat] = useState<'excel' | 'pdf' | 'zip'>('zip')

    const availableReports = [
        { id: 'doctors', name: 'Danh sách Bác sĩ', size: '~2.5MB' },
        { id: 'patients', name: 'Danh sách Bệnh nhân', size: '~3.8MB' },
        { id: 'appointments', name: 'Lịch hẹn', size: '~1.2MB' },
        { id: 'revenue', name: 'Doanh thu', size: '~800KB' },
        { id: 'medical_records', name: 'Hồ sơ bệnh án', size: '~5.2MB' },
        { id: 'prescriptions', name: 'Đơn thuốc', size: '~1.5MB' },
        { id: 'lab_tests', name: 'Xét nghiệm', size: '~2.1MB' },
        { id: 'invoices', name: 'Hóa đơn', size: '~1.8MB' }
    ]

    const toggleReport = (reportId: string) => {
        if (selectedReports.includes(reportId)) {
            setSelectedReports(selectedReports.filter(id => id !== reportId))
        } else {
            setSelectedReports([...selectedReports, reportId])
        }
    }

    const selectAll = () => {
        if (selectedReports.length === availableReports.length) {
            setSelectedReports([])
        } else {
            setSelectedReports(availableReports.map(r => r.id))
        }
    }

    const handleBulkExport = () => {
        console.log('Exporting reports:', selectedReports, 'Format:', exportFormat)
        alert(`Đang xuất ${selectedReports.length} báo cáo dạng ${exportFormat.toUpperCase()}`)
        onClose()
    }

    if (!isOpen) return null

    const totalSize = availableReports
        .filter(r => selectedReports.includes(r.id))
        .reduce((sum, r) => sum + parseFloat(r.size.replace(/[^\d.]/g, '')), 0)

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Xuất nhiều báo cáo</h2>
                        <p className="text-sm text-gray-600">Chọn các báo cáo cần xuất</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Select All */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedReports.length === availableReports.length}
                                onChange={selectAll}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm font-medium text-gray-900">
                                Chọn tất cả ({availableReports.length} báo cáo)
                            </span>
                        </label>
                        <span className="text-sm text-gray-600">
                            {selectedReports.length} đã chọn
                        </span>
                    </div>

                    {/* Report List */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {availableReports.map((report) => (
                            <label
                                key={report.id}
                                className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedReports.includes(report.id)
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedReports.includes(report.id)}
                                        onChange={() => toggleReport(report.id)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{report.name}</p>
                                        <p className="text-xs text-gray-500">Kích thước: {report.size}</p>
                                    </div>
                                </div>
                                {selectedReports.includes(report.id) && (
                                    <CheckSquare className="w-5 h-5 text-blue-600" />
                                )}
                            </label>
                        ))}
                    </div>

                    {/* Export Format */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Định dạng xuất
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { value: 'excel', label: 'Excel riêng lẻ', desc: 'Mỗi file .xlsx' },
                                { value: 'pdf', label: 'PDF riêng lẻ', desc: 'Mỗi file .pdf' },
                                { value: 'zip', label: 'File ZIP', desc: 'Tất cả trong .zip' }
                            ].map((format) => (
                                <button
                                    key={format.value}
                                    onClick={() => setExportFormat(format.value as any)}
                                    className={`p-3 border-2 rounded-lg text-left transition-all ${exportFormat === format.value
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <p className="text-sm font-medium text-gray-900">{format.label}</p>
                                    <p className="text-xs text-gray-500 mt-1">{format.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Tóm tắt</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                            <p>• Số lượng báo cáo: <strong>{selectedReports.length}</strong></p>
                            <p>• Tổng kích thước: <strong>~{totalSize.toFixed(1)}MB</strong></p>
                            <p>• Định dạng: <strong>{exportFormat.toUpperCase()}</strong></p>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleBulkExport}
                        disabled={selectedReports.length === 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Xuất {selectedReports.length} báo cáo
                    </button>
                </div>
            </div>
        </div>
    )
}