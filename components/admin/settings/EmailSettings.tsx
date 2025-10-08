'use client'

interface EmailSettingsProps {
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

export default function EmailSettings({ settings, onChange }: EmailSettingsProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt máy chủ SMTP</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Host
            </label>
            <input
              type="text"
              value={settings.smtpHost}
              onChange={(e) => onChange({ ...settings, smtpHost: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Port
            </label>
            <input
              type="number"
              value={settings.smtpPort}
              onChange={(e) => onChange({ ...settings, smtpPort: parseInt(e.target.value) })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Username
            </label>
            <input
              type="text"
              value={settings.smtpUsername}
              onChange={(e) => onChange({ ...settings, smtpUsername: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Password
            </label>
            <input
              type="password"
              value={settings.smtpPassword}
              onChange={(e) => onChange({ ...settings, smtpPassword: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin gửi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên người gửi
            </label>
            <input
              type="text"
              value={settings.senderName}
              onChange={(e) => onChange({ ...settings, senderName: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email người gửi
            </label>
            <input
              type="email"
              value={settings.senderEmail}
              onChange={(e) => onChange({ ...settings, senderEmail: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>
          <div className='md:col-span-2'>
            {renderToggleOption('useTLS', 'Sử dụng kết nối bảo mật (TLS/SSL)', settings, onChange)}
          </div>
        </div>
      </div>
    </div>
  )
}