'use client'

interface GeneralSettingsProps {
  settings: any
  onChange: (newSettings: any) => void
}

export default function GeneralSettings({ settings, onChange }: GeneralSettingsProps) {
  return (
    <div className="p-6 space-y-6">
        <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt khu vực</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Múi giờ
                </label>
                <select
                value={settings.timezone}
                onChange={(e) => onChange({ ...settings, timezone: e.target.value })}
                className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
                >
                <option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</option>
                <option value="Asia/Bangkok">Thailand (GMT+7)</option>
                <option value="Asia/Singapore">Singapore (GMT+8)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngôn ngữ
                </label>
                <select
                value={settings.language}
                onChange={(e) => onChange({ ...settings, language: e.target.value })}
                className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
                >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Định dạng ngày
                </label>
                <select
                value={settings.dateFormat}
                onChange={(e) => onChange({ ...settings, dateFormat: e.target.value })}
                className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
                >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Định dạng giờ
                </label>
                <select
                value={settings.timeFormat}
                onChange={(e) => onChange({ ...settings, timeFormat: e.target.value })}
                className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
                >
                <option value="24h">24 giờ</option>
                <option value="12h">12 giờ (AM/PM)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Đơn vị tiền tệ
                </label>
                <select
                value={settings.currency}
                onChange={(e) => onChange({ ...settings, currency: e.target.value })}
                className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
                >
                <option value="VND">VND (₫)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                </select>
            </div>
            </div>
        </div>
    </div>
  )
}
