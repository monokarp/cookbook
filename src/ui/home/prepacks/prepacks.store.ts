import { Prepack } from "@cookbook/domain/types/prepack/prepack";
import { entityListStoreFactory } from "../../common/entity-list.store";

export const usePrepacksStore = entityListStoreFactory<Prepack>();
