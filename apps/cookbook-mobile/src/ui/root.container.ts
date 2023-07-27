import { Container } from 'inversify';
import { Database } from '../core/database/database';
import { SeedData } from '../core/database/seed-data';
import { PrepacksRepository } from '../core/repositories/prepack.repository';
import { ProductsRepository } from '../core/repositories/products.repository';
import { RecipesRepository } from '../core/repositories/recipes.repository';
import { DataSync } from '../core/datasync/datasync.service';
import { ProductsCloudRepository, ProductsFirestore } from '../core/cloud-repositories/products.cloud-repo';
import { ProductsSync } from '../core/datasync/concrete/products-sync';
import { PrepacksCloudRepository, PrepacksFirestore } from '../core/cloud-repositories/prepacks.cloud-repo';
import { RecipesCloudRepository, RecipesFirestore } from '../core/cloud-repositories/recipes.cloud-repo';
import { PrepacksSync } from '../core/datasync/concrete/prepack-sync';
import { RecipesSync } from '../core/datasync/concrete/recipe-sync';
import { DatasyncRepository } from '../core/repositories/datasync.repository';

export function buildRootContainer() {
    const container = new Container();

    container.bind(Database).toSelf().inSingletonScope();

    container.bind(SeedData).toSelf().inSingletonScope();

    // Entity order below is important due to implicit dependencies
    container.bind(ProductsCloudRepository).to(ProductsFirestore).inSingletonScope();
    container.bind(PrepacksCloudRepository).to(PrepacksFirestore).inSingletonScope();
    container.bind(RecipesCloudRepository).to(RecipesFirestore).inSingletonScope();

    container.bind(ProductsRepository).toSelf().inSingletonScope();
    container.bind(PrepacksRepository).toSelf().inSingletonScope();
    container.bind(RecipesRepository).toSelf().inSingletonScope();
    container.bind(DatasyncRepository).toSelf().inSingletonScope();

    container.bind(ProductsSync).toSelf().inSingletonScope();
    container.bind(PrepacksSync).toSelf().inSingletonScope();
    container.bind(RecipesSync).toSelf().inSingletonScope();

    container.bind(DataSync).toSelf().inSingletonScope();

    return container;
}
