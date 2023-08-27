import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'inversify-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import { appLightTheme } from './app.theme';
import { ModalOutlet } from './common/modals/modal-outlet';
import { HomeScreen } from './home/home-screen';
import { PrepackDetails } from './home/prepacks/prepack-details/prepack-details';
import { ProductDetails } from './home/products/product-details/product-details';
import { RecipeDetails } from './home/recipes/recipe-details/recipe-details';
import { RecipeSummary } from './home/recipes/recipe-summary/recipe-summary';
import { LoadingScreen } from './loading/loading-screen';
import { LoginScreen } from './login/login-screen';
import { RootViews } from './root-views.enum';
import { buildRootContainer } from './root.container';

const Stack = createNativeStackNavigator();
const { LightTheme } = adaptNavigationTheme({ reactNavigationLight: DefaultTheme, materialLight: appLightTheme });

const CombinedDefaultTheme = {
  ...appLightTheme,
  ...LightTheme,
  colors: {
    ...appLightTheme.colors,
    ...LightTheme.colors,
  },
};

const container = buildRootContainer();

const App = () => {
  const { t } = useTranslation();

  return (
    <PaperProvider theme={CombinedDefaultTheme}>
      <Provider container={container}>
        <NavigationContainer theme={CombinedDefaultTheme}>
          <Stack.Navigator>
            <Stack.Screen
              name={RootViews.Login}
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={RootViews.Loading}
              component={LoadingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={RootViews.Home}
              component={HomeScreen}
              options={{ headerTitle: t('common.cookbook'), headerBackVisible: false }}
            />
            <Stack.Screen
              name={RootViews.RecipeSummary}
              component={RecipeSummary}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={RootViews.RecipeDetails}
              component={RecipeDetails}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={RootViews.ProductDetails}
              component={ProductDetails}
              options={{ headerTitle: t('product.details.title') }}
            />
            <Stack.Screen
              name={RootViews.PrepackDetails}
              component={PrepackDetails}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <ModalOutlet />
      </Provider>
    </PaperProvider>
  );
};

export default App;
