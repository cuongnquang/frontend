'use client';
interface Tab {
  name: string;
  status: string;
  count: number;
}

interface AppointmentTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (status: string) => void;
}

export const AppointmentTabs = ({ tabs, activeTab, onTabChange }: AppointmentTabsProps) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="border-b border-gray-200">
      <nav className="flex space-x-1 px-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.status}
            onClick={() => onTabChange(tab.status)}
            className={`
              relative py-4 px-4 font-medium text-sm transition-colors
              ${activeTab === tab.status
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'}
            `}
          >
            {tab.name}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.status 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {tab.count}
            </span>
            {activeTab === tab.status && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
        ))}
      </nav>
    </div>
  </div>
);