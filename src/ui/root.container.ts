import { PrepacksFirestore } from "../core/cloud-repositories/prepacks.cloud-repo";
import { ProductsFirestore } from "../core/cloud-repositories/products.cloud-repo";
import { RecipesFirestore } from "../core/cloud-repositories/recipes.cloud-repo";
import { Database } from "../core/database/database";
import { SeedData } from "../core/database/seed-data";
import { DataSync } from "../core/datasync/datasync.service";
import { PrepacksSync } from "../core/datasync/entity-syncs/prepack-sync";
import { ProductsSync } from "../core/datasync/entity-syncs/products-sync";
import { RecipesSync } from "../core/datasync/entity-syncs/recipe-sync";
import { Prepacks } from "../core/models/prepacks";
import { Products } from "../core/models/products";
import { Recipes } from "../core/models/recipes";
import { DatasyncRepository } from "../core/repositories/datasync.repository";
import { PrepacksRepository } from "../core/repositories/prepack.repository";
import { ProductsRepository } from "../core/repositories/products.repository";
import { RecipesRepository } from "../core/repositories/recipes.repository";
import { ConfirmationModal } from "./common/modals/confirmation/confirmation.modal";
import { IngredientPickerModal } from "./common/modals/ingredient-picker/ingredient-picker.modal";
import { ModalService } from "./common/modals/modal.service";
import { ToastModal } from "./common/modals/toast/toast.modal";
import { AppServices } from "./services-context";

export function buildServices(): AppServices {
    const db = new Database();

    const productsRepo = new ProductsRepository(db);
    const prepacksRepo = new PrepacksRepository(db);
    const recipesRepo = new RecipesRepository(db);
    const dsRepo = new DatasyncRepository(db);

    const seedData = new SeedData(productsRepo, recipesRepo, prepacksRepo);

    const dataSync = new DataSync(dsRepo);

    new ProductsSync(dataSync, productsRepo, new ProductsFirestore());
    new PrepacksSync(dataSync, prepacksRepo, new PrepacksFirestore());
    new RecipesSync(dataSync, recipesRepo, new RecipesFirestore());

    const products = new Products(productsRepo);
    const prepacks = new Prepacks(products, prepacksRepo);
    const recipes = new Recipes(products, prepacks, recipesRepo);

    const modalService = new ModalService();
    const confirmation = new ConfirmationModal(modalService);
    const toast = new ToastModal(modalService);
    const ingredientPicker = new IngredientPickerModal(modalService);

    return { db, seedData, dataSync, products, prepacks, recipes, modalService, confirmation, toast, ingredientPicker };
}
