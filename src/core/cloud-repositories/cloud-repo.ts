import { NamedEntity } from "@cookbook/domain/types/named-entity";

export interface CloudRepository<T extends NamedEntity> {
    readonly collectionName: string;
    Many(userId: string): Promise<T[]>;
    SaveMany(userId: string, entities: T[]): Promise<void>;
    DeleteMany(ids: string[]): Promise<void>
}

export abstract class CloudRepositoryBase<T extends NamedEntity> implements CloudRepository<T> {
    public readonly collectionName: string;
    public abstract Many(userId: string): Promise<T[]>;
    public abstract SaveMany(userId: string, entities: T[]): Promise<void>;
    public abstract DeleteMany(ids: string[]): Promise<void>
}