import { initialMigration } from "./1_initial";
import { recipeDescription } from "./2_recipe_description";
import { pendingDeletionTables } from "./3_pending_deletion_tables";
import { addRecipePositionGroups } from "./4_recipe_position_groups";
import { prepackDescription } from "./5_prepack_description";
import { recursivePrepacks } from "./6_recursive_prepacks";
import { recipePortions } from "./7_recipe_portions";

export const migrations = [
    initialMigration,
    recipeDescription,
    pendingDeletionTables,
    addRecipePositionGroups,
    prepackDescription,
    recursivePrepacks,
    recipePortions,
];