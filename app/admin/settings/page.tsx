'use client'

import { useState } from 'react'
import {
  Settings,
  Bell,
  Mail,
  Shield,
  Database,
  Palette,
  Calendar,
  DollarSign,
  User,
} from 'lucide-react'

import SettingsPageHeader from '@/components/admin/settings/SettingsPageHeader'
import SettingsTabs from '@/components/admin/settings/SettingsTabs'
import AdminProfileSettings from '@/components/admin/settings/AdminProfileSettings'
import GeneralSettings from '@/components/admin/settings/GeneralSettings'
import AppointmentSettings from '@/components/admin/settings/AppointmentSettings'
import NotificationSettings from '@/components/admin/settings/NotificationSettings'
import PaymentSettings from '@/components/admin/settings/PaymentSettings'
import EmailSettings from '@/components/admin/settings/EmailSettings'
import SecuritySettings from '@/components/admin/settings/SecuritySettings'
import BackupSettings from '@/components/admin/settings/BackupSettings'
import AppearanceSettings from '@/components/admin/settings/AppearanceSettings'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('account')
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // State for all settings
  const [settings, setSettings] = useState({
    general: {
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'vi',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      currency: 'VND',
    },
    appointments: {
      slotDuration: 30,
      bookingAdvance: 7,
      cancellationPeriod: 24,
      maxAppointmentsPerDay: 50,
      allowOnlineBooking: true,
      requireDeposit: false,
      depositAmount: 0,
      autoConfirm: false,
      sendReminders: true,
      reminderTime: 24,
      allowReschedule: true,
      rescheduleLimit: 2,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      appointmentConfirmation: true,
      appointmentReminder: true,
      appointmentCancellation: true,
      paymentConfirmation: true,
      newPatientWelcome: true,
      systemAlerts: true,
      reportSummary: true,
    },
    payment: {
        enableCash: true,
        enableCard: true,
        enableBankTransfer: true,
        enableInsurance: true,
        enableEWallet: true,
        autoInvoice: true,
        invoicePrefix: 'INV',
        receiptPrefix: 'REC',
        taxRate: 10,
        lateFee: 5,
        paymentTerms: 'Thanh toán trong vòng 7 ngày'
    },
    email: {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUsername: 'notifications@youmed.vn',
        smtpPassword: '••••••••',
        senderName: 'YouMed',
        senderEmail: 'no-reply@youmed.vn',
        useTLS: true
    },
    security: {
        enableTwoFactor: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordMinLength: 8,
        requireSpecialChar: true,
        requireNumber: true,
        requireUppercase: true,
        passwordExpiry: 90,
        ipWhitelist: [],
        auditLog: true
    },
    backup: {
        autoBackup: true,
        backupFrequency: 'daily',
        backupTime: '02:00',
        retentionDays: 30,
        backupLocation: 'cloud',
        lastBackup: '2024-02-15 02:00:00'
    },
    appearance: {
        primaryColor: '#2563eb',
        secondaryColor: '#64748b',
        logo: null,
        favicon: null,
        loginBackground: null,
        theme: 'light',
        fontFamily: 'Inter'
    }
  })

  const handleSettingsChange = (tab: string, newSettings: any) => {
    setSettings(prev => ({ ...prev, [tab]: newSettings }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    console.log('Saving settings:', settings)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    setHasChanges(false)
    alert('Đã lưu cài đặt thành công!')
  }

  const handleReset = () => {
    if (confirm('Bạn có chắc muốn khôi phục cài đặt mặc định cho tab này?')) {
      // Reset logic would go here, potentially fetching defaults
      alert('Đã khôi phục cài đặt mặc định.')
    }
  }

  const tabs = [
    { id: 'account', name: 'Tài khoản', icon: User },
    { id: 'general', name: 'Tổng quan', icon: Settings },
    { id: 'appointments', name: 'Lịch hẹn', icon: Calendar },
    { id: 'notifications', name: 'Thông báo', icon: Bell },
    { id: 'payment', name: 'Thanh toán', icon: DollarSign },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'security', name: 'Bảo mật', icon: Shield },
    { id: 'backup', name: 'Sao lưu', icon: Database },
    { id: 'appearance', name: 'Giao diện', icon: Palette },
  ]

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'account':
        return <AdminProfileSettings />
      case 'general':
        return <GeneralSettings settings={settings.general} onChange={(newSettings) => handleSettingsChange('general', newSettings)} />
      case 'appointments':
        return <AppointmentSettings settings={settings.appointments} onChange={(newSettings) => handleSettingsChange('appointments', newSettings)} />
      case 'notifications':
        return <NotificationSettings settings={settings.notifications} onChange={(newSettings) => handleSettingsChange('notifications', newSettings)} />
      case 'payment':
        return <PaymentSettings settings={settings.payment} onChange={(newSettings) => handleSettingsChange('payment', newSettings)} />
      case 'email':
        return <EmailSettings settings={settings.email} onChange={(newSettings) => handleSettingsChange('email', newSettings)} />
      case 'security':
        return <SecuritySettings settings={settings.security} onChange={(newSettings) => handleSettingsChange('security', newSettings)} />
      case 'backup':
        return <BackupSettings settings={settings.backup} onChange={(newSettings) => handleSettingsChange('backup', newSettings)} />
      case 'appearance':
        return <AppearanceSettings settings={settings.appearance} onChange={(newSettings) => handleSettingsChange('appearance', newSettings)} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <SettingsPageHeader
        isSaving={isSaving}
        hasChanges={hasChanges}
        onSave={handleSave}
        onReset={handleReset}
      />
      <SettingsTabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />

      <div className="bg-white rounded-xl shadow-sm">
        {renderActiveTab()}
      </div>
    </div>
  )
}
