import { TestIds } from '@cookbook/ui/test-ids';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTranslation } from 'react-i18next';
import { HomeTabs } from './home-tabs.enum';
import { PrepacksView } from './prepacks/prepacks-view';
import { ProductsView } from './products/products-view';
import { RecipesView } from './recipes/recipes-view';


const Tab = createMaterialTopTabNavigator();

export function HomeScreen() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator>
      <Tab.Screen name={HomeTabs.Recipes} component={RecipesView} options={{ tabBarTestID: TestIds.Navigation.Recipes, title: t('views.recipes') }} />
      <Tab.Screen name={HomeTabs.Prepacks} component={PrepacksView} options={{ tabBarTestID: TestIds.Navigation.Prepacks, title: t('views.prepacks') }} />
      <Tab.Screen name={HomeTabs.Products} component={ProductsView} options={{ tabBarTestID: TestIds.Navigation.Products, title: t('views.products') }} />
    </Tab.Navigator>
  );
}

