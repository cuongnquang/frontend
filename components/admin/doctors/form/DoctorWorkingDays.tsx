// Helper type cho workingDays
type WorkingDays = Record<string, boolean>;
type SetFormData = React.Dispatch<React.SetStateAction<any>>;

interface DoctorWorkingDaysProps {
    workingDays: WorkingDays
    setFormData: SetFormData
    isReadOnly: boolean
}

const dayMap: Record<string, string> = {
    monday: 'Thứ 2',
    tuesday: 'Thứ 3',
    wednesday: 'Thứ 4',
    thursday: 'Thứ 5',
    friday: 'Thứ 6',
    saturday: 'Thứ 7',
    sunday: 'Chủ Nhật',
}

export function DoctorWorkingDays({ workingDays, setFormData, isReadOnly }: DoctorWorkingDaysProps) {
    const handleDayToggle = (day: string, isChecked: boolean) => {
        setFormData((prev: any) => ({
            ...prev,
            workingDays: {
                ...prev.workingDays,
                [day]: isChecked
            }
        }))
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ngày làm việc</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(workingDays).map(([day, isWorking]) => (
                    <label key={day} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            disabled={isReadOnly}
                            checked={isWorking as boolean}
                            onChange={(e) => handleDayToggle(day, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                            {dayMap[day]}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    )
}