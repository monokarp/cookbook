export interface EntitySync {
    recover(userId: string): Promise<void>;
    sendPending(userId: string, lastSynced: Date): Promise<void>;
    sendAll(userId: string): Promise<void>;
    clearDeleted(): Promise<void>;
}