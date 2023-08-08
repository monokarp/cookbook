import { initialMigration } from "./1_initial";
import { recipeDescription } from "./2_recipe_description";

export const migrations = [
    initialMigration,
    recipeDescription,
];