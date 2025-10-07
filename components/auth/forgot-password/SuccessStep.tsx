import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

interface SuccessStepProps {
    router: {
        push: (path: string) => void;
    };
}

export default function SuccessStep({ router }: SuccessStepProps) {
    return (
        <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Thành công!</h1>
            <p className="text-gray-600 mb-8">Mật khẩu của bạn đã được đặt lại thành công. Bây giờ bạn có thể đăng nhập với mật khẩu mới.</p>

            <div className="space-y-4">
                <button
                    onClick={() => router.push('/auth/login')}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors"
                >
                    Đăng nhập ngay
                </button>

                <Link
                    href="/"
                    className="block w-full text-center py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Về trang chủ
                </Link>
            </div>
        </div>
    );
}
