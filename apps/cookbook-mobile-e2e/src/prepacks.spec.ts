import { TestIds } from '@cookbook/ui/test-ids';
import { by, device, element } from 'detox';
import { assertListItems, collectionElement, untilNotVisible, untilVisible } from './util';

describe('Prepacks view', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should login and land on recipes', async () => {
    await untilVisible(TestIds.Login.LoginButton);

    await element(by.id(TestIds.Login.LoginButton)).tap();

    await untilVisible(TestIds.RecipesView.Container);
  });

  it('navigates to prepacks page and displays prepacks list', async () => {
    await element(by.id(TestIds.Navigation.Prepacks)).tap();

    await untilVisible(TestIds.PrepacksView.Container);

    await assertPrepacksList(['Банан c морковкой', 'Яблоко с бананом']);
  });

  it(`opens prepack details when 'add new prepack' is clicked`, async () => {
    await element(by.id(TestIds.PrepacksView.AddNewButton)).tap();

    await untilVisible(TestIds.PrepackDetails.NameInput);
    await untilVisible(TestIds.PrepackDetails.WeightInput);
  });

  it('saves prepack with 0 weight if there are no ingredients', async () => {
    await element(by.id(TestIds.PrepackDetails.Submit)).tap();
    await untilVisible(TestIds.PrepackDetails.NameInputError);

    await element(by.id(TestIds.PrepackDetails.NameInput)).replaceText('Новый');
    await element(by.id(TestIds.PrepackDetails.Submit)).tap();

    await untilVisible(TestIds.PrepacksView.Container);

    await assertPrepacksList(['Банан с морковкой', 'Новый', 'Яблоко с бананом']);
  });

  it('opens saved prepack', async () => {
    await collectionElement(TestIds.PrepacksView.ListItem).at(1).tap();

    await untilVisible(TestIds.PrepackDetails.NameInput);
    await untilVisible(TestIds.PrepackDetails.WeightInput);
  });

  it('adds empty ingredient to prepack', async () => {
    await element(by.id(TestIds.PrepackDetails.AddIngredient)).tap();

    await untilVisible(TestIds.IngredientSelect.Ingredient.Button, 0);
  });

  it('opens ingredient base selection modal', async () => {
    await collectionElement(TestIds.IngredientSelect.Ingredient.Button).at(0).tap();

    await untilVisible(TestIds.IngredientSelect.Ingredient.Modal.NameSearchInput);
    await assertIngredientProducts(['Банан', 'Морковка', 'Яблоко']);
  });

  it('filters ingredient bases by name', async () => {
    await element(by.id(TestIds.IngredientSelect.Ingredient.Modal.NameSearchInput)).replaceText('я');
    await assertIngredientProducts(['Яблоко']);

    await element(by.id(TestIds.IngredientSelect.Ingredient.Modal.NameSearchInput)).clearText();
    await assertIngredientProducts(['Банан', 'Морковка', 'Яблоко']);
  });

  it('adds first ingredient base to prepack', async () => {
    await collectionElement(TestIds.IngredientSelect.Ingredient.Modal.ListItem).at(0).tap();
    await untilVisible(TestIds.IngredientSelect.Ingredient.UnitsError, 0);

    await collectionElement(TestIds.IngredientSelect.UnitsInput).at(0).typeText('0.100\n');
    await untilNotVisible(TestIds.IngredientSelect.Ingredient.UnitsError, 0);

    await untilVisible(TestIds.PrepackDetails.Submit);
  });

  it('should not save zero weight prepack if there are ingredients', async () => {
    await element(by.id(TestIds.PrepackDetails.Submit)).tap();
    await untilVisible(TestIds.PrepackDetails.WeightInputError);

    await element(by.id(TestIds.PrepackDetails.WeightInput)).typeText('0.200\n');
    await untilNotVisible(TestIds.PrepackDetails.WeightInputError);

    await untilVisible(TestIds.PrepackDetails.Submit);
  });

  it('should save updated prepack', async () => {
    await element(by.id(TestIds.PrepackDetails.Submit)).tap();

    await untilVisible(TestIds.PrepacksView.Container);

    await assertPrepacksList(['Банан с морковкой', 'Новый', 'Яблоко с бананом']);
  });

  it('filters prepacks by name', async () => {
    await element(by.id(TestIds.PrepacksView.SearchInput)).replaceText('нов');
    await assertPrepacksList(['Новый']);

    await element(by.id(TestIds.PrepacksView.SearchInput)).clearText();
    await assertPrepacksList(['Банан с морковкой', 'Новый', 'Яблоко с бананом']);
  });

  it('fails to delete a referenced prepack and displays a toast', async () => {
    await collectionElement(TestIds.PrepacksView.ListItem).at(2).longPress();

    await untilVisible(TestIds.ConfirmDeleteModal.Container);
    await element(by.id(TestIds.ConfirmDeleteModal.Confirm)).tap();
    await untilNotVisible(TestIds.ConfirmDeleteModal.Container);

    await assertPrepacksList(['Банан с морковкой', 'Новый', 'Яблоко с бананом']);

    await waitFor(element(by.id(TestIds.ProductsView.ToastMessage))).toHaveText('Существуют рецепты ссылающиеся на этот п/ф.');
    await untilNotVisible(TestIds.ProductsView.ToastMessage);
  });

  it('deletes the new prepack', async () => {
    await collectionElement(TestIds.PrepacksView.ListItem).at(1).longPress();

    await untilVisible(TestIds.ConfirmDeleteModal.Container);
    await element(by.id(TestIds.ConfirmDeleteModal.Confirm)).tap();
    await untilNotVisible(TestIds.ConfirmDeleteModal.Container);

    await assertPrepacksList(['Банан с морковкой', 'Яблоко с бананом']);
  });
});

function assertPrepacksList(names: string[]) { return assertListItems(TestIds.PrepacksView.ListItem, names); }
function assertIngredientProducts(names: string[]) { return assertListItems(TestIds.IngredientSelect.Ingredient.Modal.ListItem, names); }