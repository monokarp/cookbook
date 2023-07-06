import { ProductPricingDto } from "../../../../../domain/types/product/product-pricing";

export interface PricingFormProps {
    pricing: ProductPricingDto;
    onChange: (formData: ProductPricingDto) => void
}