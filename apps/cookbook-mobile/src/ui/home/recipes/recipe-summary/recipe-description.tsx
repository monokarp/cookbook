import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import { IconResetTimeoutMs } from "../../../contsants";

export interface RecipeDescriptionProps {
    description: string;
    onUpdate: (newDescription: string) => void;
}

enum Icons {
    Default = 'file-document-edit-outline',
    Saved = 'check'
}

export function RecipeDescription({ description, onUpdate }: RecipeDescriptionProps) {
    const { t } = useTranslation();

    let inputRef = null;

    const [value, setValue] = useState(description);

    const [icon, setIcon] = useState(Icons.Default);

    function onSave() {
        onUpdate(value);
        setIcon(Icons.Saved);

        setTimeout(() => setIcon(Icons.Default), IconResetTimeoutMs);
    }

    return (
        <View style={{ flexWrap: 'wrap', marginTop:20 }}>
            <View style={{ width: '100%', maxHeight:'50%' }}>
                <TextInput
                    ref={ref => inputRef = ref}
                    label={t('recipe.description')}
                    style={{ marginHorizontal: 5 }}
                    mode="outlined"
                    multiline={true}
                    value={value}
                    onChange={event => setValue(event.nativeEvent.text)}
                />
            </View>
            <IconButton style={{ alignSelf: 'flex-end' }}
                icon={icon}
                onTouchStart={() => inputRef.blur()}
                onTouchEnd={onSave}
            />
        </View>
    );
}