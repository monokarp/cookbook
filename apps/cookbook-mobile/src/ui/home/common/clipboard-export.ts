import { Product } from "apps/cookbook-mobile/src/domain/types/product/product";
import { Position, Recipe } from "apps/cookbook-mobile/src/domain/types/recipe/recipe";
import Clipboard from '@react-native-clipboard/clipboard';
import { ProductMeasuring, ProductPricing } from "apps/cookbook-mobile/src/domain/types/product/product-pricing";
import { roundMoney } from "apps/cookbook-mobile/src/domain/util";


export class ExportToClipboard {
    private readonly t: (code: string) => string;

    constructor(translator: (code: string) => string) {
        this.t = translator;
    }

    public product(product: Product): void {
        Clipboard.setString(this.summarizeProduct(product));
    }

    public recipe(recipe: Recipe): void {
        Clipboard.setString(this.summarizeRecipe(recipe));
    }

    private summarizeProduct(entity: Product): string {
        return [
            entity.name,
            this.summarizeProductPricing(entity.pricing),
        ].join('\n');
    }

    private summarizeProductPricing(entity: ProductPricing): string {
        return (entity.measuring === ProductMeasuring.Grams
            ? [
                `${this.t('product.pricing.price')} - ${entity.price}`,
                `${this.t('product.details.weightInGrams')} - ${entity.weightInGrams}`
            ]
            : [
                `Price - ${entity.price}`,
                `${this.t('product.details.weightPerPiece')} - ${roundMoney(entity.weightInGrams / entity.numberOfUnits)}`,
                `${this.t('product.details.numberOfPieces')} - ${entity.numberOfUnits}`,
            ]).join('\n');
    }

    private summarizeRecipe(entity: Recipe): string {
        return [
            entity.name,
            ...entity.positions.map(one => this.summarizePosition(one)),
        ].join('\n\n');
    }

    private summarizePosition(entity: Position): string {
        return [
            entity.product.name,
            `${entity.serving.units} ${entity.serving.measuring}}`,
            `${this.t('product.pricing.totalPrice')} - ${entity.price()}`,
        ].join('\n');
    }
}
