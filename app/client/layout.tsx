'use client'

import FloatingChatWidget from '@/components/client/message/FloatingChatWidget'
import { useAuth } from '@/contexts/AuthContext'

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const {user} = useAuth()

    return (
        <div>
            {children}
            {user && <FloatingChatWidget />}
        </div >
    )
}