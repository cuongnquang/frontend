import { StatCard } from "@/components/ui/StatCard"; // Giả sử Card ở global
import { statsData } from "@/app/doctor/data"; // Import dữ liệu

export const StatsGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {statsData.map(stat => (
      <StatCard key={stat.title} {...stat} />
    ))}
  </div>
);