import { Prepack } from "@cookbook/domain/types/prepack/prepack";
import { Product } from "@cookbook/domain/types/product/product";
import { Recipe } from "@cookbook/domain/types/recipe/recipe";
import { FormMode } from "./common/form-mode.enum";
import { HomeTabs } from "./home/home-tabs.enum";
import { RootViews } from "./root-views.enum";

export type RootStackParamList = {
    [RootViews.Login]: { doSignOut?: boolean } | undefined;
    [RootViews.Loading]: undefined;
    [RootViews.Home]: { screen?: HomeTabs } | undefined;
    [RootViews.ProductDetails]: { product: Product; mode: FormMode };
    [RootViews.RecipeSummary]: { recipe: Recipe };
    [RootViews.RecipeDetails]: { recipe: Recipe };
    [RootViews.PrepackSummary]: { prepack: Prepack };
    [RootViews.PrepackDetails]: { prepack: Prepack };
};
