import { NamedEntity } from '@cookbook/domain/types/named-entity';
import firestore from '@react-native-firebase/firestore';
import { Environment } from '../../ui/env';
import { CloudRepository } from './cloud-repo';


export abstract class FirestoreRepository<T extends NamedEntity> implements CloudRepository<T> {

    constructor(public readonly collectionName: string) { }

    public async Many(userId: string): Promise<T[]> {
        const data = await firestore().collection<RemotelyStored<T>>(this.getCollectionName()).where('userId', '==', userId).get();

        return data.docs.map(one => {
            const dto = one.data();

            return { id: one.id, ...dto };
        })
    }

    public SaveMany(userId: string, entities: T[]): Promise<void> {
        console.log(`${this.getCollectionName()} cloud repo - saving many`);

        const collection = this.getCollection();
        const batch = firestore().batch();

        for (const one of entities) {
            const { id, ...dto } = one;

            batch.set(collection.doc(id), { ...dto, userId });
        }

        return batch.commit();
    }

    public DeleteMany(ids: string[]): Promise<void> {
        const collection = this.getCollection();
        const batch = firestore().batch();

        for (const id of ids) {
            batch.delete(collection.doc(id));
        }

        return batch.commit();
    }

    private getCollection() {
        return firestore().collection(this.getCollectionName());
    }

    private getCollectionName(): string {
        return `${Environment.Type === 'Prod' ? '' : 'dev-'}${this.collectionName}`;
    }
}

type RemotelyStored<T> = T & {
    userId: string;
}