import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    pickerWrapper: {
        width: '55%',
        padding: 5,
        paddingRight: 0,
    },
    servingUnitsWrapper: {
        width: '25%',
        padding: 15,
        paddingLeft: 5,
        paddingRight: 0,
        paddingTop: 10,
    },
    servingMeasureWrapper: {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    servingSizeInput: {
        width: '100%',
        backgroundColor: 'white',
        margin: 5,
        marginLeft: 1,
    },
    validationErrorLabel: {
        color: 'red'
    },
    inputLabel: {
        fontWeight: '600',
        marginLeft: 5
    }
});
