import { PositionGroup } from "@cookbook/domain/types/recipe/recipe";
import { PropsWithChildren } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { styles } from "./group-wrapper.style";

export type GroupWrapperProps = PropsWithChildren<{ recipeGroups: PositionGroup[], rowIndex: number }>;


export function GroupRowWrapper({ recipeGroups, children, rowIndex }: GroupWrapperProps) {

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
            {isFirstItemInGroup && <Text style={{ width: '100%', padding:2 }} variant="bodyMedium">{matchingGroup.name}</Text>}
            {children}
        </View>
    );
}