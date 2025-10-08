import { Mail, Key, RefreshCw } from 'lucide-react';

interface EmailStepProps {
    email: string;
    setEmail: (email: string) => void;
    handleEmailSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    errors: Record<string, string>;
}

export default function EmailStep({ email, setEmail, handleEmailSubmit, isLoading, errors }: EmailStepProps) {
    return (
        <div>
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Key className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quên mật khẩu?</h1>
                <p className="text-gray-600">Nhập email của bạn và chúng tôi sẽ gửi mã xác thực để đặt lại mật khẩu</p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email đăng ký <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                            placeholder="Nhập email của bạn"
                            autoFocus
                        />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                            Đang gửi...
                        </div>
                    ) : (
                        'Gửi mã xác thực'
                    )}
                </button>
            </form>
        </div>
    );
}
