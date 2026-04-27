import { Prepack } from "../prepack/prepack";
import { Product } from "../product/product";
import { ProductMeasuring } from "../product/product-pricing";
import { Position, containsAsNestedIngredient } from "./position";
import { PrepackIngredient } from "./prepack-ingredient";
import { ProductIngredient } from "./product-ingredient";

function dummyPrepack(id: string, ingredients?: Position[]): Prepack {
    return new Prepack({
        id,
        name: "",
        lastModified: "",
        finalWeight: 1,
        description: "",
        ingredients: ingredients ?? [],
    });
}

function dummyProduct(id: string): Product {
    return new Product({
        id,
        name: "",
        lastModified: "",
        nutrition: { carbs: 0, prot: 0, fat: 0 },
        pricing: {
            measuring: ProductMeasuring.Grams,
            price: 1,
            weightInGrams: 1,
            numberOfUnits: 1,
        },
    });
}

function makeProductIngredient(pricing: { price: number; weightInGrams: number; numberOfUnits: number; measuring: ProductMeasuring }, serving: { units: number; measuring: ProductMeasuring }): ProductIngredient {
    return new ProductIngredient({
        product: new Product({
            id: "test",
            name: "",
            lastModified: "",
            nutrition: { carbs: 0, prot: 0, fat: 0 },
            pricing,
        }),
        serving,
    });
}

const target: Prepack = dummyPrepack("target");

describe("Product ingredient calculations", () => {
    it("price() does not accumulate rounding error when pricePerGram is a repeating decimal", () => {
        // 500 price for 150g → pricePerGram = 3.3333… (repeating)
        // Rounding the rate to 4dp gives 3.3333, so 150 × 3.3333 = 499.995.
        // At ratio 2 that yields 999.99 instead of 1000.
        const ingredient = makeProductIngredient(
            { measuring: ProductMeasuring.Grams, price: 500, weightInGrams: 150, numberOfUnits: 1 },
            { units: 150, measuring: ProductMeasuring.Grams },
        );

        expect(ingredient.price() * 2).toBe(1000);
    });

    it("weight() divides weightInGrams by numberOfUnits for unit-measured products", () => {
        // 10 eggs weigh 500g (50g each). Serving: 8 eggs → expected weight 400g.
        // Multiplying serving.units × weightInGrams directly gives 8 × 500 = 4000g.
        const ingredient = makeProductIngredient(
            { measuring: ProductMeasuring.Units, price: 10.98, weightInGrams: 500, numberOfUnits: 10 },
            { units: 8, measuring: ProductMeasuring.Units },
        );

        expect(ingredient.weight()).toBe(400);
    });
});

describe("containsNestedIngredient", () => {
    it("returns true when host ingredient is the target prepack", () => {
        expect(containsAsNestedIngredient(target, target)).toEqual(true);
    });

    it("returns false when nested prepack ingredient tree does not include target prepack", () => {
        const host = dummyPrepack("1", [
            new ProductIngredient({
                product: dummyProduct("1"),
                serving: {
                    units: 1,
                    measuring: ProductMeasuring.Units,
                },
            }),
            new PrepackIngredient({
                prepack: dummyPrepack("2"),
                weightInGrams: 100,
            }),
        ]);

        expect(containsAsNestedIngredient(host, target)).toEqual(false);
    });

    it("returns true when target prepack is nested inside one of the ingredients", () => {
        const host = dummyPrepack("1", [
            new ProductIngredient({
                product: dummyProduct("1"),
                serving: {
                    units: 1,
                    measuring: ProductMeasuring.Units,
                },
            }),
            new PrepackIngredient({
                prepack: dummyPrepack("2", [
                    new ProductIngredient({
                        product: dummyProduct("1"),
                        serving: {
                            units: 1,
                            measuring: ProductMeasuring.Units,
                        },
                    }),
                    new PrepackIngredient({
                        prepack: dummyPrepack("3", [
                            new ProductIngredient({
                                product: dummyProduct("1"),
                                serving: {
                                    units: 1,
                                    measuring: ProductMeasuring.Units,
                                },
                            }),
                            new PrepackIngredient({
                                prepack: target,
                                weightInGrams: 100,
                            }),
                        ]),
                        weightInGrams: 100,
                    }),
                ]),
                weightInGrams: 100,
            }),
        ]);

        expect(containsAsNestedIngredient(host, target)).toEqual(true);
    });
});
