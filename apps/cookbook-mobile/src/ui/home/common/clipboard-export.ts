import Clipboard from '@react-native-clipboard/clipboard';
import { Product } from "../../../domain/types/product/product";
import { ProductMeasuring, ProductPricing } from "../../../domain/types/product/product-pricing";
import { Position, Recipe, isProductIngredient, isPrepackIngredient } from "../../../domain/types/recipe/recipe";
import { roundMoney } from "../../../domain/util";
import { Prepack } from '../../../domain/types/recipe/prepack';
import { ProductIngredient } from '../../../domain/types/recipe/product-ingredient';


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

    public prepack(prepack: Prepack): void {
        Clipboard.setString(this.summarizePrepack(prepack));
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
        if (isProductIngredient(entity)) {
            return this.summarizeIngredient(entity);
        }

        if (isPrepackIngredient(entity)) {
            return this.summarizePrepack(entity.prepack);
        }

        throw new Error('Unknown position type');
    }

    private summarizeIngredient(entity: ProductIngredient): string {
        return [
            entity.product.name,
            `${entity.serving.units} ${this.t(`product.measuring.${entity.serving.measuring}`)}`,
            `${this.t('product.pricing.totalPrice')} - ${entity.price()}`,
        ].join('\n');
    }

    private summarizePrepack(entity: Prepack): string {
        return [
            entity.name,
            ...entity.ingredients.map(one => this.summarizeIngredient(one)),
        ].join('\n\n');
    }
}
