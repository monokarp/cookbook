import { TestIds } from '@cookbook/ui/test-ids.enum';
import { device, element, by, expect } from 'detox';
import { waitUntilVisible } from './util';

xdescribe('CookbookMobile', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should login and land on recipes', async () => {
    await waitUntilVisible(TestIds.Login.LoginButton);

    await element(by.id(TestIds.Login.LoginButton)).tap();

    await waitUntilVisible(TestIds.RecipesView);
  });
});
