import { injectable } from "inversify";

export interface ModalRef {
    setModal: (component, props) => void,
    clearModal: () => void,
}

@injectable()
export class ModalService {

    private outletRef: ModalRef | null = null;

    public setOutletRef(ref) {
        if (!this.outletRef) { this.outletRef = ref; }
    }

    public open(component, props) {

        const resultHandler = props.onResult;

        props.onResult = (...args) => {
            resultHandler?.(...args);
            this.outletRef?.clearModal();
        }

        this.outletRef?.setModal(component, props);
    }
}