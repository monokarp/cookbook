import { TestIds } from '@cookbook/ui/test-ids.enum';
import { by, device, element } from 'detox';
import { assertListItems, collectionElement, untilNotVisible, untilVisible } from './util';


describe('Products view', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should login and land on recipes', async () => {
    await untilVisible(TestIds.Login.LoginButton);

    await element(by.id(TestIds.Login.LoginButton)).tap();

    await untilVisible(TestIds.RecipesView.Container);
  });

  it('navigates to products page and displays products list', async () => {
    await element(by.id(TestIds.Navigation.Products)).tap();

    await untilVisible(TestIds.ProductsView.Container);

    await assertProductList(['Банан', 'Морковка', 'Яблоко']);
  });

  it(`opens product details when 'add new product' is clicked`, async () => {
    await element(by.id(TestIds.ProductsView.AddNewButton)).tap();

    await untilVisible(TestIds.ProductDetails.Container);

    await untilVisible(TestIds.ProductDetails.NameInput);
    await untilVisible(TestIds.ProductDetails.WeightInput);
    await untilVisible(TestIds.ProductDetails.PriceInput);
    await untilNotVisible(TestIds.ProductDetails.UnitsInput);
  });

  it('displays errors when submit is clicked with empty form', async () => {
    await element(by.id(TestIds.ProductDetails.Submit)).tap();

    await untilVisible(TestIds.ProductDetails.NameInputError);
    await untilVisible(TestIds.ProductDetails.WeightInputError);
    await untilVisible(TestIds.ProductDetails.PriceInputError);
  });

  it('should hide the error when product name is filled in', async () => {
    await element(by.id(TestIds.ProductDetails.NameInput)).replaceText('Новый');

    await untilNotVisible(TestIds.ProductDetails.NameInputError);
  });

  it('should hide the error when product weight is filled in', async () => {
    await element(by.id(TestIds.ProductDetails.WeightInput)).typeText('0.100');

    await untilNotVisible(TestIds.ProductDetails.WeightInputError);
  });

  it('should hide the error when product price is filled in', async () => {
    await element(by.id(TestIds.ProductDetails.PriceInput)).typeText('50');

    await untilNotVisible(TestIds.ProductDetails.PriceInputError);
  });

  it('goes back to products view after saving the product', async () => {
    await element(by.id(TestIds.ProductDetails.Submit)).tap();

    await untilVisible(TestIds.ProductsView.Container);

    await assertProductList(['Банан', 'Морковка', 'Новый', 'Яблоко']);
  });

  it('filters the list by input value inclusion', async () => {
    await element(by.id(TestIds.ProductsView.SearchInput)).replaceText('н');

    await assertProductList(['Банан', 'Новый']);

    await element(by.id(TestIds.ProductsView.SearchInput)).clearText();

    await assertProductList(['Банан', 'Морковка', 'Новый', 'Яблоко']);
  });

  it('fails to delete a referenced product', async () => {
    await collectionElement(TestIds.ProductsView.ListItem).at(0).longPress();

    await untilVisible(TestIds.ConfirmDeleteModal.Container);

    await element(by.id(TestIds.ConfirmDeleteModal.Confirm)).tap();

    await assertProductList(['Банан', 'Морковка', 'Новый', 'Яблоко']);

    await waitFor(element(by.id(TestIds.ProductsView.ToastMessage))).toHaveText('Существуют рецепты ссылающиеся на этот продукт');
    await untilNotVisible(TestIds.ProductsView.ToastMessage);
  });

  it('deletes the new product', async () => {
    await collectionElement(TestIds.ProductsView.ListItem).at(2).longPress();

    await untilVisible(TestIds.ConfirmDeleteModal.Container);

    await element(by.id(TestIds.ConfirmDeleteModal.Confirm)).tap();

    await assertProductList(['Банан', 'Морковка', 'Яблоко']);
  });
});

function assertProductList(names: string[]) { return assertListItems(TestIds.ProductsView.ListItem, names); }