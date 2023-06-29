import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ProductsView } from './products/products-view';
import { RecipesView } from './recipes/recipes-view';
import { HomeTabs } from './home-tabs.enum';
import { useInjection } from 'inversify-react-native';
import { useEffect } from 'react';
import { ProductsRepository } from '../../app/repositories/products.repository';
import { useProductsStore } from './products/products.store';
import { useTranslation } from 'react-i18next';


const Tab = createMaterialTopTabNavigator();

export function HomeScreen() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator>
      <Tab.Screen name={HomeTabs.Recipes} component={RecipesView} options={{ title: t('views.recipes') }} />
      <Tab.Screen name={HomeTabs.Products} component={ProductsView} options={{ title: t('views.products') }} />
    </Tab.Navigator>
  );
}

