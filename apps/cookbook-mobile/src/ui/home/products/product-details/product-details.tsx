import { ProductsService } from 'apps/cookbook-mobile/src/app/services/products.service';
import { useInjection } from 'inversify-react-native';
import { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { Product, ProductPricingType } from '../../../../domain/types/product/product';
import { PricedByWeight, PricedPerPiece, PricingInfo } from '../../../../domain/types/product/product-pricing';
import { useProductsStore } from '../products.store';
import { PricingByWeightForm } from './pricing-type-forms/pricing-by-weight-form';
import { PricingPerPieceForm } from './pricing-type-forms/pricing-per-piece-form';
import { styles } from './product-defails.style';
import { RegexPatterns } from './util';

export function ProductDetails({ route, navigation }) {
    const product: Product = route.params.product;
    const { t } = useTranslation();

    const service = useInjection(ProductsService);

    const { setProducts } = useProductsStore();

    const [pricingType, setPricingType] = useState(product.getPricingType());
    const [pricingInfo, setPricingInfo] = useState<PricingInfo | null>(null);

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            productName: product.name,
            pricingType
        },
        mode: 'onChange'
    });

    const onSubmit = async (data) => {
        await service.Save(new Product(
            product.id,
            data.productName,
            pricingInfo,
        ));

        await service.All().then(setProducts);

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
                                pricing={product.pricing as PricedByWeight}
                                onChange={setPricingInfo}
                            />;

                        case ProductPricingType.PerPiece:
                            return <PricingPerPieceForm
                                pricing={product.pricing as PricedPerPiece}
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
