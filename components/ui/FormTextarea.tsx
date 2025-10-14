import { LucideIcon } from "lucide-react";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  icon?: LucideIcon;
  rows?: number;
}

export const FormTextarea = ({ label, name, rows = 4, icon: Icon, ...props }: FormTextareaProps) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />}
      <textarea
        id={name}
        name={name}
        rows={rows}
        className={`block w-full rounded-lg border-gray-300 shadow-sm text-black focus:ring-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 ${Icon ? 'pl-10' : ''}`}
        {...props}
      />
    </div>
  </div>
);