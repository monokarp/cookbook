export interface EntitySync {
    recover(userId: string): Promise<void>;
}