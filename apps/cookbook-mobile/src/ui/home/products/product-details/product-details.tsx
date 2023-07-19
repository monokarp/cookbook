
import { RegexPatterns } from '@cookbook/domain/constants';
import { Product } from '@cookbook/domain/types/product/product';
import { ProductMeasuring } from '@cookbook/domain/types/product/product-pricing';
import { TestIds } from '@cookbook/ui/test-ids';
import { useInjection } from 'inversify-react-native';
import { useState } from 'react';
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { ProductsRepository } from '../../../../core/repositories/products.repository';
import { useProductsStore } from '../products.store';
import { FormDataFacade, ProductDetailsFormData } from './form-data-facade';
import { PricingByWeightForm } from './pricing-type-forms/pricing-by-weight-form';
import { PricingPerPieceForm } from './pricing-type-forms/pricing-per-piece-form';
import { styles } from './product-defails.style';

export function ProductDetails({ route: { params: { product, mode } }, navigation }) {
    const { t } = useTranslation();

    const repo = useInjection(ProductsRepository);

    const { set: setProducts } = useProductsStore();

    const [measuringType, setMeasuringType] = useState(product.pricing.measuring);

    const form = useForm<ProductDetailsFormData>({
        defaultValues: FormDataFacade.for(measuringType).getDefaultValues(product, mode),
        mode: 'onTouched'
    });

    const onSubmit = async (data: ProductDetailsFormData) => {
        await repo.Save(new Product({
            id: product.id,
            name: data.productName,
            pricing: FormDataFacade.for(measuringType).mapPricingInfo(data),
        }));

        await repo.All().then(setProducts);

        navigation.goBack();
    };

    return (
        <FormProvider {...form}>
            <View testID={TestIds.ProductDetails.Container} style={styles.container}>
                <Text style={styles.inputLabel}>{t('product.name')}</Text>
                <Controller
                    control={form.control}
                    rules={{
                        required: true,
                        pattern: RegexPatterns.LatinAndCyrillicText
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            testID={TestIds.ProductDetails.NameInput}
                            style={styles.input}
                            mode='outlined'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="productName"
                />
                {
                    form.formState.errors.productName &&
                    <Text
                        testID={TestIds.ProductDetails.NameInputError}
                        style={styles.validationErrorLabel}
                    >
                        {t('validation.required.alphanumeric')}
                    </Text>
                }

                <Text style={styles.inputLabel}>{t('product.pricing.type')}</Text>
                <Controller
                    control={form.control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { value, onChange } }) => (
                        <SegmentedButtons
                            style={styles.input}
                            value={value}
                            onValueChange={value => { setMeasuringType(value); onChange(value); }}
                            buttons={[
                                {
                                    value: ProductMeasuring.Grams,
                                    label: t('product.pricing.pricedByWeight'),
                                    testID: TestIds.ProductDetails.PricingToggle.Weight
                                },
                                {
                                    value: ProductMeasuring.Units,
                                    label: t('product.pricing.pricedPerPiece'),
                                    testID: TestIds.ProductDetails.PricingToggle.Units
                                },
                            ]}
                        />
                    )}
                    name="measuring"
                />

                {
                    function () {
                        switch (measuringType) {
                            case ProductMeasuring.Grams:
                                return <PricingByWeightForm />;

                            case ProductMeasuring.Units:
                                return <PricingPerPieceForm />

                            default: throw new Error(`No template for pricing type: ${measuringType}`);
                        }
                    }()
                }

                <Button
                    testID={TestIds.ProductDetails.Submit}
                    onPress={form.handleSubmit(onSubmit)}
                >
                    {t('common.save')}
                </Button>
            </View>
        </FormProvider>
    );
}
