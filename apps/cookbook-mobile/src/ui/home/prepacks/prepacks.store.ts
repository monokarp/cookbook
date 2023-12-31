import { Prepack } from '@cookbook/domain/types/recipe/prepack';
import { entityListStoreFactory } from '../../common/entity-list.store';

export const usePrepacksStore = entityListStoreFactory<Prepack>();