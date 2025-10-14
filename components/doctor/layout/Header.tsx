
import { Bell } from "lucide-react";

export default function Header() {

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex-shrink-0">
      <div className="flex  justify-end items-center px-6 h-full w-full">
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700">
            <Bell className="h-6 w-6" />
          </button>
        </div>
    </header>
  );
}