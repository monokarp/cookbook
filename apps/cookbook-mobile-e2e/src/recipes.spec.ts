import { TestIds } from '@cookbook/ui/test-ids';
import { by, device, element } from 'detox';
import { assertListItems, collectionElement, untilNotVisible, untilVisible } from './util';

describe('Recipes view', () => {
    beforeAll(async () => {
        await device.reloadReactNative();
    });

    it('should login and land on recipes', async () => {
        await untilVisible(TestIds.Login.LoginButton);

        await element(by.id(TestIds.Login.LoginButton)).tap();

        await untilVisible(TestIds.RecipesView.Container);

        await assertRecipesList(['Банан c морковкой', 'Морковка с П/Ф', 'Яблоко c бананом']);
    });

    it('filters recipes bases by name', async () => {
        await element(by.id(TestIds.RecipesView.SearchInput)).replaceText('п');
        await assertRecipesList(['Морковка с П/Ф']);

        await element(by.id(TestIds.RecipesView.SearchInput)).clearText();
        await assertRecipesList(['Банан c морковкой', 'Морковка с П/Ф', 'Яблоко c бананом']);
    });

    it(`opens recipe details when 'add new recipe' is clicked`, async () => {
        await element(by.id(TestIds.RecipesView.AddNewButton)).tap();

        await untilVisible(TestIds.RecipeDetails.NameInput);
    });

    it('saves empty recipe', async () => {
        await element(by.id(TestIds.RecipeDetails.Submit)).tap();
        await untilVisible(TestIds.RecipeDetails.NameInputError);

        await element(by.id(TestIds.RecipeDetails.NameInput)).replaceText('Новый рецепт');
        await element(by.id(TestIds.RecipeDetails.Submit)).tap();

        await untilVisible(TestIds.RecipesView.Container);

        await assertRecipesList(['Банан c морковкой', 'Морковка с П/Ф', 'Новый рецепт', 'Яблоко c бананом']);
    });

    it('opens saved recipe', async () => {
        await collectionElement(TestIds.RecipesView.ListItem).at(2).tap();

        await untilVisible(TestIds.RecipeDetails.NameInput);
    });

    it('adds empty ingredient to recipe', async () => {
        await element(by.id(TestIds.RecipeDetails.AddIngredient)).tap();

        await untilVisible(TestIds.IngredientSelect.Ingredient.Button, 0);
    });

    it('opens ingredient base selection modal', async () => {
        await collectionElement(TestIds.IngredientSelect.Ingredient.Button).at(0).tap();

        await untilVisible(TestIds.IngredientSelect.Ingredient.Modal.NameSearchInput);
        await assertIngredientProducts(['Банан', 'Банан с морковкой', 'Морковка', 'Яблоко', 'Яблоко с бананом']);
    });

    it('adds a prepack ingredient base to the recipe', async () => {
        await collectionElement(TestIds.IngredientSelect.Ingredient.Modal.ListItem).at(4).tap();

        await collectionElement(TestIds.IngredientSelect.Edit).at(0).tap();
        await untilVisible(TestIds.IngredientSelect.Ingredient.UnitsError, 0);

        await collectionElement(TestIds.IngredientSelect.UnitsInput).at(0).typeText('0.100\n');
        await untilNotVisible(TestIds.IngredientSelect.Ingredient.UnitsError, 0);

        await collectionElement(TestIds.IngredientSelect.Edit).at(0).tap();

        await untilVisible(TestIds.RecipeDetails.Submit);
    });

    it('adds another empty ingredient to recipe', async () => {
        await element(by.id(TestIds.RecipeDetails.AddIngredient)).tap();

        await collectionElement(TestIds.IngredientSelect.Ingredient.Button).at(1);
    });

    it('opens ingredient base selection modal', async () => {
        await collectionElement(TestIds.IngredientSelect.Ingredient.Button).at(1).tap();

        await untilVisible(TestIds.IngredientSelect.Ingredient.Modal.NameSearchInput);
        await assertIngredientProducts(['Банан', 'Банан с морковкой', 'Морковка', 'Яблоко', 'Яблоко с бананом']);
    });

    it('adds a product ingredient base to the recipe', async () => {
        await collectionElement(TestIds.IngredientSelect.Ingredient.Modal.ListItem).at(2).tap();

        await collectionElement(TestIds.IngredientSelect.Edit).at(1).tap();
        await untilVisible(TestIds.IngredientSelect.Ingredient.UnitsError, 1);
    });

    it('displays units toggle for a priced-per-unit product', async () => {
        await untilVisible(TestIds.IngredientSelect.UnitsToggle, 1);

        await collectionElement(TestIds.IngredientSelect.UnitsInput).at(1).typeText('0.100\n');
        await untilNotVisible(TestIds.IngredientSelect.Ingredient.UnitsError, 1);
    });

    it('updates validation rules when units toggle is changed', async () => {
        await collectionElement(TestIds.IngredientSelect.UnitsToggle).at(1).tap();

        await collectionElement(TestIds.IngredientSelect.Edit).at(1).tap();
        await untilVisible(TestIds.IngredientSelect.Ingredient.UnitsError, 1);

        await collectionElement(TestIds.IngredientSelect.UnitsInput).at(1).replaceText('3');
        await untilNotVisible(TestIds.IngredientSelect.Ingredient.UnitsError, 1);

        await collectionElement(TestIds.IngredientSelect.Edit).at(1).tap();
    });

    it('should save updated prepack', async () => {
        await element(by.id(TestIds.RecipeDetails.Submit)).tap();

        await untilVisible(TestIds.RecipesView.Container);

        await assertRecipesList(['Банан c морковкой', 'Морковка с П/Ф', 'Новый рецепт', 'Яблоко c бананом']);
    });
});

function assertRecipesList(names: string[]) { return assertListItems(TestIds.RecipesView.ListItem, names) }
function assertIngredientProducts(names: string[]) { return assertListItems(TestIds.IngredientSelect.Ingredient.Modal.ListItem, names); }
