import { Prepack } from "../prepack/prepack";
import { Product } from "../product/product";
import { ProductMeasuring } from "../product/product-pricing";
import { Position, containsAsNestedIngredient } from "./position";
import { PrepackIngredient } from "./prepack-ingredient";
import { ProductIngredient } from "./product-ingredient";

function dummyPrepack(id: string, ingredients?: Position[]): Prepack {
    return new Prepack({
        id,
        name: '',
        lastModified: '',
        finalWeight: 1,
        description: '',
        ingredients: ingredients ?? [],
    });
}

function dummyProduct(id: string): Product {
    return new Product({
        id,
        name: '',
        lastModified: '',
        pricing: {
            measuring: ProductMeasuring.Grams,
            price: 1,
            weightInGrams: 1,
            numberOfUnits: 1,
        }
    });
}

const target: Prepack = dummyPrepack('target');

describe('containsNestedIngredient', () => {
    it('returns true when host ingredient is the target prepack', () => {
        expect(containsAsNestedIngredient(target, target)).toEqual(true);
    });

    it('returns false when nested prepack ingredient tree does not include target prepack', () => {
        const host = dummyPrepack('1', [
            new ProductIngredient({
                product: dummyProduct('1'),
                serving: {
                    units: 1,
                    measuring: ProductMeasuring.Units,
                }
            }),
            new PrepackIngredient({
                prepack: dummyPrepack('2'),
                weightInGrams: 100,
            })
        ]);

        expect(containsAsNestedIngredient(host, target)).toEqual(false);
    });

    it('returns true when target prepack is nested inside one of the ingredients', () => {
        const host = dummyPrepack('1', [
            new ProductIngredient({
                product: dummyProduct('1'),
                serving: {
                    units: 1,
                    measuring: ProductMeasuring.Units,
                }
            }),
            new PrepackIngredient({
                prepack: dummyPrepack('2', [
                    new ProductIngredient({
                        product: dummyProduct('1'),
                        serving: {
                            units: 1,
                            measuring: ProductMeasuring.Units,
                        }
                    }),
                    new PrepackIngredient({
                        prepack: dummyPrepack('3', [
                            new ProductIngredient({
                                product: dummyProduct('1'),
                                serving: {
                                    units: 1,
                                    measuring: ProductMeasuring.Units,
                                }
                            }),
                            new PrepackIngredient({
                                prepack: target,
                                weightInGrams: 100,
                            })
                        ]),
                        weightInGrams: 100,
                    })
                ]),
                weightInGrams: 100,
            })
        ]);

        expect(containsAsNestedIngredient(host, target)).toEqual(true);
    });
});