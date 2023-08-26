import { Product } from "@cookbook/domain/types/product/product";
import { Prepack } from "@cookbook/domain/types/recipe/prepack";
import { createContext, useContext } from "react";
import { ConfirmationModalResultHandler } from "./confirmation/confirmation.store";

export interface AppModals {
    ingredientSelect: (showPrepacks: boolean, onSelect: (item: Product | Prepack) => void) => void,
    toast: (message: string, timeout?: number) => void,
    confirmation: (message: string, onClose: ConfirmationModalResultHandler) => void,
}

export const ModalsContext = createContext({} as AppModals);

export const useAppModals = () => useContext(ModalsContext);