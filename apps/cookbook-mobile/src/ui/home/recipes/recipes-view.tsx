import { TestIds } from '@cookbook/ui/test-ids';
import { useInjection } from 'inversify-react-native';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, View } from 'react-native';
import { Button, Divider, TextInput } from 'react-native-paper';
import { RecipesRepository } from '../../../core/repositories/recipes.repository';
import { ExportToClipboard } from '../../common/clipboard-export';
import { SummaryListItem } from '../../common/summary-list-item';
import { RootViews } from '../../root-views.enum';
import { styles } from "../entity-view.style";
import { useProductsStore } from '../products/products.store';
import { useRecipesStore } from './recipes.store';

export function RecipesView({ navigation }) {
  const { t } = useTranslation();
  const clipboardExport = new ExportToClipboard(t);

  const repo = useInjection(RecipesRepository);

  const { items: products } = useProductsStore();
  const { filteredItems: filteredRecipes, set: setRecipes, filter, deleteItem } = useRecipesStore();

  useEffect(() => {
    repo.All().then(all => {
      setRecipes(all);
    });
  }, [products]);

  return (
    <View testID={TestIds.RecipesView.Container} style={styles.container}>
      <TextInput
        testID={TestIds.RecipesView.SearchInput}
        mode='flat'
        label={t('product.search.byName')}
        defaultValue=''
        onChange={event => filter(event.nativeEvent.text)}
      />

      <FlatList
        style={styles.list}
        data={filteredRecipes}
        renderItem={({ item, index }) =>
          <View>
            <SummaryListItem
              item={item}
              itemTestId={TestIds.RecipesView.ListItem}
              index={index}
              itemSelected={() => navigation.navigate(RootViews.RecipeSummary, { recipe: item })}
              deleteRequested={() => repo.Delete(item.id).then(() => deleteItem(item.id))}
              exportRequested={() => clipboardExport.recipe(item)}
            />
            <Divider />
          </View>
        }
        keyExtractor={product => product.id}
      />

      <Button
        testID={TestIds.RecipesView.AddNewButton}
        style={styles.button}
        mode='contained-tonal'
        onPress={() => navigation.navigate(RootViews.RecipeDetails, { recipe: repo.Create() })}
      >
        <Text style={{ fontSize: 18 }}>{t('recipe.addNew')}</Text>
      </Button>
    </View>
  );
}
