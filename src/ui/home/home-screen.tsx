import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import { TestIds } from "@cookbook/ui/test-ids";
import { HomeTabs } from "./home-tabs.enum";
import { PrepacksView } from "./prepacks/prepacks-view";
import { ProductsView } from "./products/products-view";
import { RecipesView } from "./recipes/recipes-view";

const Tab = createMaterialTopTabNavigator();

export function HomeScreen() {
    const { t } = useTranslation();

    return (
        <Tab.Navigator>
            <Tab.Screen
                name={HomeTabs.Recipes}
                component={RecipesView}
                options={{ title: t("views.recipes"), tabBarButtonTestID: TestIds.Navigation.Recipes }}
            />
            <Tab.Screen
                name={HomeTabs.Prepacks}
                component={PrepacksView}
                options={{ title: t("views.prepacks"), tabBarButtonTestID: TestIds.Navigation.Prepacks }}
            />
            <Tab.Screen
                name={HomeTabs.Products}
                component={ProductsView}
                options={{ title: t("views.products"), tabBarButtonTestID: TestIds.Navigation.Products }}
            />
        </Tab.Navigator>
    );
}
