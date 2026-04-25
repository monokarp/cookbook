export interface ModalRef {
    // @ts-expect-error intentionally untyped — accepts any component/props
    setModal: (component, props) => void,
    clearModal: () => void,
}

export class ModalService {

    private outletRef: ModalRef | null = null;

    // @ts-expect-error
    public setOutletRef(ref) {
        if (!this.outletRef) { this.outletRef = ref; }
    }

    // @ts-expect-error
    public open(component, props) {

        const resultHandler = props.onResult;

        // @ts-expect-error
        props.onResult = (...args) => {
            resultHandler?.(...args);
            this.outletRef?.clearModal();
        }

        this.outletRef?.setModal(component, props);
    }
}