import { RegexPatterns } from "@cookbook/domain/constants";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";

export interface GroupNameInputProps {
    groupName: string,
    onConfirm: (updatedName: string) => void,
    onCancel: () => void,
}

export function GroupNameInput({ groupName, onConfirm, onCancel }: GroupNameInputProps) {
    const { t } = useTranslation();

    const [value, setValue] = useState(groupName);

    return (
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
            <TextInput style={{ flexGrow: 1 }} placeholder={t('recipe.groups.new')} value={value} onChangeText={setValue} />
            <IconButton
                icon="cancel"
                size={22}
                onTouchStart={() => onCancel()}
            />
            <IconButton
                icon="check"
                size={22}
                onTouchStart={() => {
                    if (RegexPatterns.EntityName.test(value)) {
                        onConfirm(value)
                    }
                }}
            />
        </View>
    );
}