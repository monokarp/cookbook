import { round } from "../../util";
import { Product } from "../product/product";


export class Ingridient {
    public readonly product: Product;
    public readonly unitsPerServing: number;

    constructor(data: { product: Product, unitsPerServing: number }) {
        this.product = data.product;
        this.unitsPerServing = data.unitsPerServing;
    }

    public price() {
        return round(this.unitsPerServing * this.product.pricePerGram());
    }
}
