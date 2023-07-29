import { ProductEntity } from "@cookbook/domain/types/product/product";
import { inject, injectable } from "inversify";
import { ProductsCloudRepository } from "../../cloud-repositories/products.cloud-repo";
import { ProductsRepository } from "../../repositories/products.repository";
import { DataSync } from "../datasync.service";
import { BaseEntitySync } from "./base-entity-sync";

@injectable()
export class ProductsSync extends BaseEntitySync<ProductEntity> {

    @inject(DataSync) private readonly ds!: DataSync;

    @inject(ProductsRepository) protected readonly localRepo!: ProductsRepository;
    @inject(ProductsCloudRepository) protected readonly cloudRepo!: ProductsCloudRepository;

    constructor() {
        super();

        this.ds.register(this);
    }
}