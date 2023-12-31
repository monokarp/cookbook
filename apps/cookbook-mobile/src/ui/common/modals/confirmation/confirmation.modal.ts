import { inject, injectable } from "inversify";
import { ModalService } from "../modal.service";
import { Confirmation, ConfirmationProps } from "./confirmation";

@injectable()
export class ConfirmationModal {

    @inject(ModalService) protected readonly service!: ModalService;

    public show(data: ConfirmationProps) {
        this.service.open(Confirmation, data);
    }
}