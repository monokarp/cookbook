import { initialMigration } from "./1_initial";
import { recipeDescription } from "./2_recipe_description";
import { pendingDeletionTables } from "./3_pending_deletion_tables";
import { addRecipePositionGroups } from "./4_recipe_position_groups";
import { prepackDescription } from "./5_prepack_description";

export const migrations = [
    initialMigration,
    recipeDescription,
    pendingDeletionTables,
    addRecipePositionGroups,
    prepackDescription,
    // @TODO add new migration
];