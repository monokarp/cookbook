import { Product } from '@cookbook/domain/types/product/product';
import { ProductMeasuring, ProductPricingDto } from '@cookbook/domain/types/product/product-pricing';
import { FormatNumber, FormatString } from '@cookbook/domain/util';
import { FormMode } from '../../../common/form-mode.enum';


export const FormDataFacade = {
    for: (measuring: ProductMeasuring): FormDataHelper => {
        switch (measuring) {
            case ProductMeasuring.Grams: return GramsMeasuredFormData;
            case ProductMeasuring.Units: return UnitsMeasuredFormData;
            default: throw new Error(`Unrecognized measuring type: ${measuring}`);
        }
    }
}

export interface FormDataHelper {
    getDefaultValues: (product: Product, mode: FormMode) => ProductDetailsFormData;
    mapPricingInfo: (data: ProductDetailsFormData) => ProductPricingDto;
}

export interface ProductDetailsFormData {
    productName: string;
    measuring: string;
    numberOfPieces: string;
    weight: string;
    price: string;
}

const GramsMeasuredFormData = {
    getDefaultValues: (product: Product, mode: FormMode): ProductDetailsFormData => {
        const isEdit = mode === FormMode.Edit;
        const { measuring, weightInGrams, price } = product.pricing;

        return {
            productName: product.name,
            measuring,
            numberOfPieces: '1',
            weight: isEdit ? FormatNumber.Weight(weightInGrams) : '',
            price: isEdit ? FormatNumber.Money(price) : '',
        }
    },
    mapPricingInfo: (data: ProductDetailsFormData): ProductPricingDto => ({
        measuring: ProductMeasuring.Grams,
        price: Number(data.price),
        weightInGrams: FormatString.Weight(data.weight),
        numberOfUnits: 1,
    })
};

const UnitsMeasuredFormData = {
    getDefaultValues: (product: Product, mode: FormMode): ProductDetailsFormData => {
        const isEdit = mode === FormMode.Edit;
        const { measuring, weightInGrams, price, numberOfUnits } = product.pricing;

        return {
            productName: product.name,
            measuring,
            numberOfPieces: isEdit ? FormatNumber.Units(numberOfUnits) : '',
            weight: isEdit ? FormatNumber.Weight(numberOfUnits ? weightInGrams / numberOfUnits : 0) : '',
            price: isEdit ? FormatNumber.Money(price) : '',
        }
    },
    mapPricingInfo: (data: ProductDetailsFormData): ProductPricingDto => ({
        measuring: ProductMeasuring.Units,
        price: Number(data.price),
        numberOfUnits: Number(data.numberOfPieces),
        weightInGrams: Number(data.numberOfPieces) * FormatString.Weight(data.weight),
    })
};
