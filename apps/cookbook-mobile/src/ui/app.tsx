import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'inversify-react-native';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import { theme } from './app.theme';
import { Modals } from './common/modals/modals';
import { AppModals, ModalsContext } from './common/modals/modals.context';
import { HomeScreen } from './home/home-screen';
import { PrepackDetailsWithContext } from './home/prepacks/prepack-details/prepack-details-with-context';
import { ProductDetails } from './home/products/product-details/product-details';
import { RecipeDetails } from './home/recipes/recipe-details/recipe-details';
import { LoadingScreen } from './loading/loading-screen';
import { LoginScreen } from './login/login-screen';
import { RootViews } from './root-views.enum';
import { buildRootContainer } from './root.container';

const Stack = createNativeStackNavigator();
const { LightTheme } = adaptNavigationTheme({ reactNavigationLight: DefaultTheme });

const container = buildRootContainer();

const App = () => {
  const { t } = useTranslation();

  const modalRef = useRef(null);

  const modalCtx: AppModals = {
    ingredientSelect: null,
    toast: null,
    confirmation: null,
  };

  useEffect(() => {
    Object.assign(modalCtx, modalRef.current);
  }, []);

  return (
    <PaperProvider theme={theme}>
      <Provider container={container}>
        <ModalsContext.Provider value={modalCtx}>
          <NavigationContainer theme={LightTheme}>
            <Stack.Navigator>
              <Stack.Screen name={RootViews.Login} component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name={RootViews.Loading} component={LoadingScreen} options={{ headerShown: false }} />
              <Stack.Screen name={RootViews.Home} component={HomeScreen} options={{ headerTitle: t('common.cookbook'), headerBackVisible: false }} />
              <Stack.Screen name={RootViews.RecipeDetails} component={RecipeDetails} options={{ headerTitle: t('recipe.details.title') }} />
              <Stack.Screen name={RootViews.ProductDetails} component={ProductDetails} options={{ headerTitle: t('product.details.title') }} />
              <Stack.Screen name={RootViews.PrepackDetails} component={PrepackDetailsWithContext} options={{ headerTitle: t('prepack.details.title') }} />
            </Stack.Navigator>
          </NavigationContainer>
        </ModalsContext.Provider>
        <Modals ref={modalRef} />
      </Provider>
    </PaperProvider>
  );
};

export default App;
