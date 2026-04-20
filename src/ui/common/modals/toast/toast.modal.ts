import { inject, injectable } from "inversify";
import { ModalService } from "../modal.service";
import { Toast } from "./toast";

@injectable()
export class ToastModal {

    @inject(ModalService) protected readonly service!: ModalService;

    public show(data: { message: string }) {
        this.service.open(Toast, data);
    }
}