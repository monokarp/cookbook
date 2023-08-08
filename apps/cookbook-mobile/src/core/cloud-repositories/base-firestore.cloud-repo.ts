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

    public async SaveMany(userId: string, entities: T[]): Promise<void> {

        console.log(`${this.getCollectionName()} cloud repo - saving many`);

        for (const one of entities) {
            const { id, ...dto } = one;

            console.log(`saving into ${this.getCollectionName()}`);
            console.log(id, { ...dto, userId });

            await firestore().collection(this.getCollectionName()).doc(id).set({ ...dto, userId });
        }
    }

    private getCollectionName(): string {
        return `${Environment.Type === 'Prod' ? '' : 'dev-'}${this.collectionName}`;
    }
}

type RemotelyStored<T> = T & {
    userId: string;
}