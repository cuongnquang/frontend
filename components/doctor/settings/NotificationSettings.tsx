import { Save } from "lucide-react";

const notificationItems = [
  { label: "Lịch hẹn mới", desc: "Nhận thông báo khi có lịch hẹn mới" },
  { label: "Tin nhắn mới", desc: "Nhận thông báo khi có tin nhắn từ bệnh nhân" },
  // ... các mục khác
];

export const NotificationSettings = () => (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Cài đặt thông báo</h2>
              <p className="text-sm text-gray-600 mt-1">Quản lý cách bạn nhận thông báo</p>
            </div>

            <div className="p-6 space-y-6">
              {[
                { label: "Lịch hẹn mới", desc: "Nhận thông báo khi có lịch hẹn mới" },
                { label: "Tin nhắn mới", desc: "Nhận thông báo khi có tin nhắn từ bệnh nhân" },
                { label: "Đánh giá mới", desc: "Nhận thông báo khi có đánh giá mới" },
                { label: "Nhắc nhở lịch hẹn", desc: "Nhắc nhở trước 30 phút khi có lịch hẹn" },
                { label: "Cập nhật hệ thống", desc: "Nhận thông báo về cập nhật và bảo trì" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                <Save className="h-4 w-4 mr-2" />
                Lưu cài đặt
              </button>
            </div>
          </div>

);