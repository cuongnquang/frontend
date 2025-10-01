import { useRouter } from 'next/navigation'
import { useState } from 'react';
import Alert from '@/components/ui/Alert';

// Định nghĩa kiểu trả về cho hook
interface DeleteAccountResult {
    isDeleting: boolean;
    error: string | null;
    deleteAccount: (userId: number) => Promise<boolean>;
}

export function useDeleteAccount(): DeleteAccountResult {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const deleteAccount = async (userId: number): Promise<boolean> => {
        setIsDeleting(true);
        setError(null);

        try {
            // Thay thế bằng endpoint API thực tế của bạn
            const response = await fetch(`/api/user/${userId}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Xóa tài khoản thất bại do lỗi máy chủ.');

            }
            console.log(`Tài khoản người dùng ${userId} đã được xóa thành công.`);
            router.push('/');
            return true;

        } catch (err: any) {
            setError(err.message);
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    return { isDeleting, error, deleteAccount };
}