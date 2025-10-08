import { Mail, Clock, RefreshCw } from 'lucide-react';

interface VerificationStepProps {
    email: string;
    verificationCode: string[];
    handleCodeInput: (index: number, value: string) => void;
    handleCodeKeyDown: (index: number, e: React.KeyboardEvent) => void;
    handleVerificationSubmit: (e: React.FormEvent) => void;
    resendCode: () => void;
    isLoading: boolean;
    errors: Record<string, string>;
    countdown: number;
}

export default function VerificationStep({ email, verificationCode, handleCodeInput, handleCodeKeyDown, handleVerificationSubmit, resendCode, isLoading, errors, countdown }: VerificationStepProps) {
    return (
        <div>
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Kiểm tra email</h1>
                <p className="text-gray-600 mb-2">Chúng tôi đã gửi mã xác thực 6 số đến:</p>
                <p className="font-semibold text-gray-900">{email}</p>
            </div>

            <form onSubmit={handleVerificationSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4 text-center">Nhập mã xác thực</label>
                    <div className="flex justify-center space-x-2">
                        {verificationCode.map((digit, index) => (
                            <input
                                key={index}
                                id={`code-${index}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleCodeInput(index, e.target.value)}
                                onKeyDown={(e) => handleCodeKeyDown(index, e)}
                                className={`w-12 h-12 text-center text-xl font-bold border rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.code ? 'border-red-300' : 'border-gray-300'}`}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>
                    {errors.code && <p className="mt-2 text-sm text-red-600 text-center">{errors.code}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading || verificationCode.join('').length !== 6}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                            Đang xác thực...
                        </div>
                    ) : (
                        'Xác thực'
                    )}
                </button>

                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Không nhận được mã?</p>
                    <button
                        type="button"
                        onClick={resendCode}
                        disabled={countdown > 0 || isLoading}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        {countdown > 0 ? (
                            <div className="flex items-center justify-center">
                                <Clock className="w-4 h-4 mr-1" />
                                Gửi lại sau {countdown}s
                            </div>
                        ) : (
                            'Gửi lại mã'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
