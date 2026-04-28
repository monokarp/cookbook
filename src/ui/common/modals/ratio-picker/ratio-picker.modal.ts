import { ModalService } from "../modal.service";
import { RatioPicker } from "./ratio-picker";

export class RatioPickerModal {
    constructor(protected readonly service: ModalService) {}

    public show(initialValue: number, onSelect: (value: number) => void) {
        this.service.open(RatioPicker, {
            initialValue,
            onResult: (result: number | null) => {
                if (result !== null) onSelect(result);
            },
        });
    }
}
