import { Container } from 'inversify';
import { ProductsRepository } from '../core/repositories/products.repository';
import { RecipesRepository } from '../core/repositories/recipes.repository';
import { ProductsService } from '../app/services/products.service';
import { RecipesService } from '../app/services/recipes.service';
import { InjectionTokens } from '../constants';

export function buildRootContainer(realm: { useObject, useQuery, useRealm }) {
    const container = new Container();

    container.bind(InjectionTokens.Realm).toConstantValue(realm);

    container.bind(ProductsRepository).toSelf().inSingletonScope();
    container.bind(RecipesRepository).toSelf().inSingletonScope();

    container.bind(ProductsService).toSelf().inSingletonScope();
    container.bind(RecipesService).toSelf().inSingletonScope();

    return container;
}
