'use client';
import { useState } from "react";
import { SettingsHeader } from "@/components/doctor/settings/SettingsHeader";
import { SettingsNav } from "@/components/doctor/settings/SettingsNav";
import { ProfileSettings } from "@/components/doctor/settings/ProfileSettings";
import { SecuritySettings } from "@/components/doctor/settings/SecuritySettings";
import { NotificationSettings } from "@/components/doctor/settings/NotificationSettings";
import { BillingSettings } from "@/components/doctor/settings/BillingSettings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />;
      case "security":
        return <SecuritySettings />;
      case "notifications":
        return <NotificationSettings />;
      case "billing":
        return <BillingSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <SettingsHeader />
      <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div>
        {renderContent()}
      </div>
    </div>
  );
}