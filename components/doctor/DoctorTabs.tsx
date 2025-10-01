import React from 'react'
import { Doctor, Review } from '@/types/types' // Import interfaces
// Import các component nội dung Tab
import { TabContentAbout } from './TabContentAbout'
import { TabContentExpertise } from './TabContentExpretise'
import { TabContentEducation } from './TabContentEducation'
import { TabContentReviews } from './Reviews'

interface DoctorTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    doctor: Doctor;
    reviews: Review[];
}

export const DoctorTabs: React.FC<DoctorTabsProps> = ({ activeTab, setActiveTab, doctor, reviews }) => {
    const tabs = [
        { id: 'about', label: 'Giới Thiệu' },
        { id: 'expertise', label: 'Chuyên Môn' },
        { id: 'education', label: 'Học Vấn' },
        { id: 'reviews', label: 'Đánh Giá' }
    ]

    const renderContent = () => {
        switch (activeTab) {
            case 'about':
                return <TabContentAbout doctor={doctor} />
            case 'expertise':
                return <TabContentExpertise doctor={doctor} />
            case 'education':
                return <TabContentEducation doctor={doctor} />
            case 'reviews':
                return <TabContentReviews doctorRating={doctor.rating} totalReviews={doctor.reviews} reviews={reviews} />
            default:
                return null
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
                <nav className="flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="p-6">
                {renderContent()}
            </div>
        </div>
    )
}