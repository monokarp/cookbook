import { round } from "../../util";
import { Product } from "../product/product";


export class Ingridient {
    constructor(
        public readonly product: Product,
        public readonly unitsPerServing: number,
    ) { }

    public price() {
        return round(this.unitsPerServing * this.product.pricePerGram());
    }
}
