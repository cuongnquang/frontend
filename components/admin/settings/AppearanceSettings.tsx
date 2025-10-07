'use client'

interface AppearanceSettingsProps {
  settings: any
  onChange: (newSettings: any) => void
}

export default function AppearanceSettings({ settings, onChange }: AppearanceSettingsProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo & Biểu tượng</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Logo', 'Favicon', 'Ảnh nền Đăng nhập'].map((label, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    // Simulate file upload logic
                    const file = e.target.files?.[0]
                    if (file) {
                      alert(`Đã chọn file ${file.name} cho ${label}`)
                      onChange(settings) // Trigger hasChanges
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {/* Simple placeholder for uploaded image display */}
                {label === 'Logo' && settings.logo && (
                  <img src={settings.logo} alt="Logo preview" className="w-10 h-10 object-contain" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Màu sắc & Chủ đề</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Màu chính (Primary Color)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => onChange({ ...settings, primaryColor: e.target.value })}
                className="w-10 h-10 p-0 border-0 cursor-pointer"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => onChange({ ...settings, primaryColor: e.target.value })}
                className="flex-1 p-3 border-2 border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Màu phụ (Secondary Color)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.secondaryColor}
                onChange={(e) => onChange({ ...settings, secondaryColor: e.target.value })}
                className="w-10 h-10 p-0 border-0 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={settings.secondaryColor}
                onChange={(e) => onChange({ ...settings, secondaryColor: e.target.value })}
                className="flex-1 p-3 border-2 border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chủ đề
            </label>
            <select
              value={settings.theme}
              onChange={(e) => onChange({ ...settings, theme: e.target.value as 'light' | 'dark' })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            >
              <option value="light">Sáng (Light)</option>
              <option value="dark">Tối (Dark)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phông chữ
            </label>
            <select
              value={settings.fontFamily}
              onChange={(e) => onChange({ ...settings, fontFamily: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Arial">Arial</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}