import { useInjection } from "inversify-react-native";
import { ConfirmationModal } from "./confirmation/confirmation.modal";
import { IngredientPickerModal } from "./ingredient-picker/ingredient-picker.modal";
import { ToastModal } from "./toast/toast.modal";

export function useAppModals() {
    return {
        confirmation: useInjection(ConfirmationModal),
        toast: useInjection(ToastModal),
        ingredientPicker: useInjection(IngredientPickerModal),
    };
}