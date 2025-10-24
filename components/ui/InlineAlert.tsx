interface AlertProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
}

export function Alert({ message, type = 'info', className = '' }: AlertProps) {
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className={`p-4 rounded-lg border ${typeClasses[type]} ${className}`}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
