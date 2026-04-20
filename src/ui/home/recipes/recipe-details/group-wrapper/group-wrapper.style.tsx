import { StyleSheet } from 'react-native';

const borderWidth = 2;
const margin = 3;

export const styles = StyleSheet.create({
    base: {
        flexDirection: 'column',
        alignItems: 'center',
        borderStyle: 'solid',
        borderColor: 'black',
    },
    groupedItem: {
        borderLeftWidth: borderWidth,
        borderRightWidth: borderWidth,
        marginHorizontal: margin,
    },
    firstItem: {
        borderTopWidth: borderWidth,
        marginTop: margin,
    },
    middleItem: {
    },
    lastItem: {
        borderBottomWidth: borderWidth,
        marginBottom: margin,
    }
});
