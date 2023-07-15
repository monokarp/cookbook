import { Recipe } from '@cookbook/domain/types/recipe/recipe';
import { entityListStoreFactory } from '../common/entity-list.store';

export const useRecipesStore = entityListStoreFactory<Recipe>();
