import { Lock, Save } from "lucide-react";
import { FormInput } from "@/components/ui/FormInput";

export const SecuritySettings = () => (
  <div className="space-y-6">
              <form className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Đổi mật khẩu</h2>
                  <p className="text-sm text-gray-600 mt-1">Cập nhật mật khẩu để bảo mật tài khoản</p>
                </div>
  
                <div className="p-6 space-y-6">
                  <FormInput
                    label="Mật khẩu hiện tại"
                    type="password"
                    name="current_password"
                    icon={Lock}
                    placeholder="••••••••"
                    required
                  />
                  <FormInput
                    label="Mật khẩu mới"
                    type="password"
                    name="new_password"
                    icon={Lock}
                    placeholder="••••••••"
                    required
                  />
                  <FormInput
                    label="Xác nhận mật khẩu mới"
                    type="password"
                    name="confirm_password"
                    icon={Lock}
                    placeholder="••••••••"
                    required
                  />
                </div>
  
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Đổi mật khẩu
                  </button>
                </div>
              </form>
  
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Xác thực hai yếu tố (2FA)</h3>
                <p className="text-sm text-gray-600 mb-4">Tăng cường bảo mật bằng cách yêu cầu mã xác thực khi đăng nhập</p>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                  Kích hoạt 2FA
                </button>
              </div>
            </div>
);