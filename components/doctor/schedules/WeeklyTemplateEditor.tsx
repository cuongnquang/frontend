const dayNames = { monday: 'Thứ 2', tuesday: 'Thứ 3', wednesday: 'Thứ 4', thursday: 'Thứ 5', friday: 'Thứ 6', saturday: 'Thứ 7', sunday: 'Chủ nhật' };

export const WeeklyTemplateEditor = ({ template }) => (
  <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
    <div className="px-6 py-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900">Mẫu lịch hàng tuần</h2>
      <p className="text-sm text-gray-600 mt-1">Thiết lập lịch mặc định cho mỗi ngày trong tuần</p>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(template).map(([day, config]) => (
          <div key={day} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-900 capitalize">{dayNames[day]}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={config.active} className="sr-only peer" readOnly />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {config.active && config.shifts.map((shift, idx) => (
              <div key={idx} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded mb-1">{shift.start} - {shift.end}</div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg">Áp dụng mẫu cho tuần tới</button>
      </div>
    </div>
  </div>
);