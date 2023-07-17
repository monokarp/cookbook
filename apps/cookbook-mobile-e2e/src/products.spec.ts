import { device, element, by, expect } from 'detox';
import { TestIds } from '@cookbook/ui/test-ids.enum';
import { assertDisplayedSummaryListItems, waitUntilNotVisible, waitUntilVisible } from './util';

describe('Products view', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should display login page', async () => {
    await waitUntilVisible(TestIds.LoginView);

    await expect(element(by.id(TestIds.LoginButton))).toBeVisible();
  });

  it('should login and land on recipes', async () => {
    await element(by.id(TestIds.LoginButton)).tap();

    await waitUntilVisible(TestIds.RecipesView);
  });

  it('navigates to products page and displays products list', async () => {
    await element(by.id(TestIds.Navigation.Products)).tap();

    await waitUntilVisible(TestIds.ProductsView.Container);

    await assertDisplayedSummaryListItems(['Банан', 'Морковка', 'Яблоко']);
  });

  it(`opens product details when 'add new product' is clicked`, async () => {
    await element(by.id(TestIds.ProductsView.AddNewButton)).tap();

    await waitUntilVisible(TestIds.ProductDetails.Container);

    await waitUntilVisible(TestIds.ProductDetails.NameInput);
    await waitUntilVisible(TestIds.ProductDetails.WeightInput);
    await waitUntilVisible(TestIds.ProductDetails.PriceInput);
    await waitUntilNotVisible(TestIds.ProductDetails.UnitsInput);
  });

  it('displays errors when submit is clicked with empty form', async () => {
    await element(by.id(TestIds.ProductDetails.Submit)).tap();

    await waitUntilVisible(TestIds.ProductDetails.NameInputError);
    await waitUntilVisible(TestIds.ProductDetails.WeightInputError);
    await waitUntilVisible(TestIds.ProductDetails.PriceInputError);
  });

  it('should hide the error when product name is filled in', async () => {
    await element(by.id(TestIds.ProductDetails.NameInput)).replaceText('Новый');

    await waitUntilNotVisible(TestIds.ProductDetails.NameInputError);
  });

  it('should hide the error when product weight is filled in', async () => {
    await element(by.id(TestIds.ProductDetails.WeightInput)).typeText('0.100');

    await waitUntilNotVisible(TestIds.ProductDetails.WeightInputError);
  });

  it('should hide the error when product price is filled in', async () => {
    await element(by.id(TestIds.ProductDetails.PriceInput)).typeText('50');

    await waitUntilNotVisible(TestIds.ProductDetails.PriceInputError);
  });

  it('goes back to products view after saving the product', async () => {
    await element(by.id(TestIds.ProductDetails.Submit)).tap();

    await waitUntilVisible(TestIds.ProductsView.Container);

    await assertDisplayedSummaryListItems(['Банан', 'Морковка', 'Новый', 'Яблоко']);
  });
});
