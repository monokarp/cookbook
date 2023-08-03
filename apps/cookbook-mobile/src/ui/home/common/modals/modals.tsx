import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View } from "react-native";
import { Confirmation } from "./confirmation/confirmation";
import { ToastMessage } from "./toast/toast";
import { IngredientSelect } from "./ingredient-select/ingredient-select";

export const Modals = forwardRef(_Modals);


export function _Modals(_, ref) {

    const confirmationRef = useRef(null);
    const toastRef = useRef(null);
    const ingredientSelectRef = useRef(null);

    useImperativeHandle(ref, () => ({
        showConfirmationModal: confirmationRef.current.showConfirmationModal,
        showIngredientSelectModal: ingredientSelectRef.current.showIngredientSelectModal,
        showToastMessage: toastRef.current.showToastMessage,
    }), []);

    return (
        <View>
            <ToastMessage ref={toastRef} />
            <Confirmation ref={confirmationRef} />
            <IngredientSelect ref={ingredientSelectRef} />
        </View>
    );
}