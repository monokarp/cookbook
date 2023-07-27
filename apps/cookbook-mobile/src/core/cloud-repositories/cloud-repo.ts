export interface CloudRepository<T> {
    many(userId: string): Promise<T[]>;
    save(entity: T): Promise<void>;
}

export abstract class CloudRepositoryBase<T> implements CloudRepository<T> {
    public abstract many(userId: string): Promise<T[]>;
    public abstract save(entity: T): Promise<void>;
}