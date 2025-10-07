'use client'

import { LucideIcon } from 'lucide-react'

interface Tab {
  id: string
  name: string
  icon: LucideIcon
}

interface SettingsTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabClick: (tabId: string) => void
}

export default function SettingsTabs({ tabs, activeTab, onTabClick }: SettingsTabsProps) {
  return (
    <div className="w-full overflow-x-auto bg-white rounded-xl shadow-sm p-2">
      <nav className="flex space-x-2">
        {tabs.map(tab => {
          const IconComponent = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab.id)}
              className={`flex-shrink-0 flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <IconComponent className="w-5 h-5 mr-2" />
              {tab.name}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
