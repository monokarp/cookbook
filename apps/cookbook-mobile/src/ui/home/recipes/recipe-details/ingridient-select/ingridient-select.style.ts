import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
    },
    pickerWrapper: {
        width: '70%',
    },
    servingSizeInput: {
        backgroundColor: 'white',
        width: '30%',
    },
    validationErrorLabel: {
        color: 'red'
    },
    inputLabel: {
        fontWeight: '600',
        marginLeft: 5
    }
});
