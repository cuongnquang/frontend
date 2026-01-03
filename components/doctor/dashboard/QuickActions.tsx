"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { QuickActionButton } from "./QuickActionButton";
import { Calendar, Users, Video, MessageSquare } from "lucide-react";

export const QuickActions = () => (
  <Card className="p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Link href="/doctor/appointments" className="no-underline">
        <QuickActionButton icon={Calendar} label="Lịch hẹn" color="blue" />
      </Link>
      <Link href="/doctor/patients" className="no-underline">
        <QuickActionButton icon={Users} label="Bệnh nhân" color="green" />
      </Link>
      <Link href="/doctor/schedules" className="no-underline">
        <QuickActionButton icon={Video} label="Lịch trình" color="purple" />
      </Link>
      <Link href="/doctor/messages" className="no-underline">
        <QuickActionButton icon={MessageSquare} label="Tin nhắn" color="yellow" />
      </Link>
    </div>
  </Card>
);