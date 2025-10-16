import { LucideIcon } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  icon?: LucideIcon;
  required?: boolean;
}

export const FormInput = ({ label, type, name, icon: Icon, required, ...props }: FormInputProps) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />}
      <input
        type={type}
        id={name}
        name={name}
        required={required}
        className={`block w-full h-10 rounded-lg border-gray-300 shadow-sm focus:ring-2 text-black focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm ${Icon ? 'pl-10' : ''}`}
        {...props}
      />
    </div>
  </div>
);