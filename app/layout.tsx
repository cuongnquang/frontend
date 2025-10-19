import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { SpecialtyProvider } from "@/contexts/SpecialtyContext";
import { DoctorProvider } from "@/contexts/DoctorContext";
import { PatientProvider } from '@/contexts/PatientContext';


const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  title: 'MediContect - Ứng dụng đặt lịch khám bác sĩ, bệnh viện và dịch vụ y tế',
  description: 'Đặt lịch khám bệnh trực tuyến với các bác sĩ và bệnh viện uy tín',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="mdl-js" lang='vi'>
      <body className={inter.className}>
        <AuthProvider>
          <SpecialtyProvider>
            <DoctorProvider>
              <PatientProvider>
                {children}
              </PatientProvider>
            </DoctorProvider>
          </SpecialtyProvider>
        </AuthProvider>
      </body>
    </html>
  )
}