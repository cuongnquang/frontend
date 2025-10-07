import { ActivityLog } from "./ActivityLogType";
import { User, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react'

interface ActivityTimelineProps {
    activities: ActivityLog[];
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />
        case 'failed': return <XCircle className="w-4 h-4 text-red-600" />
        case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />
        default: return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'success': return 'bg-green-100 text-green-800'
        case 'failed': return 'bg-red-100 text-red-800'
        case 'pending': return 'bg-yellow-100 text-yellow-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                    Nhật ký hoạt động ({activities.length})
                </h2>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                    {activities.map((activity, index) => (
                        <div key={activity.id} className="flex">
                            <div className="flex flex-col items-center mr-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                                    {getStatusIcon(activity.status)}
                                </div>
                                {index < activities.length - 1 && (
                                    <div className="w-0.5 h-full bg-gray-200 mt-2" />
                                )}
                            </div>

                            <div className="flex-1 pb-8">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h3 className="font-semibold text-gray-900">{activity.action}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                                                    {activity.status === 'success' ? 'Thành công' :
                                                        activity.status === 'failed' ? 'Thất bại' : 'Đang xử lý'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                <User className="w-3 h-3 inline mr-1" />
                                                {activity.user} ({activity.userId})
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-500">{activity.timestamp}</span>
                                    </div>

                                    <p className="text-sm text-gray-700 mb-2">{activity.details}</p>

                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                        <span>Entity: {activity.entity}</span>
                                        <span>•</span>
                                        <span>ID: {activity.entityId}</span>
                                        <span>•</span>
                                        <span>IP: {activity.ipAddress}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
