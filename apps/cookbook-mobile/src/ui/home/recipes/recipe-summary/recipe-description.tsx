import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";

export interface RecipeDescriptionProps {
    description: string;
    onUpdate: (newDescription: string) => void;
}

export function RecipeDescription({ description, onUpdate }: RecipeDescriptionProps) {
    const { t } = useTranslation();

    let inputRef = null;

    const [isEditing, setEditing] = useState(false);
    const [value, setValue] = useState(description);

    function toggleEditing() {
        if (isEditing) {
            onUpdate(value);
        }

        setEditing(!isEditing);
    }

    return (
        <View style={{ flexWrap: 'wrap' }}>
            <IconButton style={{ alignSelf: 'flex-end' }}
                icon={isEditing ? 'check' : 'file-document-edit-outline'}
                onTouchStart={() => { if (isEditing) inputRef.blur(); }}
                onTouchEnd={toggleEditing}
            />
            <View style={{ width: '100%' }}>
                <TextInput
                    ref={ref => inputRef = ref}
                    editable={isEditing}
                    label={t('recipe.description')}
                    style={{ marginHorizontal: 5 }}
                    mode="outlined"
                    multiline={true}
                    value={value}
                    onChange={event => setValue(event.nativeEvent.text)}
                />
            </View>
        </View>
    );
}