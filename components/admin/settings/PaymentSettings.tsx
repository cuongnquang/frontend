'use client'

interface PaymentSettingsProps {
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

export default function PaymentSettings({ settings, onChange }: PaymentSettingsProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Phương thức thanh toán
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'enableCash', label: 'Tiền mặt' },
            { key: 'enableCard', label: 'Thẻ (Visa/Master)' },
            { key: 'enableBankTransfer', label: 'Chuyển khoản Ngân hàng' },
            { key: 'enableInsurance', label: 'Bảo hiểm y tế' },
            { key: 'enableEWallet', label: 'Ví điện tử (Momo, ZaloPay)' },
          ].map(option => renderToggleOption(option.key, option.label, settings, onChange))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt hóa đơn & Thuế</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderToggleOption('autoInvoice', 'Tự động tạo hóa đơn khi thanh toán', settings, onChange)}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiền tố Hóa đơn
            </label>
            <input
              type="text"
              value={settings.invoicePrefix}
              onChange={(e) => onChange({ ...settings, invoicePrefix: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiền tố Biên nhận
            </label>
            <input
              type="text"
              value={settings.receiptPrefix}
              onChange={(e) => onChange({ ...settings, receiptPrefix: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thuế suất (%)
            </label>
            <input
              type="number"
              value={settings.taxRate}
              onChange={(e) => onChange({ ...settings, taxRate: parseInt(e.target.value) })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phí phạt trả chậm (%)
            </label>
            <input
              type="number"
              value={settings.lateFee}
              onChange={(e) => onChange({ ...settings, lateFee: parseInt(e.target.value) })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Điều khoản thanh toán
            </label>
            <textarea
              value={settings.paymentTerms}
              onChange={(e) => onChange({ ...settings, paymentTerms: e.target.value })}
              rows={3}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>
        </div>
      </div>
    </div>
  )
}