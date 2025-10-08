import { X, CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

interface AlertProps {
  message: string
  type?: 'info' | 'success' | 'error' | 'warning'
  duration?: number
}

export default function Alert({ message, type = 'info', duration = 4000 }: AlertProps) {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(100)
  const [isExiting, setIsExiting] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const start = Date.now()
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start
      const percent = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(percent)
      if (percent <= 0) {
        handleClose()
      }
    }, 30)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => setVisible(false), 300)
  }

  if (!visible) return null

  const config = {
    success: {
      bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      progressBar: 'bg-gradient-to-r from-emerald-400 to-green-500',
      shadow: 'shadow-emerald-100'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-rose-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      progressBar: 'bg-gradient-to-r from-red-400 to-rose-500',
      shadow: 'shadow-red-100'
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
      progressBar: 'bg-gradient-to-r from-amber-400 to-yellow-500',
      shadow: 'shadow-amber-100'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-sky-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-600" />,
      progressBar: 'bg-gradient-to-r from-blue-400 to-sky-500',
      shadow: 'shadow-blue-100'
    }
  }

  const style = config[type]

  return (
    <div
      className={`fixed top-26 right-6 z-50 min-w-[320px] max-w-md transform transition-all duration-300 ${
        isExiting ? 'translate-x-[120%] opacity-0' : 'translate-x-0 opacity-100'
      }`}
      style={{
        animation: isExiting ? undefined : 'slideIn 0.3s ease-out'
      }}
    >
      <div
        className={`${style.bg} ${style.border} ${style.shadow} border rounded-xl shadow-lg backdrop-blur-sm overflow-hidden`}
      >
        <div className="flex items-start gap-3 px-4 py-3.5">
          <div className="flex-shrink-0 mt-0.5">
            {style.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`${style.text} text-sm font-medium leading-relaxed`}>
              {message}
            </p>
          </div>
          <button
            onClick={handleClose}
            className={`flex-shrink-0 ${style.text} hover:opacity-70 transition-opacity rounded-lg p-1 hover:bg-black/5`}
            aria-label="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="w-full h-1 bg-black/5">
          <div
            className={`${style.progressBar} h-full transition-all ease-linear`}
            style={{ 
              width: `${progress}%`,
              transitionDuration: '30ms'
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}