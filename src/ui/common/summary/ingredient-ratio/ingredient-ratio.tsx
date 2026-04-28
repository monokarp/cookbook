import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import { useAppModals } from "../../modals/use-modals.hook";
import { styles } from "./ingredient-ratio.style";
import { useTranslation } from "react-i18next";

interface RatioProps {
    value: number;
    onChange: (value: number) => void;
}

export function IngredientRatio({ value, onChange }: RatioProps) {
    const { t } = useTranslation();
    const { ratioPicker } = useAppModals();

    return (
        <View style={styles.boxContainer}>
            <Text style={styles.label} variant="headlineSmall">
                {t("recipe.details.ratio")}: 
            </Text>
            <Button mode="elevated" onPress={() => ratioPicker.show(value, onChange)}>
                {value.toFixed(1)}
            </Button>
        </View>
    );
}
