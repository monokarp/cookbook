import { useRef } from "react";
import { RecipeDetails } from "./recipe-details";
import { RecipeDetailsContext, createRecipeDetailsStore } from "./recipe-details.store";

export function RecipeDetailsWithContext(props) {
    return (
        <RecipeDetailsContext.Provider value={useRef(createRecipeDetailsStore(props.route.params.recipe)).current}>
            <RecipeDetails {...props} />
        </RecipeDetailsContext.Provider>
    );
}