import { Briefcase, Lock, Bell, CreditCard, LucideIcon } from "lucide-react";

const TabButton = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
      active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    <Icon className="h-5 w-5 mr-3" />
    {label}
  </button>
);

const tabs = [
  { id: 'profile', label: 'Hồ sơ chuyên môn', icon: Briefcase },
  { id: 'security', label: 'Bảo mật', icon: Lock },
  { id: 'notifications', label: 'Thông báo', icon: Bell },
  { id: 'billing', label: 'Thanh toán', icon: CreditCard },
];

export const SettingsNav = ({ activeTab, onTabChange }) => (
  <div className="bg-white p-2 rounded-lg border border-gray-200 flex flex-wrap gap-2">
    {tabs.map(tab => (
      <TabButton
        key={tab.id}
        active={activeTab === tab.id}
        icon={tab.icon}
        label={tab.label}
        onClick={() => onTabChange(tab.id)}
      />
    ))}
  </div>
);