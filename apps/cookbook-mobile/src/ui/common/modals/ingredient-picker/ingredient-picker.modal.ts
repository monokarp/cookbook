import { Product } from "@cookbook/domain/types/product/product";
import { Prepack } from "@cookbook/domain/types/recipe/prepack";
import { inject, injectable } from "inversify";
import { ModalService } from "../modal.service";
import { IngredientPicker } from "./ingredient-picker";

@injectable()
export class IngredientPickerModal {

    @inject(ModalService) protected readonly service!: ModalService;

    public show(showPrepacks: boolean, onSelect: (item: Prepack | Product) => void) {
        this.service.open(IngredientPicker, {
            showPrepacks,
            onResult: (result: Prepack | Product | null) => {
                if (result) { onSelect(result) }
            }
        });
    }
}