import { TestIds } from "@cookbook/ui/test-ids";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./navigation.types";
import React from "react";
import { useTranslation } from "react-i18next";
import { Appbar, PaperProvider, adaptNavigationTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { appLightTheme } from "./app.theme";
import { ModalOutlet } from "./common/modals/modal-outlet";
import { HomeScreen } from "./home/home-screen";
import { PrepackDetails } from "./home/prepacks/prepack-details/prepack-details";
import { PrepackSummary } from "./home/prepacks/prepack-summary/prepack-summary";
import { ProductDetails } from "./home/products/product-details/product-details";
import { RecipeDetails } from "./home/recipes/recipe-details/recipe-details";
import { RecipeSummary } from "./home/recipes/recipe-summary/recipe-summary";
import { LoadingScreen } from "./loading/loading-screen";
import { LoginScreen } from "./login/login-screen";
import { useSession } from "./login/session.store";
import { RootViews } from "./root-views.enum";
import { buildServices } from "./root.container";
import { ServicesProvider } from "./services-context";

const Stack = createNativeStackNavigator<RootStackParamList>();

const { LightTheme } = adaptNavigationTheme({ reactNavigationLight: DefaultTheme, materialLight: appLightTheme });

// adaptNavigationTheme carries DefaultTheme.fonts at runtime but its return type omits them
// (paper's NavigationTheme predates react-navigation v7 adding fonts to Theme).
// Spreading DefaultTheme first makes the fonts explicit so NavigationContainer types are satisfied.
const navTheme = { ...DefaultTheme, ...LightTheme };

const services = buildServices();

const App = () => {
    const { t } = useTranslation();

    useSession();

    return (
        <SafeAreaProvider>
            <PaperProvider theme={appLightTheme}>
                <ServicesProvider value={services}>
                    <NavigationContainer theme={navTheme}>
                        <Stack.Navigator>
                            <Stack.Screen name={RootViews.Login} component={LoginScreen} options={{ headerShown: false }} />
                            <Stack.Screen name={RootViews.Loading} component={LoadingScreen} options={{ headerShown: false }} />
                            <Stack.Screen
                                name={RootViews.Home}
                                component={HomeScreen}
                                options={{
                                    header: ({ navigation }) => (
                                        <Appbar.Header>
                                            <Appbar.Content title={t("common.cookbook")} />
                                            <Appbar.Action
                                                icon="logout"
                                                onPress={() => {
                                                    navigation.reset({
                                                        index: 0,
                                                        routes: [{ name: RootViews.Login, params: { doSignOut: true } }],
                                                    });
                                                }}
                                                testID={TestIds.PrepackDetails.Submit}
                                            />
                                        </Appbar.Header>
                                    ),
                                    headerBackVisible: false,
                                }}
                            />
                            <Stack.Screen name={RootViews.RecipeSummary} component={RecipeSummary} options={{ headerShown: false }} />
                            <Stack.Screen name={RootViews.RecipeDetails} component={RecipeDetails} options={{ headerShown: false }} />
                            <Stack.Screen
                                name={RootViews.ProductDetails}
                                component={ProductDetails}
                                options={{ headerTitle: t("product.details.title") }}
                            />
                            <Stack.Screen name={RootViews.PrepackSummary} component={PrepackSummary} options={{ headerShown: false }} />
                            <Stack.Screen name={RootViews.PrepackDetails} component={PrepackDetails} options={{ headerShown: false }} />
                        </Stack.Navigator>
                    </NavigationContainer>
                    <ModalOutlet />
                </ServicesProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
};

export default App;
