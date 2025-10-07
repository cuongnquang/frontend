'use client'

import { Database, Save } from 'lucide-react'

interface BackupSettingsProps {
  settings: any
  onChange: (newSettings: any) => void
}

const renderToggleOption = (key: string, label: string, currentSettings: any, setter: any) => (
    <label key={key} className="flex items-start p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
      <input
        type="checkbox"
        checked={currentSettings[key]}
        onChange={(e) => setter({ ...currentSettings, [key]: e.target.checked })}
        className="mt-1 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
      />
      <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
    </label>
  );

export default function BackupSettings({ settings, onChange }: BackupSettingsProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt Tự động Sao lưu</h3>
        <div className="space-y-3">
          {renderToggleOption('autoBackup', 'Bật tính năng sao lưu tự động', settings, onChange)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tần suất sao lưu
            </label>
            <select
              value={settings.backupFrequency}
              onChange={(e) => onChange({ ...settings, backupFrequency: e.target.value as 'daily' | 'weekly' | 'monthly' })}
              disabled={!settings.autoBackup}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
            >
              <option value="daily">Hàng ngày</option>
              <option value="weekly">Hàng tuần</option>
              <option value="monthly">Hàng tháng</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian sao lưu
            </label>
            <input
              type="time"
              value={settings.backupTime}
              onChange={(e) => onChange({ ...settings, backupTime: e.target.value })}
              disabled={!settings.autoBackup}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số ngày lưu trữ
            </label>
            <input
              type="number"
              value={settings.retentionDays}
              onChange={(e) => onChange({ ...settings, retentionDays: parseInt(e.target.value) })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vị trí sao lưu
            </label>
            <select
              value={settings.backupLocation}
              onChange={(e) => onChange({ ...settings, backupLocation: e.target.value as 'cloud' | 'local' | 'network' })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            >
              <option value="cloud">Đám mây (Cloud)</option>
              <option value="local">Nội bộ (Local Server)</option>
              <option value="network">Ổ đĩa mạng (Network Drive)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái Sao lưu</h3>
        <div className="flex items-center text-sm text-gray-700">
          <Database className="w-5 h-5 mr-2 text-blue-600" />
          Lần sao lưu gần nhất: <span className="font-semibold ml-2">{settings.lastBackup}</span>
        </div>
        <button
          onClick={() => alert('Đang tiến hành sao lưu thủ công...')}
          className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center border border-gray-300"
        >
          <Save className="w-4 h-4 mr-2" />
          Sao lưu ngay
        </button>
      </div>
    </div>
  )
}