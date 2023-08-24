import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { List, TextInput } from "react-native-paper";

export interface PrepackDescriptionProps {
    value: string,
    onChange: (value: string) => void,
}

export function PrepackDescription({ value, onChange }: PrepackDescriptionProps) {
    const { t } = useTranslation();

    return (
        <View>
            <List.Accordion title={t(`prepack.details.${value ? 'descriptionView' : 'descriptionAdd'}`)}>
                <TextInput style={{ margin: 10, backgroundColor: 'white' }} mode="outlined" value={value} multiline={true} onChangeText={onChange} />
            </List.Accordion>
        </View>
    );
}