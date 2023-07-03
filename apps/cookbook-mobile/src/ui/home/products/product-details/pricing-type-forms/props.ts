import { ProductPricingDto } from "apps/cookbook-mobile/src/domain/types/product/product-pricing";

export interface PricingFormProps {
    pricing: ProductPricingDto;
    onChange: (formData: ProductPricingDto) => void
}