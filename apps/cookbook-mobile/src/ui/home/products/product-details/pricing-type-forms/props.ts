import { ProductPricingDto } from "../../../../../domain/types/product/product-pricing";
import { FormMode } from "../../../common/form-mode.enum";

export interface PricingFormProps {
    pricing: ProductPricingDto;
    onChange: (formData: ProductPricingDto) => void;
    mode: FormMode;
}