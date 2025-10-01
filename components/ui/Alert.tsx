import { X } from 'lucide-react'
import { useState } from 'react'

interface AlertProps {
    message: string
    type?: 'info' | 'success' | 'error' | 'warning'
}

export default function Alert({ message, type = 'info' }: AlertProps) {
    const [visible, setVisible] = useState(true)

    if (!visible) return null

    const color =
        type === 'success' ? 'bg-green-100 text-green-800 border-green-300'
            : type === 'error' ? 'bg-red-100 text-red-800 border-red-300'
                : type === 'warning' ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                    : 'bg-blue-100 text-blue-800 border-blue-300'

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 flex items-center justify-between px-4 py-3 rounded-lg border shadow-lg ${color} min-w-[280px]`}
        >
            <span>{message}</span>
            <button onClick={() => setVisible(false)} className="ml-4">
                <X className="w-5 h-5" />
            </button>
        </div>
    )
}