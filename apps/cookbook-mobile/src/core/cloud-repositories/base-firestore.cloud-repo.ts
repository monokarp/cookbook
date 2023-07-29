import { NamedEntity } from '@cookbook/domain/types/named-entity';
import firestore from '@react-native-firebase/firestore';
import { CloudRepository } from './cloud-repo';


export abstract class FirestoreRepository<T extends NamedEntity> implements CloudRepository<T> {

    constructor(public readonly collectionName: string) { }

    public async Many(userId: string): Promise<T[]> {
        const data = await firestore().collection<RemotelyStored<T>>(this.collectionName).where('userId', '==', userId).get();

        return data.docs.map(one => {
            const dto = one.data();

            return { id: one.id, ...dto };
        })
    }

    public async SaveMany(userId: string, entities: T[]): Promise<void> {
        for (const one of entities) {
            const { id, ...dto } = one;

            await firestore().collection(this.collectionName).doc(id).update({ ...dto, userId });
        }
    }
}

type RemotelyStored<T> = T & {
    userId: string;
}