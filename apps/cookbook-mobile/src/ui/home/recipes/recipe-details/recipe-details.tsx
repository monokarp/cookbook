
import { RegexPatterns } from "@cookbook/domain/constants";
import { ProductIngredient } from "@cookbook/domain/types/recipe/product-ingredient";
import { Position, PositionGroup, Recipe } from "@cookbook/domain/types/recipe/recipe";
import { FormatNumber } from "@cookbook/domain/util";
import { TestIds } from "@cookbook/ui/test-ids";
import { useInjection } from "inversify-react-native";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FlatList, KeyboardAvoidingView, View } from "react-native";
import { Appbar, Button, Divider, Text, TextInput } from "react-native-paper";
import { RecipesRepository } from "../../../../core/repositories/recipes.repository";
import { IngredientSelect } from "../../../common/ingredient-select/ingredient-select";
import { RootViews } from "../../../root-views.enum";
import { useRecipesStore } from "../recipes.store";
import { GroupRowWrapper } from "./group-wrapper/group-wrapper";
import { styles } from "./recipe-details.style";


export interface RecipeDetailsFormData {
    recipeName: string
};

export function RecipeDetails({ navigation, route }) {
    let listElementRef: FlatList<Position> | null = null;

    const { t } = useTranslation();
    const recipeRepo = useInjection(RecipesRepository);

    const [recipe, setRecipe] = useState<Recipe>(route.params.recipe);

    const withStoreUpdate = fn => (...args) => {
        fn.call(recipe, ...args);
        setRecipe(recipe.clone());
    }

    const addPosition = withStoreUpdate(recipe.addPosition);
    const setPosition = withStoreUpdate(recipe.setPosition);
    const removePosition = withStoreUpdate(recipe.removePosition);
    const applyGroup = withStoreUpdate(recipe.applyGroup);
    const removeGroup = withStoreUpdate(recipe.removeGroup);

    const { set: setRecipes } = useRecipesStore();

    const form = useForm({
        defaultValues: {
            recipeName: recipe.name,
        }
    });

    const [currentlyEditedItemIndex, setCurrentlyEditedItemIndex] = useState<number | null>(null);

    const [isEditingGroups, setGroupEditing] = useState(false);
    const [activeGroup, setActiveGroup] = useState<PositionGroup | null>(null);

    function clearGroupEditing() {
        setGroupEditing(false);
        setActiveGroup(null);
    }

    function isAdjacentToActiveGroup(positionIndex: number): boolean {
        const firstIndex = activeGroup.positionIndices[0];
        const lastIndex = activeGroup.positionIndices[activeGroup.positionIndices.length - 1];

        const isFirstOrAdjacent = [firstIndex - 1, firstIndex].includes(positionIndex);
        const isLastOrAdjacent = [lastIndex, lastIndex + 1].includes(positionIndex);

        return isFirstOrAdjacent || isLastOrAdjacent;
    }

    function isLastInActiveGroup(positionIndex: number): boolean {
        return activeGroup.positionIndices.length === 1 && activeGroup.positionIndices[0] === positionIndex;
    }

    const onSubmit = async (data: RecipeDetailsFormData) => {
        recipe.name = data.recipeName;

        await recipeRepo.Save(recipe);

        await recipeRepo.All().then(setRecipes);

        navigation.navigate(RootViews.RecipeSummary, { recipe: recipe.clone() });
    };

    function addEmptyIngredient() {
        addPosition(ProductIngredient.Empty());
        setCurrentlyEditedItemIndex(recipe.positions.length - 1);
    };

    function deleteIngredient(index: number) {
        const isGrouped = !!recipe.groups.find(one => one.positionIndices.includes(index));

        if (isGrouped) { return; }

        removePosition(index);
        setCurrentlyEditedItemIndex(null);
    };

    return (
        <FormProvider {...form}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={t('recipe.details.title')} />
                <Appbar.Action icon="check-bold" onPress={form.handleSubmit(onSubmit)} testID={TestIds.RecipeDetails.Submit} />
            </Appbar.Header>
            <KeyboardAvoidingView style={styles.container}>
                <FlatList
                    ref={ref => listElementRef = ref}
                    onContentSizeChange={() => {
                        const lastIngredientEmpty = recipe.positions.length && recipe.positions[recipe.positions.length - 1].id === '';

                        if (lastIngredientEmpty) {
                            listElementRef.scrollToIndex({ index: recipe.positions.length - 1 });
                        }
                    }}
                    style={{ flexGrow: 0, width: '100%' }}
                    keyExtractor={(item, index) => {
                        return `${index}_${item.id}`;
                    }}
                    ListHeaderComponent={() =>
                        <View style={{ flexDirection: 'row' }}>

                            <View style={{ flex: 4 }}>
                                <Controller
                                    name="recipeName"
                                    rules={{
                                        required: true,
                                        pattern: RegexPatterns.EntityName
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View>
                                            <TextInput
                                                testID={TestIds.RecipeDetails.NameInput}
                                                placeholder={t('recipe.name')}
                                                style={styles.input}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                        </View>
                                    )}
                                />
                                {
                                    form.formState.errors.recipeName &&
                                    <Text style={styles.validationErrorLabel}>{t('validation.required.alphanumeric')}</Text>
                                }
                                <Text testID={TestIds.RecipeDetails.NameInputError} variant="labelLarge" style={{ margin: 5 }}>
                                    {`${t('product.pricing.totalPrice')}: ${FormatNumber.Money(recipe.totalPrice())}`}
                                </Text>

                                <Divider />
                            </View>
                        </View>
                    }
                    data={recipe.positions}
                    renderItem={({ item, index }) =>
                        <GroupRowWrapper
                            recipeGroups={
                                isEditingGroups
                                    ? [activeGroup]
                                    : recipe.groups
                            }
                            rowIndex={index}
                            groupEditing={{
                                isActive: isEditingGroups,
                                onRemove: removeGroup,
                                onConfirm: name => {
                                    applyGroup({ ...activeGroup, name });
                                    clearGroupEditing();
                                },
                                onCancel: clearGroupEditing,
                            }}
                        >
                            <IngredientSelect
                                allowAddingPrepacks={true}
                                ingredient={item}
                                index={index}
                                isEditing={currentlyEditedItemIndex === index}
                                requestEdit={() => {
                                    setCurrentlyEditedItemIndex(index)
                                }}
                                onEditConfirmed={(position) => {
                                    setPosition(position, index);
                                    setCurrentlyEditedItemIndex(null);
                                }}
                                onDelete={() => {
                                    deleteIngredient(index);
                                }}
                                toggleGroupEditing={() => {
                                    if (isEditingGroups) { return; }

                                    const existingGroup = recipe.groups.find(one => one.positionIndices.includes(index));

                                    setActiveGroup({
                                        name: existingGroup ? existingGroup.name : '',
                                        positionIndices: existingGroup
                                            ? [...existingGroup.positionIndices]
                                            : [index]
                                    });

                                    setGroupEditing(true);
                                }}
                                toggleItemGrouping={() => {
                                    if (!isEditingGroups || isLastInActiveGroup(index) || !isAdjacentToActiveGroup(index)) { return; }

                                    const updatedIndices = activeGroup.positionIndices.includes(index)
                                        ? activeGroup.positionIndices.filter(one => one !== index)
                                        : [...activeGroup.positionIndices, index].sort((a, b) => a - b);

                                    setActiveGroup({
                                        name: activeGroup.name,
                                        positionIndices: updatedIndices
                                    });
                                }}
                            />
                        </GroupRowWrapper>
                    }
                    ListFooterComponentStyle={{ justifyContent: 'center' }}
                    ListFooterComponent={() =>
                        <Button
                            mode="outlined"
                            testID={TestIds.RecipeDetails.AddIngredient}
                            disabled={currentlyEditedItemIndex !== null}
                            onPress={addEmptyIngredient}
                            style={{ alignSelf: 'center', margin: 15 }}
                        >
                            {t('recipe.details.addIngredient')}
                        </Button>
                    }
                />
            </KeyboardAvoidingView>
        </FormProvider>
    );
}