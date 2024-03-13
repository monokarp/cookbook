import { Recipe } from '@cookbook/domain/types/recipe/recipe';
import { TestIds } from '@cookbook/ui/test-ids';
import { useInjection } from 'inversify-react-native';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Recipes } from "../../../core/models/recipes";
import { ExportToClipboard } from '../../common/clipboard-export';
import { EntityList } from '../../common/entity-list/entity-list';
import { RootViews } from '../../root-views.enum';
import { useProductsStore } from '../products/products.store';
import { useRecipesStore } from './recipes.store';

export function RecipesView({ navigation }) {
  const { t } = useTranslation();
  const clipboardExport = new ExportToClipboard(t);

  const repo = useInjection(Recipes);

  const { items: products } = useProductsStore();
  const { filteredItems: filteredRecipes, set: setRecipes, filter, deleteItem } = useRecipesStore();

  useEffect(() => {
    repo.All().then(setRecipes);
  }, [products]);

  return (
    <View testID={TestIds.RecipesView.Container} style={{ flexGrow: 1 }}>
      <TextInput
        testID={TestIds.RecipesView.SearchInput}
        mode='flat'
        label={t('product.search.byName')}
        defaultValue=''
        onChange={event => filter(event.nativeEvent.text)}
      />

      <EntityList<Recipe>
        items={filteredRecipes}
        itemTestId={TestIds.RecipesView.ListItem}
        addNewButtonTestId={TestIds.RecipesView.AddNewButton}
        addNewButtonText={t('recipe.addNew')}
        select={item => navigation.navigate(RootViews.RecipeSummary, { recipe: item })}
        addNew={() => navigation.navigate(RootViews.RecipeDetails, { recipe: repo.Create() })}
        remove={item => repo.Delete(item.id).then(() => deleteItem(item.id))}
        exportToClipboard={item => clipboardExport.recipe(item)}
      />
    </View>
  );
}
