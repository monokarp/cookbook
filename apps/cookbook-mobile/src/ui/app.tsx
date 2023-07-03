import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'inversify-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PaperProvider } from 'react-native-paper';
import { HomeScreen } from './home/home-screen';
import { ProductDetails } from './home/products/product-details/product-details';
import { RecipeDetails } from './home/recipes/recipe-details/recipe-details';
import { LoadingScreen } from './loading/loading-screen';
import { LoginScreen } from './login/login-screen';
import { RootViews } from './root-views.enum';
import { buildRootContainer } from './root.container';

const Stack = createNativeStackNavigator();

const App = () => {
  const { t } = useTranslation();

  return (
    <PaperProvider>
      <Provider container={buildRootContainer()}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name={RootViews.Loading} component={LoadingScreen} options={{ headerShown: false }} />
            <Stack.Screen name={RootViews.Login} component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name={RootViews.Home} component={HomeScreen} options={{ headerTitle: t('common.cookbook'), headerBackVisible: false }} />
            <Stack.Screen name={RootViews.RecipeDetails} component={RecipeDetails} options={{ headerTitle: t('recipe.details.title') }} />
            <Stack.Screen name={RootViews.ProductDetails} component={ProductDetails} options={{ headerTitle: t('product.details.title') }} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </PaperProvider>
  );
};

export default App;
