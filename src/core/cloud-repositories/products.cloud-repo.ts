import { ProductEntity } from "@cookbook/domain/types/product/product";
import { FirestoreRepository } from "./base-firestore.cloud-repo";
import { CloudRepositoryBase } from "./cloud-repo";

export abstract class ProductsCloudRepository extends CloudRepositoryBase<ProductEntity>{ };

export class ProductsFirestore extends FirestoreRepository<ProductEntity>{
    constructor() {
        super('products');
    }
};