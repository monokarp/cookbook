import { TestIds } from '@cookbook/ui/test-ids';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'inversify-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Appbar, PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import { appLightTheme } from './app.theme';
import { ModalOutlet } from './common/modals/modal-outlet';
import { HomeScreen } from './home/home-screen';
import { PrepackDetails } from './home/prepacks/prepack-details/prepack-details';
import { PrepackSummary } from './home/prepacks/prepack-summary/prepack-summary';
import { ProductDetails } from './home/products/product-details/product-details';
import { RecipeDetails } from './home/recipes/recipe-details/recipe-details';
import { RecipeSummary } from './home/recipes/recipe-summary/recipe-summary';
import { LoadingScreen } from './loading/loading-screen';
import { LoginScreen } from './login/login-screen';
import { useSession } from './login/session.store';
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

  const { setUser } = useSession();

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
              options={{
                header: ({ navigation }) =>
                  <Appbar.Header>
                    <Appbar.Content title={t('common.cookbook')} />
                    <Appbar.Action icon="logout" onPress={async () => {
                      navigation.navigate(RootViews.Login, { doSignOut: true });
                    }} testID={TestIds.PrepackDetails.Submit} />
                  </Appbar.Header>,
                headerBackVisible: false
              }}
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
              name={RootViews.PrepackSummary}
              component={PrepackSummary}
              options={{ headerShown: false }}
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
