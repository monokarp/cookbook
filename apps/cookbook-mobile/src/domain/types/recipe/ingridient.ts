import { roundMoney } from "../../util";
import { Product } from "../product/product";
import { ProductMeasuring } from "../product/product-pricing";


export class Ingridient {
    public readonly product: Product;
    public readonly serving: Serving;

    constructor(data: { product: Product, serving: Serving }) {
        this.product = data.product;
        this.serving = data.serving;
    }

    public price(): number {
        return roundMoney(
            this.serving.measuring === ProductMeasuring.Grams
                ? this.serving.units * this.product.pricing.pricePerGram()
                : this.serving.units * this.product.pricing.pricePerUnit()
        );
    }

    public ExportAsString(): string {
        return [
            this.product.name,
            `Units - ${this.serving.units}`,
            `Total price - ${this.price()}`,
        ].join('\n');
    }
}

export interface Serving {
    units: number;
    measuring: ProductMeasuring;
}