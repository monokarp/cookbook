import { useServices } from "../../services-context";

export function useAppModals() {
    const { confirmation, toast, ingredientPicker, ratioPicker } = useServices();
    return { confirmation, toast, ingredientPicker, ratioPicker };
}
