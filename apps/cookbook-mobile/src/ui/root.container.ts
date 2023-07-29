import { Container } from 'inversify';
import { Database } from '../core/database/database';
import { SeedData } from '../core/database/seed-data';
import { PrepacksRepository } from '../core/repositories/prepack.repository';
import { ProductsRepository } from '../core/repositories/products.repository';
import { RecipesRepository } from '../core/repositories/recipes.repository';
import { DataSync } from '../core/datasync/datasync.service';
import { ProductsCloudRepository, ProductsFirestore } from '../core/cloud-repositories/products.cloud-repo';
import { ProductsSync } from '../core/datasync/entity-syncs/products-sync';
import { PrepacksCloudRepository, PrepacksFirestore } from '../core/cloud-repositories/prepacks.cloud-repo';
import { RecipesCloudRepository, RecipesFirestore } from '../core/cloud-repositories/recipes.cloud-repo';
import { PrepacksSync } from '../core/datasync/entity-syncs/prepack-sync';
import { RecipesSync } from '../core/datasync/entity-syncs/recipe-sync';
import { DatasyncRepository } from '../core/repositories/datasync.repository';

export function buildRootContainer() {
    const container = new Container({ skipBaseClassChecks: true, defaultScope: 'Singleton' });

    container.bind(Database).toSelf();

    container.bind(SeedData).toSelf();

    // Entity order below is important due to implicit dependencies
    container.bind(ProductsCloudRepository).to(ProductsFirestore);
    container.bind(PrepacksCloudRepository).to(PrepacksFirestore);
    container.bind(RecipesCloudRepository).to(RecipesFirestore);

    container.bind(DatasyncRepository).toSelf();
    container.bind(ProductsRepository).toSelf();
    container.bind(PrepacksRepository).toSelf();
    container.bind(RecipesRepository).toSelf();

    container.bind(DataSync).toSelf();

    // Entities' syncs are not referenced and must be resolved manually
    container.bind(ProductsSync).toSelf();
    container.resolve(ProductsSync);

    container.bind(PrepacksSync).toSelf();
    container.bind(RecipesSync).toSelf();

    return container;
}
