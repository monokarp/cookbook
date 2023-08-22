export function collectionElementId(id: string, index: number): string {
    return `${id}-${index}`;
}

export const TestIds = {
    Login: {
        LoginButton: 'login-button',
    },
    RecipesView: {
        Container: 'recipes-view',
        SearchInput: 'recipes-view-search-input',
        ListItem: 'recipes-view-list-item',
        AddNewButton: 'recipes-view-add',
    },
    RecipeSummary: {
        Description: 'recipe-summary-description',
        ToDetails: 'recipe-summary-to-details',
        Back: 'recipe-summary-back',
    },
    RecipeDetails: {
        NameInput: 'recipe-details-name-input',
        NameInputError: 'recipe-details-name-input-error',
        AddIngredient: 'recipe-details-add-ingredient',
        Submit: 'recipe-details-submit',
    },
    Navigation: {
        Recipes: 'navigation-recipes',
        Products: 'navigation-products',
        Prepacks: 'navigation-prepacks',
    },
    ProductsView: {
        Container: 'products-view',
        ListItem: 'products-view-list-item',
        SearchInput: 'products-view-search-input',
        AddNewButton: 'products-view-add',
        ToastMessage: 'products-view-toast-message',
    },
    ProductDetails: {
        Container: 'product-details',
        NameInput: 'product-details-name-input',
        NameInputError: 'product-details-name-input-error',
        PricingToggle: {
            Weight: 'product-details-pricing-toggle-weight',
            Units: 'product-details-pricing-toggle-units',
        },
        WeightInput: 'product-details-weight-input',
        WeightInputError: 'product-details-weight-input-error',
        PriceInput: 'product-details-price-input',
        PriceInputError: 'product-details-price-input-error',
        UnitsInput: 'product-details-units-input',
        UnitsInputError: 'product-details-units-input-error',
        Submit: 'product-details-submit',
    },
    PrepacksView: {
        Container: 'prepacks-view',
        ListItem: 'prepacks-view-list-item',
        SearchInput: 'prepacks-view-search-input',
        AddNewButton: 'prepacks-view-add',
        ToastMessage: 'prepacks-view-toast-message',
    },
    PrepackDetails: {
        NameInput: 'prepack-details-name-input',
        NameInputError: 'prepack-details-name-input-error',
        WeightInput: 'prepack-details-weight-input',
        WeightInputError: 'prepack-details-weight-input-error',
        AddIngredient: 'prepack-details-add-ingredient',
        Submit: 'prepack-details-submit',
    },
    IngredientSelect: {
        UnitsInput: 'ingredient-select-units-input',
        UnitsToggle: 'ingredient-select-units-toggle',
        Edit: 'ingredient-select-edit',
        Ingredient: {
            Button: 'ingredient-select-ingredient-button',
            Name: 'ingredient-select-ingredient-name',
            Price: 'ingredient-select-ingredient-price',
            Modal: {
                NameSearchInput: 'ingredient-select-ingredient-modal-name-search-input',
                ListItem: 'ingredient-select-ingredient-modal-list-item',
            },
            RequiredError: 'ingredient-select-ingredient-required-error',
            UnitsError: 'ingredient-select-ingredient-units-error',
        }
    },
    ListItem: {
        ClipboardExport: 'list-item-clipboard-export',
    },
    ConfirmDeleteModal: {
        Container: 'confirm-delete-modal',
        Confirm: 'confirm-delete-modal-confirm',
        Cancel: 'confirm-delete-modal-cancel',
    }
};