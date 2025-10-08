export interface ActivityLog {
    id: string;
    user: string;
    userId: string;
    action: string;
    entity: string;
    entityId: string;
    timestamp: string;
    status: 'success' | 'failed' | 'pending' | string;
    ipAddress: string;
    details: string;
}
