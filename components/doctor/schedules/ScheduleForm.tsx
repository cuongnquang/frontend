import { Save, X } from "lucide-react";

const FormInput = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input {...props} className="block w-full h-10 p-3 text-black rounded-lg border-gray-300 shadow-sm sm:text-sm" />
  </div>
);

export const ScheduleForm = ({ editingSchedule, onSubmit, onClose }) => (
  <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-900">{editingSchedule ? 'Chỉnh sửa lịch' : 'Thêm lịch mới'}</h2>
      <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="h-5 w-5 text-gray-500" /></button>
    </div>
    <form onSubmit={onSubmit} className="p-6 space-y-4">
      <FormInput label="Ngày làm việc" type="date" name="schedule_date" required defaultValue={editingSchedule?.schedule_date} />
      <div className="grid grid-cols-2 gap-4">
        <FormInput label="Giờ bắt đầu" type="time" name="start_time" required defaultValue={editingSchedule?.start_time || "08:00"} />
        <FormInput label="Giờ kết thúc" type="time" name="end_time" required defaultValue={editingSchedule?.end_time || "12:00"} />
      </div>
      <FormInput label="Số slot" type="number" name="slots" required min="1" max="20" defaultValue={editingSchedule?.slots || 8} />
      <div className="pt-2">
        <button type="submit" className="w-full flex justify-center items-center rounded-lg bg-blue-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          {editingSchedule ? 'Cập nhật' : 'Thêm lịch'}
        </button>
      </div>
    </form>
  </div>
);