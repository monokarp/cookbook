
import { RegexPatterns } from 'apps/cookbook-mobile/src/constants';
import { ProductsRepository } from 'apps/cookbook-mobile/src/core/repositories/products.repository';
import { useInjection } from 'inversify-react-native';
import { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { Product } from '../../../../domain/types/product/product';
import { ProductPricing, ProductPricingType } from '../../../../domain/types/product/product-pricing';
import { useProductsStore } from '../products.store';
import { PricingByWeightForm } from './pricing-type-forms/pricing-by-weight-form';
import { PricingPerPieceForm } from './pricing-type-forms/pricing-per-piece-form';
import { styles } from './product-defails.style';

export function ProductDetails({ route, navigation }) {
    const product: Product = route.params.product;
    const { t } = useTranslation();

    const repo = useInjection(ProductsRepository);

    const { setProducts } = useProductsStore();

    const [pricingType, setPricingType] = useState(product.pricing.pricingType);
    const [pricingInfo, setPricingInfo] = useState<ProductPricing | null>(null);

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            productName: product.name,
            pricingType
        },
        mode: 'onChange'
    });

    const onSubmit = async (data) => {
        await repo.Save(new Product({
            id: product.id,
            name: data.productName,
            pricing: pricingInfo,
        }));

        await repo.All().then(setProducts);

        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {/* Product name */}
            <Text style={styles.inputLabel}>{t('product.name')}</Text>
            <Controller
                control={control}
                rules={{
                    required: true,
                    pattern: RegexPatterns.LatinAndCyrillicText
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="productName"
            />
            {errors.productName && <Text style={styles.validationErrorLabel}>{t('validation.required.aplhanumeric')}</Text>}

            {/* Pricing type selector */}
            <Text style={styles.inputLabel}>{t('product.pricing.type')}</Text>
            <Controller
                control={control}
                rules={{
                    required: true,
                }}
                render={({ field: { value } }) => (
                    <SegmentedButtons
                        value={value}
                        onValueChange={value => setPricingType(value)}
                        buttons={[
                            {
                                value: ProductPricingType.ByWeight,
                                label: t('product.pricing.pricedByWeight'),
                            },
                            {
                                value: ProductPricingType.PerPiece,
                                label: t('product.pricing.pricedPerPiece'),
                            },
                        ]}
                    />
                )}
                name="pricingType"
            />

            {/* Two forms depenging on pricing type */}
            {
                function () {
                    switch (pricingType) {

                        case ProductPricingType.ByWeight:
                            return <PricingByWeightForm
                                pricing={product.pricing}
                                onChange={setPricingInfo}
                            />;

                        case ProductPricingType.PerPiece:
                            return <PricingPerPieceForm
                                pricing={product.pricing}
                                onChange={setPricingInfo}
                            />

                        default: throw new Error(`No template for pricing type: ${pricingType}`);
                    }
                }()
            }

            <Button onPress={handleSubmit(onSubmit)}>{t('common.save')}</Button>
        </View>
    );
}
