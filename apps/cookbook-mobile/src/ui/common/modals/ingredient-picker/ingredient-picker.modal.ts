import { Prepack } from "@cookbook/domain/types/prepack/prepack";
import { Product } from "@cookbook/domain/types/product/product";
import { inject, injectable } from "inversify";
import { ModalService } from "../modal.service";
import { IngredientPicker } from "./ingredient-picker";

@injectable()
export class IngredientPickerModal {

    @inject(ModalService) protected readonly service!: ModalService;

    public show(items: (Product | Prepack)[], onSelect: (item: Prepack | Product) => void) {
        this.service.open(IngredientPicker, {
            items,
            onResult: (result: Prepack | Product | null) => {
                if (result) { onSelect(result) }
            }
        });
    }
}