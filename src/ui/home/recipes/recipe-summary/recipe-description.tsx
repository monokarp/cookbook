import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";

export interface RecipeDescriptionProps {
    description: string;
    onUpdate: (newDescription: string) => void;
}

export function RecipeDescription({ description, onUpdate }: RecipeDescriptionProps) {
    const { t } = useTranslation();

    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(description);

    function onConfirm() {
        onUpdate(draft);
        setIsEditing(false);
    }

    function onCancel() {
        setDraft(description);
        setIsEditing(false);
    }

    return (
        <View style={{ marginTop: 20, marginHorizontal: 5 }}>
            {isEditing ? (
                <>
                    <TextInput label={t("recipe.description")} mode="outlined" multiline value={draft} onChangeText={setDraft} />
                    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                        <IconButton icon="close" onPress={onCancel} />
                        <IconButton icon="check" onPress={onConfirm} />
                    </View>
                </>
            ) : (
                <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <Text style={{ flex: 1, paddingLeft: 10, paddingTop: 20 }}>{description}</Text>
                    <IconButton icon="file-document-edit-outline" onPress={() => setIsEditing(true)} />
                </View>
            )}
        </View>
    );
}
