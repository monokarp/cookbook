import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'inversify-react-native';
import React from 'react';
import "reflect-metadata";
import { HomeScreen } from './home/home-screen';
import { ProductDetails } from './home/products/product-details/product-details';
import { buildRootContainer } from './root.container';
import { LoginScreen } from './login/login-screen';
import { RootViews } from './root-views.enum';
import { useTranslation } from 'react-i18next';
import { RecipeDetails } from './home/recipes/recipe-details/recipe-details';

const Stack = createNativeStackNavigator();

const App = () => {
  const {t} = useTranslation();
  
  return (
    <Provider container={buildRootContainer()}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={RootViews.Login} component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name={RootViews.Home} component={HomeScreen} options={{ headerTitle: t('common.cookbook'), headerBackVisible: false }} />
          <Stack.Screen name={RootViews.RecipeDetails} component={RecipeDetails} options={{ headerTitle: t('recipe.details.title') }} />
          <Stack.Screen name={RootViews.ProductDetails} component={ProductDetails} options={{ headerTitle: t('product.details.title') }} />
        </Stack.Navigator>
      </NavigationContainer>
      </Provider>
  );
};

export default App;