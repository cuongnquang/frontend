import { Lock, Eye, EyeOff, RefreshCw, CheckCircle } from 'lucide-react';

interface ResetStepProps {
    newPassword: string;
    setNewPassword: (password: string) => void;
    confirmPassword: string;
    setConfirmPassword: (password: string) => void;
    showNewPassword: boolean;
    setShowNewPassword: (show: boolean) => void;
    showConfirmPassword: boolean;
    setShowConfirmPassword: (show: boolean) => void;
    handlePasswordReset: (e: React.FormEvent) => void;
    isLoading: boolean;
    errors: Record<string, string>;
    passwordValidation: { checks: { length: boolean; upper: boolean; lower: boolean; number: boolean; }; isValid: boolean; };
}

export default function ResetStep({ newPassword, setNewPassword, confirmPassword, setConfirmPassword, showNewPassword, setShowNewPassword, showConfirmPassword, setShowConfirmPassword, handlePasswordReset, isLoading, errors, passwordValidation }: ResetStepProps) {
    return (
        <div>
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-yellow-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt lại mật khẩu</h1>
                <p className="text-gray-600">Tạo mật khẩu mới cho tài khoản của bạn</p>
            </div>

            <form onSubmit={handlePasswordReset} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            autoComplete="off"
                            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                            placeholder="Nhập mật khẩu mới"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
                        >
                            {showNewPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}

                    {newPassword && (
                        <div className="mt-2 space-y-1">
                            <div className="flex items-center space-x-2 text-xs">
                                <div className={`w-2 h-2 rounded-full ${passwordValidation.checks.length ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className={passwordValidation.checks.length ? 'text-green-600' : 'text-gray-500'}>Tối thiểu 8 ký tự</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs">
                                <div className={`w-2 h-2 rounded-full ${passwordValidation.checks.upper ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className={passwordValidation.checks.upper ? 'text-green-600' : 'text-gray-500'}>Ít nhất 1 chữ hoa</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs">
                                <div className={`w-2 h-2 rounded-full ${passwordValidation.checks.lower ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className={passwordValidation.checks.lower ? 'text-green-600' : 'text-gray-500'}>Ít nhất 1 chữ thường</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs">
                                <div className={`w-2 h-2 rounded-full ${passwordValidation.checks.number ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className={passwordValidation.checks.number ? 'text-green-600' : 'text-gray-500'}>Ít nhất 1 số</span>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Xác nhận mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="off"
                            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
                            placeholder="Nhập lại mật khẩu mới"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                    {confirmPassword && newPassword === confirmPassword && (
                        <div className="mt-1 flex items-center text-sm text-green-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mật khẩu khớp
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !passwordValidation.isValid || newPassword !== confirmPassword}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                            Đang cập nhật...
                        </div>
                    ) : (
                        'Đặt lại mật khẩu'
                    )}
                </button>
            </form>
        </div>
    );
}
