"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  CalendarDays,
  CalendarClock,
  Users,
  MessageSquare,
  Star,
  Settings,
  LogOut,
  Icon,
  IconNode,
} from "lucide-react"; // Import từ lucide-react

// Định nghĩa kiểu cho mỗi link
interface NavLink {
  href: string;
  label: string;
  icon: IconNode; // Kiểu Icon từ lucide-react
}

// Định nghĩa các nhóm link
const navGroups = [
  {
    title: "Chính",
    links: [
      {
        href: "/doctor/dashboard",
        label: "Bảng điều khiển",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Quản lý lâm sàng",
    links: [
      {
        href: "/doctor/appointments",
        label: "Lịch hẹn",
        icon: CalendarDays,
      },
      { href: "/doctor/schedules", label: "Lịch làm việc", icon: CalendarClock },
      { href: "/doctor/patients", label: "Bệnh nhân", icon: Users },
    ],
  },
  {
    title: "Giao tiếp",
    links: [
      { href: "/doctor/messages", label: "Tin nhắn", icon: MessageSquare },
      { href: "/doctor/reviews", label: "Đánh giá", icon: Star },
    ],
  },
];

export default function Sidebar() {
  const { logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo/Title */}
      <div className="h-16 flex items-center justify-start px-4 border-b border-gray-200 text-3xl font-extrabold tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
          Medi
        </span>
        <span className="text-purple-700">Doctor</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {group.title}
            </h3>
            <div className="mt-2 space-y-1">
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive(link.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <link.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer (User/Logout) */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-1">
          <Link
            href="/doctor/settings"
            className={`
              flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${isActive("/doctor/settings")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            <Settings className="h-5 w-5 mr-3" />
            Cài đặt
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Đăng xuất
          </button>
        </div>
      </div>
    </aside>
  );
}