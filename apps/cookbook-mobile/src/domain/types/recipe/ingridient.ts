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
        return round(this.unitsPerServing * this.product.pricing.pricePerGram());
    }

    public ExportAsString(): string {
        return [
            this.product.name,
            `Units - ${this.unitsPerServing}`,
            `Total price - ${this.price()}`,
        ].join('\n');
    }
}
