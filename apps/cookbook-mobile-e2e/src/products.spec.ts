import { device, element, by, expect } from 'detox';
import { TestIds } from '@cookbook/ui/test-ids.enum';

describe('Products view', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should display login page', async () => {
    await waitFor(element(by.id(TestIds.LoginView))).toBeVisible().withTimeout(3000);

    await expect(element(by.id(TestIds.LoginButton))).toBeVisible();
  });

  it('should login and land on recipes', async () => {
    await element(by.id(TestIds.LoginButton)).tap();

    await waitFor(element(by.id(TestIds.RecipesView))).toBeVisible().withTimeout(5000);
  });
});
