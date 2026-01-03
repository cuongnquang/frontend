'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import Alert from './Alert'

export interface AlertMessage {
  id: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
  duration?: number
}

interface AlertContextType {
  alerts: AlertMessage[]
  showAlert: (message: string, type?: 'info' | 'success' | 'error' | 'warning', duration?: number) => void
  removeAlert: (id: string) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<AlertMessage[]>([])

  const showAlert = useCallback((
    message: string,
    type: 'info' | 'success' | 'error' | 'warning' = 'info',
    duration = 4000
  ) => {
    const id = `alert-${Date.now()}-${Math.random()}`
    const newAlert: AlertMessage = { id, message, type, duration }
    
    setAlerts(prev => [...prev, newAlert])
  }, [])

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }, [])

  return (
    <AlertContext.Provider value={{ alerts, showAlert, removeAlert }}>
      {children}
      {/* Alert Container */}
      <div className="fixed top-20 right-6 z-50 space-y-3 pointer-events-none">
        {alerts.map(alert => (
          <div key={alert.id} className="pointer-events-auto">
            <Alert
              message={alert.message}
              type={alert.type}
              duration={alert.duration}
              onClose={() => removeAlert(alert.id)}
            />
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider')
  }
  return context
}
