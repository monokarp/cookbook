import firestore from '@react-native-firebase/firestore';
import { CloudRepository } from './cloud-repo';


export abstract class FirestoreRepository<T> implements CloudRepository<T> {

    constructor(private readonly collectionName: string) { }

    public async many(userId: string): Promise<T[]> {
        const data = await firestore().collection<RemotelyStored<T>>(this.collectionName).where('userId', '==', userId).get();

        return data.docs.map(one => {
            const dto = one.data();

            return { id: one.id, ...dto };
        })
    }

    public save(entity: T): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

type RemotelyStored<Entity> = Entity & {
    lastModified: string
    userId: string;
}