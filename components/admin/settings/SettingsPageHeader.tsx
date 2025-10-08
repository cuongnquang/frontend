'use client'

import { RefreshCw, Save, AlertCircle } from 'lucide-react'

interface SettingsPageHeaderProps {
  isSaving: boolean
  hasChanges: boolean
  onSave: () => void
  onReset: () => void
}

export default function SettingsPageHeader({
  isSaving,
  hasChanges,
  onSave,
  onReset,
}: SettingsPageHeaderProps) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt Hệ thống</h1>
          <p className="text-gray-600">Cấu hình và tùy chỉnh hệ thống</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Khôi phục mặc định
          </button>
          <button
            onClick={onSave}
            disabled={!hasChanges || isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      {hasChanges && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <p className="text-sm text-yellow-800">
              Bạn có thay đổi chưa được lưu. Nhấn "Lưu thay đổi" để áp dụng.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
