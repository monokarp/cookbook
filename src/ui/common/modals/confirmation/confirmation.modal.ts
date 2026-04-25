import { ModalService } from "../modal.service";
import { Confirmation, ConfirmationProps } from "./confirmation";

export class ConfirmationModal {

    constructor(protected readonly service: ModalService) {}

    public show(data: ConfirmationProps) {
        this.service.open(Confirmation, data);
    }
}