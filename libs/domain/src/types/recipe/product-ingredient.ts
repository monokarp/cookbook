import { roundMoney } from "../../util";
import { Product, ProductDto } from "../product/product";
import { ProductMeasuring } from "../product/product-pricing";


export class ProductIngredient implements ProductIngredientDto {
    public readonly product: Product;
    public readonly serving: Serving;

    public static Empty(): ProductIngredient {
        return new ProductIngredient({
            product: Product.Empty(),
            serving: { units: 0, measuring: ProductMeasuring.Grams }
        });
    }

    constructor(data: ProductIngredientDto) {
        this.product = new Product(data.product);
        this.serving = data.serving;
    }

    public price(): number {
        return roundMoney(
            this.serving.measuring === ProductMeasuring.Grams
                ? this.serving.units * this.product.pricing.pricePerGram()
                : this.serving.units * this.product.pricing.pricePerUnit()
        );
    }
}

export interface ProductIngredientDto {
    product: ProductDto;
    serving: Serving;
}

export interface Serving {
    units: number;
    measuring: ProductMeasuring;
}

export interface ProductIngredientEntity {
    productId: string;
    serving: Serving;
}
