'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'

interface NavItem {
    name: string
    href: string
    icon: LucideIcon
}

interface SidebarNavProps {
    navigation: NavItem[]
    setSidebarOpen: (open: boolean) => void
}

export function SidebarNav({ navigation, setSidebarOpen }: SidebarNavProps) {
    const pathname = usePathname()

    return (
        <nav className="flex-1 p-4">
            <ul className="space-y-2">
                {navigation.map((item) => {
                    const IconComponent = item.icon
                    const isActive = pathname === item.href
                    return (
                        <li key={item.name}>
                            <Link href={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-blue-100 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`}>
                                <IconComponent className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}