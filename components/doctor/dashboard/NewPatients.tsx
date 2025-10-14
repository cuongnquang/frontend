import { Card } from "@/components/ui/Card";
import { newPatientsData } from "@/app/doctor/data";

export const NewPatients = () => (
  <Card className="p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Bệnh nhân mới gần đây</h2>
    <div className="space-y-3">
      {newPatientsData.map((name, idx) => (
        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <img 
              className="h-10 w-10 rounded-full" 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} 
              alt={name} 
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{name}</p>
              <p className="text-xs text-gray-500">Đăng ký hôm nay</p>
            </div>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Xem
          </button>
        </div>
      ))}
    </div>
  </Card>
);