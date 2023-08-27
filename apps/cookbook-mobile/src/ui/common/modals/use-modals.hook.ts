import { useInjection } from "inversify-react-native";
import { ConfirmationModal } from "./confirmation/confirmation.modal";
import { ToastModal } from "./toast/toast.modal";
import { IngredientPickerModal } from "./ingredient-picker/ingredient-picker.modal";

export function useAppModals() {
    return {
        confirmation: useInjection(ConfirmationModal),
        toast: useInjection(ToastModal),
        ingredientPicker: useInjection(IngredientPickerModal),
    };
}