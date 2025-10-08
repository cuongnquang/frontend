'use client'

interface NotificationSettingsProps {
  settings: any
  onChange: (newSettings: any) => void
}

export default function NotificationSettings({ settings, onChange }: NotificationSettingsProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Kênh thông báo</h3>
        <div className="space-y-3">
          {[
            { key: 'emailNotifications', label: 'Thông báo Email', desc: 'Gửi thông báo qua email' },
            { key: 'smsNotifications', label: 'Thông báo SMS', desc: 'Gửi thông báo qua tin nhắn' },
            { key: 'pushNotifications', label: 'Thông báo đẩy', desc: 'Gửi thông báo đẩy trên ứng dụng' },
          ].map(option => (
            <label key={option.key} className="flex items-start p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings[option.key as keyof typeof settings] as boolean}
                onChange={(e) => onChange({ ...settings, [option.key]: e.target.checked })}
                className="mt-1 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{option.label}</p>
                <p className="text-xs text-gray-500 mt-1">{option.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Loại thông báo</h3>
        <div className="space-y-3">
          {[
            { key: 'appointmentConfirmation', label: 'Xác nhận lịch hẹn' },
            { key: 'appointmentReminder', label: 'Nhắc nhở lịch hẹn' },
            { key: 'appointmentCancellation', label: 'Hủy lịch hẹn' },
            { key: 'paymentConfirmation', label: 'Xác nhận thanh toán' },
            { key: 'newPatientWelcome', label: 'Chào mừng bệnh nhân mới' },
            { key: 'systemAlerts', label: 'Cảnh báo hệ thống' },
            { key: 'reportSummary', label: 'Báo cáo tổng hợp' },
          ].map(option => (
            <label key={option.key} className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings[option.key as keyof typeof settings] as boolean}
                onChange={(e) => onChange({ ...settings, [option.key]: e.target.checked })}
                className="rounded border-gray-400 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}