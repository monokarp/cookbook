import { initialMigration } from "./1_initial";
import { recipeDescription } from "./2_recipe_description";
import { pendingDeletionTables } from "./3_pending_deletion_tables";

export const migrations = [
    initialMigration,
    recipeDescription,
    pendingDeletionTables,
];