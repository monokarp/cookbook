import { device, element, by, expect } from 'detox';

describe('Products view', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should display login page', async () => {
    await waitFor(element(by.id('login-view'))).toBeVisible().withTimeout(3000);

    await expect(element(by.id('login-button'))).toBeVisible();
  });

  it('should login and land on recipes', async () => {
    await element(by.id('login-button')).tap();

    await waitFor(element(by.id('recipes-view'))).toBeVisible().withTimeout(5000);
  });
});
