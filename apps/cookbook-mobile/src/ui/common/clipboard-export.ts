import { Position, isPrepackIngredient, isProductIngredient } from "@cookbook/domain/types/position/position";
import { ProductIngredient } from "@cookbook/domain/types/position/product-ingredient";
import { Prepack } from "@cookbook/domain/types/prepack/prepack";
import { Product } from "@cookbook/domain/types/product/product";
import { ProductMeasuring, ProductPricing } from "@cookbook/domain/types/product/product-pricing";
import { Recipe } from "@cookbook/domain/types/recipe/recipe";
import { FormatNumber, roundMoney } from "@cookbook/domain/util";
import Clipboard from '@react-native-clipboard/clipboard';


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
            '\n',
            ...entity.positions.map(one => this.summarizePosition(one)),
        ].join('\n');
    }

    private summarizePosition(entity: Position): string {
        if (isProductIngredient(entity)) {
            return this.summarizeProductIngredient(entity);
        }

        if (isPrepackIngredient(entity)) {
            return this.summarizePrepack(entity.prepack);
        }

        throw new Error('Unknown position type');
    }

    private summarizeProductIngredient(entity: ProductIngredient): string {
        return `${entity.product.name} - ${entity.serving.measuring === ProductMeasuring.Units ? entity.serving.units : FormatNumber.Weight(entity.serving.units)} ${this.t(`product.measuring.${entity.serving.measuring}`)}`;
    }

    private summarizePrepack(entity: Prepack): string {
        return [
            entity.name,
            '\n',
            ...entity.ingredients.map(one => this.summarizePosition(one)),
        ].join('\n');
    }
}
