'use client'

import Header from '@/components/layout/Header'
import Hero from '@/components/client/home/Hero'
import Features from '@/components/client/home/Features'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/contexts/AuthContext'
import FloatingChatWidget from '@/components/client/message/FloatingChatWidget'
export default function HomePage() {
  const {user} = useAuth()
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        {user && <FloatingChatWidget />}
      </main>
      <Footer />
    </>
  )
}
