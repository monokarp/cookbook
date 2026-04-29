import { ModalService } from "../modal.service";
import { Toast } from "./toast";

export class ToastModal {
    constructor(protected readonly service: ModalService) {}

    public show(data: { message: string; testID?: string }) {
        this.service.open(Toast, data);
    }
}
