import { PositionGroup } from "@cookbook/domain/types/recipe/recipe";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { GroupNameInput } from "./group-name-input/group-name-input";
import { styles } from "./group-wrapper.style";
import { useAppModals } from "../../../../common/modals/use-modals.hook";

export type GroupWrapperProps = PropsWithChildren<{
    recipeGroups: PositionGroup[],
    rowIndex: number,
    groupEditing?: {
        isActive: boolean,
        onRemove: (groupName: string) => void,
        onConfirm: (updatedName: string) => void,
        onCancel: () => void,
    }
}>;


export function GroupRowWrapper({ recipeGroups, children, rowIndex, groupEditing }: GroupWrapperProps) {
    const { t } = useTranslation();

    const { confirmation } = useAppModals();

    let rowStyle = styles.base;

    const matchingGroup = recipeGroups.find(one => one.positionIndices.includes(rowIndex));

    if (matchingGroup) {
        rowStyle = { ...rowStyle, ...styles.groupedItem };
    }

    const isFirstItemInGroup = matchingGroup && matchingGroup.positionIndices.indexOf(rowIndex) === 0;
    const isLastItemInGroup = matchingGroup && matchingGroup.positionIndices.indexOf(rowIndex) === matchingGroup.positionIndices.length - 1;

    if (isFirstItemInGroup) {
        rowStyle = { ...rowStyle, ...styles.firstItem };
    }

    if (isLastItemInGroup) {
        rowStyle = { ...rowStyle, ...styles.lastItem };
    }

    return (
        <View style={rowStyle}>
            {
                isFirstItemInGroup &&
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {
                        groupEditing

                            ? groupEditing.isActive
                                ? <GroupNameInput
                                    groupName={matchingGroup.name}
                                    onConfirm={groupEditing.onConfirm}
                                    onCancel={groupEditing.onCancel}
                                />

                                : <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ flexGrow: 1, paddingLeft: 5 }} variant="bodyLarge">
                                        {matchingGroup.name}
                                    </Text>
                                    <IconButton
                                        icon="trash-can"
                                        size={22}
                                        onPress={() => {
                                            confirmation.show({
                                                message: t('recipe.groups.remove'),
                                                onResult: (result) => {
                                                    if (result === 'confirm') {
                                                        groupEditing.onRemove(matchingGroup.name)
                                                    }
                                                }
                                            })
                                        }}
                                    />
                                </View>

                            : <Text style={{ flexGrow: 1, paddingLeft: 5 }} variant="bodyLarge">
                                {matchingGroup.name}
                            </Text>
                    }
                </View>
            }
            {children}
        </View>
    );
}