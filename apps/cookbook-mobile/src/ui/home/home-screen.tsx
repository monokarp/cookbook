import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTranslation } from 'react-i18next';
import { HomeTabs } from './home-tabs.enum';
import { ProductsView } from './products/products-view';
import { RecipesView } from './recipes/recipes-view';
import { PrepacksView } from './prepacks/prepacks-view';


const Tab = createMaterialTopTabNavigator();

export function HomeScreen() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator>
      <Tab.Screen name={HomeTabs.Recipes} component={RecipesView} options={{ title: t('views.recipes') }} />
      <Tab.Screen name={HomeTabs.Prepacks} component={PrepacksView} options={{ title: t('views.prepacks') }} />
      <Tab.Screen name={HomeTabs.Products} component={ProductsView} options={{ title: t('views.products') }} />
    </Tab.Navigator>
  );
}

