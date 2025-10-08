'use client'

interface AppointmentSettingsProps {
  settings: any
  onChange: (newSettings: any) => void
}

export default function AppointmentSettings({ settings, onChange }: AppointmentSettingsProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt lịch hẹn</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian mỗi slot (phút)
            </label>
            <input
              type="number"
              value={settings.slotDuration}
              onChange={(e) => onChange({ ...settings, slotDuration: parseInt(e.target.value) })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đặt trước tối đa (ngày)
            </label>
            <input
              type="number"
              value={settings.bookingAdvance}
              onChange={(e) => onChange({ ...settings, bookingAdvance: parseInt(e.target.value) })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian hủy tối thiểu (giờ)
            </label>
            <input
              type="number"
              value={settings.cancellationPeriod}
              onChange={(e) => onChange({ ...settings, cancellationPeriod: parseInt(e.target.value) })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lịch hẹn tối đa/ngày
            </label>
            <input
              type="number"
              value={settings.maxAppointmentsPerDay}
              onChange={(e) => onChange({ ...settings, maxAppointmentsPerDay: parseInt(e.target.value) })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số tiền đặt cọc (VNĐ)
            </label>
            <input
              type="number"
              value={settings.depositAmount}
              onChange={(e) => onChange({ ...settings, depositAmount: parseInt(e.target.value) })}
              disabled={!settings.requireDeposit}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhắc nhở trước (giờ)
            </label>
            <input
              type="number"
              value={settings.reminderTime}
              onChange={(e) => onChange({ ...settings, reminderTime: parseInt(e.target.value) })}
              disabled={!settings.sendReminders}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tùy chọn</h3>
        <div className="space-y-3">
          {[
            { key: 'allowOnlineBooking', label: 'Cho phép đặt lịch trực tuyến' },
            { key: 'requireDeposit', label: 'Yêu cầu đặt cọc' },
            { key: 'autoConfirm', label: 'Tự động xác nhận lịch hẹn' },
            { key: 'sendReminders', label: 'Gửi nhắc nhở tự động' },
            { key: 'allowReschedule', label: 'Cho phép dời lịch' },
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