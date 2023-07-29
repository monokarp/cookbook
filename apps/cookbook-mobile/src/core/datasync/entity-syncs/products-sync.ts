import { ProductEntity } from "@cookbook/domain/types/product/product";
import { injectable } from "inversify";
import { ProductsCloudRepository } from "../../cloud-repositories/products.cloud-repo";
import { ProductsRepository } from "../../repositories/products.repository";
import { DataSync } from "../datasync.service";
import { BaseEntitySync } from "./base-entity-sync";

@injectable()
export class ProductsSync extends BaseEntitySync<ProductEntity> {

    constructor(
        ds: DataSync,
        protected override readonly localRepo: ProductsRepository,
        protected override readonly cloudRepo: ProductsCloudRepository
    ) {
        super(ds);
    }
}