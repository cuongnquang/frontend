'use client'

interface SecuritySettingsProps {
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

export default function SecuritySettings({ settings, onChange }: SecuritySettingsProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt Chung</h3>
        <div className="space-y-3">
          {renderToggleOption('enableTwoFactor', 'Bật xác thực hai yếu tố (2FA)', settings, onChange)}
          {renderToggleOption('auditLog', 'Bật ghi nhật ký kiểm toán (Audit Log)', settings, onChange)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian chờ phiên (phút)
            </label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => onChange({ ...settings, sessionTimeout: parseInt(e.target.value) })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lần đăng nhập tối đa thất bại
            </label>
            <input
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) => onChange({ ...settings, maxLoginAttempts: parseInt(e.target.value) })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quy tắc Mật khẩu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chiều dài tối thiểu
            </label>
            <input
              type="number"
              value={settings.passwordMinLength}
              onChange={(e) => onChange({ ...settings, passwordMinLength: parseInt(e.target.value) })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian hết hạn (ngày)
            </label>
            <input
              type="number"
              value={settings.passwordExpiry}
              onChange={(e) => onChange({ ...settings, passwordExpiry: parseInt(e.target.value) })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>
          <div className="md:col-span-2 space-y-3">
            {renderToggleOption('requireSpecialChar', 'Yêu cầu ký tự đặc biệt', settings, onChange)}
            {renderToggleOption('requireNumber', 'Yêu cầu số', settings, onChange)}
            {renderToggleOption('requireUppercase', 'Yêu cầu chữ hoa', settings, onChange)}
          </div>
        </div>
      </div>
    </div>
  )
}