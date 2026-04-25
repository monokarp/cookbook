import { useServices } from '../../services-context';

export function useAppModals() {
    const { confirmation, toast, ingredientPicker } = useServices();
    return { confirmation, toast, ingredientPicker };
}