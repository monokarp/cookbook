import { TestIds } from '@cookbook/ui/test-ids.enum';
import { by, device, element } from 'detox';
import { assertListItems, untilVisible } from './util';

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
});

function assertRecipesList(names: string[]) { return assertListItems(TestIds.RecipesView.ListItem, names) }
