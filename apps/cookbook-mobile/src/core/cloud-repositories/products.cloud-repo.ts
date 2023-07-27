import { ProductDto } from "@cookbook/domain/types/product/product";
import { FirestoreRepository } from "./base-firestore.cloud-repo";
import { injectable } from "inversify";
import { CloudRepositoryBase } from "./cloud-repo";

export abstract class ProductsCloudRepository extends CloudRepositoryBase<ProductDto>{ };

@injectable()
export class ProductsFirestore extends FirestoreRepository<ProductDto>{

    constructor() {
        super('dev-products');
    }
};