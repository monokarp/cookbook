
import { RegexPatterns } from '@cookbook/domain/constants';
import { Product } from '@cookbook/domain/types/product/product';
import { ProductMeasuring } from '@cookbook/domain/types/product/product-pricing';
import { TestIds } from '@cookbook/ui/test-ids';
import { useInjection } from 'inversify-react-native';
import { useState } from 'react';
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { Button, List, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { Products } from '../../../../core/models/products';
import { useProductsStore } from '../products.store';
import { FormDataFacade, ProductDetailsFormData } from './form-data-facade';
import { PricingByWeightForm } from './pricing-type-forms/pricing-by-weight-form';
import { PricingPerPieceForm } from './pricing-type-forms/pricing-per-piece-form';
import { styles } from './product-defails.style';

export function ProductDetails({ route: { params: { product, mode } }, navigation }) {
    const { t } = useTranslation();

    const repo = useInjection(Products);

    const { set: setProducts } = useProductsStore();

    const [measuringType, setMeasuringType] = useState(product.pricing.measuring);

    const form = useForm<ProductDetailsFormData>({
        defaultValues: FormDataFacade.for(measuringType).getDefaultValues(product, mode),
        mode: 'onTouched'
    });

    const onSubmit = async (data: ProductDetailsFormData) => {
        await repo.Save(new Product({
            id: product.id,
            name: data.productName.trim(),
            lastModified: product.lastModified,
            nutrition: {
                carbs: Number(data.carbs),
                prot: Number(data.prot),
                fat: Number(data.fat),
            },
            pricing: FormDataFacade.for(measuringType).mapPricingInfo(data),
        }));

        await repo.All().then(setProducts);

        navigation.goBack();
    };

    return (
        <FormProvider {...form}>
            <KeyboardAvoidingView testID={TestIds.ProductDetails.Container} style={styles.container}>
                <ScrollView>
                    <Text style={styles.inputLabel}>{t('product.name')}</Text>
                    <Controller
                        control={form.control}
                        rules={{
                            required: true,
                            pattern: RegexPatterns.EntityName
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

                    {
                        <List.Accordion title={t('product.details.macros')}>
                            <Text style={styles.inputLabel}>{t('product.details.carbs')}</Text>
                            <Controller
                                name="carbs"
                                control={form.control}
                                rules={{
                                    required: true,
                                    validate: v => !isNaN(Number(v)) && isFinite(Number(v)),
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        testID={TestIds.ProductDetails.Carbs}
                                        style={styles.input}
                                        keyboardType="numeric"
                                        mode='outlined'
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {
                                form.formState.errors.carbs &&
                                <Text
                                    testID={TestIds.ProductDetails.CarbsError}
                                    style={styles.validationErrorLabel}
                                >
                                    {t('validation.required.real')}
                                </Text>
                            }

                            <Text style={styles.inputLabel}>{t('product.details.prot')}</Text>
                            <Controller
                                name="prot"
                                control={form.control}
                                rules={{
                                    required: true,
                                    validate: v => !isNaN(Number(v)) && isFinite(Number(v)),
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        testID={TestIds.ProductDetails.Prot}
                                        style={styles.input}
                                        keyboardType="numeric"
                                        mode='outlined'
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {
                                form.formState.errors.prot &&
                                <Text
                                    testID={TestIds.ProductDetails.ProtError}
                                    style={styles.validationErrorLabel}
                                >
                                    {t('validation.required.real')}
                                </Text>
                            }

                            <Text style={styles.inputLabel}>{t('product.details.fat')}</Text>
                            <Controller
                                name="fat"
                                control={form.control}
                                rules={{
                                    required: true,
                                    validate: v => !isNaN(Number(v)) && isFinite(Number(v)),
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        testID={TestIds.ProductDetails.Fat}
                                        style={styles.input}
                                        keyboardType="numeric"
                                        mode='outlined'
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {
                                form.formState.errors.fat &&
                                <Text
                                    testID={TestIds.ProductDetails.FatError}
                                    style={styles.validationErrorLabel}
                                >
                                    {t('validation.required.real')}
                                </Text>
                            }
                        </List.Accordion>
                    }

                    <Button
                        testID={TestIds.ProductDetails.Submit}
                        onPress={form.handleSubmit(onSubmit)}
                    >
                        {t('common.save')}
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </FormProvider>
    );
}
