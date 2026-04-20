import { ProductEntity } from "@cookbook/domain/types/product/product";
import { injectable } from "inversify";
import { FirestoreRepository } from "./base-firestore.cloud-repo";
import { CloudRepositoryBase } from "./cloud-repo";

export abstract class ProductsCloudRepository extends CloudRepositoryBase<ProductEntity>{ };

@injectable()
export class ProductsFirestore extends FirestoreRepository<ProductEntity>{
    constructor() {
        super('products');
    }
};