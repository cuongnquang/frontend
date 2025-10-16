import { CreditCard } from "lucide-react";

const transactions = [
  { date: "14/10/2025", desc: "Phí dịch vụ tháng 10", amount: "500,000đ" },
  // ... các giao dịch khác
];

export const BillingSettings = () => (
  <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Thông tin thanh toán</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-600">Hết hạn 12/2025</p>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Chỉnh sửa
                  </button>
                </div>
                <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400">
                  + Thêm phương thức thanh toán
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Lịch sử giao dịch</h3>
              <div className="space-y-3">
                {[
                  { date: "14/10/2025", desc: "Phí dịch vụ tháng 10", amount: "500,000đ" },
                  { date: "14/09/2025", desc: "Phí dịch vụ tháng 9", amount: "500,000đ" },
                  { date: "14/08/2025", desc: "Phí dịch vụ tháng 8", amount: "500,000đ" },
                ].map((transaction, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.desc}</p>
                      <p className="text-sm text-gray-600">{transaction.date}</p>
                    </div>
                    <p className="font-semibold text-gray-900">{transaction.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

);