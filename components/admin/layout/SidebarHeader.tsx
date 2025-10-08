import Link from 'next/link'
import { X } from 'lucide-react'

interface SidebarHeaderProps {
    setSidebarOpen: (open: boolean) => void
}

export function SidebarHeader({ setSidebarOpen }: SidebarHeaderProps) {
    return (
        <div className="flex items-center justify-between p-4 border-b">
            <Link href="/admin/dashboard" className="text-4xl font-extrabold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
                    Medi
                </span>
                <span className="text-purple-700">Admin</span>
            </Link>
            <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    )
}