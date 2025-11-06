'use client';

export const DoctorItem = ({ doctor, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
    >
      <img src={doctor.avatar_url} alt={doctor.full_name} className="w-10 h-10 rounded-full mr-3" />
      <div>
        <p className="font-semibold">{doctor.full_name}</p>
        <p className="text-sm text-gray-500">{doctor.specialty?.name}</p>
      </div>
    </div>
  );
};