import { Container } from 'inversify';
import { ProductsRepository } from '../app/repositories/products.repository';
import { RecipesRepository } from '../app/repositories/recipes.repository';
import { ProductsService } from '../app/services/products.service';
import { RecipesService } from '../app/services/recipes.service';

export function buildRootContainer() {
    const container = new Container();

    container.bind(ProductsRepository).toSelf().inSingletonScope();
    container.bind(RecipesRepository).toSelf().inSingletonScope();

    container.bind(ProductsService).toSelf().inSingletonScope();
    container.bind(RecipesService).toSelf().inSingletonScope();

    return container;
}
