import { useState } from "react";
import { View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";

export interface GroupNameInputProps {
    groupName: string,
    onConfirm: (updatedName: string) => void,
    onCancel: () => void,
}

export function GroupNameInput({ groupName, onConfirm, onCancel }: GroupNameInputProps) {

    const [value, setValue] = useState(groupName);

    return (
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
            <TextInput style={{ flexGrow: 1 }} value={value} onChangeText={setValue} />
            <IconButton
                icon="cancel"
                size={22}
                onPress={() => onCancel()}
            />
            <IconButton
                icon="check"
                size={22}
                onPress={() => onConfirm(value)}
            />
        </View>
    );
}