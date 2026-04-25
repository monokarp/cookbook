import { createContext, useContext } from "react";
import { Database } from "../core/database/database";
import { SeedData } from "../core/database/seed-data";
import { DataSync } from "../core/datasync/datasync.service";
import { Prepacks } from "../core/models/prepacks";
import { Products } from "../core/models/products";
import { Recipes } from "../core/models/recipes";
import { ConfirmationModal } from "./common/modals/confirmation/confirmation.modal";
import { IngredientPickerModal } from "./common/modals/ingredient-picker/ingredient-picker.modal";
import { ModalService } from "./common/modals/modal.service";
import { ToastModal } from "./common/modals/toast/toast.modal";

export interface AppServices {
    db: Database;
    seedData: SeedData;
    dataSync: DataSync;
    products: Products;
    prepacks: Prepacks;
    recipes: Recipes;
    modalService: ModalService;
    confirmation: ConfirmationModal;
    toast: ToastModal;
    ingredientPicker: IngredientPickerModal;
}

const ServicesContext = createContext<AppServices | null>(null);

export const ServicesProvider = ServicesContext.Provider;

export function useServices(): AppServices {
    const ctx = useContext(ServicesContext);

    if (!ctx) throw new Error("useServices called outside ServicesProvider");

    return ctx;
}
