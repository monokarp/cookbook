import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    bodyCol: {
        flexDirection: 'column',
        width: '100%'
    },
    recipePriceRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    positionRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    ratioBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 10
    },
    ratioLabel: {
        marginHorizontal: 10,
        width: '15%'
    },
    positionLabelMargin: {
        margin: 5
    }
});
