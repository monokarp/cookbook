import { Prepack } from "@cookbook/domain/types/prepack/prepack";
import { FormatNumber } from "@cookbook/domain/util";
import { TestIds } from "@cookbook/ui/test-ids";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Appbar, Divider } from "react-native-paper";
import { IngredientRatio } from "../../../common/summary/ingredient-ratio/ingredient-ratio";
import { TotalsRowLabel } from "../../../common/summary/label-components";
import { PositionSummary } from "../../../common/summary/position-summary/position-summary";
import { RootViews } from "../../../root-views.enum";
import { styles } from "./prepack-summary.style";

export function PrepackSummary({ navigation, route }) {
    const { t } = useTranslation();

    const prepack: Prepack = route.params.prepack;

    const [ratio, setRatio] = useState(1);

    return (
        <View style={{ height: '100%' }}>
            <Appbar.Header>
                <Appbar.BackAction testID={TestIds.PrepackSummary.Back} onPress={() => navigation.navigate(RootViews.Home)} />
                <Appbar.Content title={prepack.name} />
                <Appbar.Action testID={TestIds.PrepackSummary.ToDetails} icon="file-edit-outline"
                    onPress={() => {
                        navigation.navigate(RootViews.PrepackDetails, { prepack });
                    }}
                />
            </Appbar.Header>

            <ScrollView>
                <IngredientRatio value={ratio} onChange={setRatio} />

                <View style={styles.bodyCol}>
                    <View style={styles.recipePriceRow}>
                        <TotalsRowLabel>{t('recipe.totals')}</TotalsRowLabel>
                        <TotalsRowLabel>{FormatNumber.Weight(prepack.finalWeight * ratio)} {t('product.measuring.grams')}</TotalsRowLabel>
                        <TotalsRowLabel>{FormatNumber.Money(prepack.price() * ratio)}</TotalsRowLabel>
                    </View>
                    <Divider />
                    {
                        prepack.ingredients.map((one, recipePositionIndex) =>
                            <PositionSummary key={recipePositionIndex} position={one} ratio={ratio} recipePositionKey={recipePositionIndex.toString()} />
                        )
                    }
                </View>
            </ScrollView>
        </View>
    );
}
