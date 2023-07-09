import { useInjection } from 'inversify-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { RecipesRepository } from '../../../core/repositories/recipes.repository';
import { RootViews } from '../../root-views.enum';
import { ExportToClipboard } from '../common/clipboard-export';
import { SummaryListItem } from '../common/list-item';
import { useProductsStore } from '../products/products.store';
import { styles } from './recipes-view.style';
import { useRecipesStore } from './recipes.store';

export function RecipesView({ navigation }) {
  const { t } = useTranslation();
  const clipboardExport = new ExportToClipboard(t);

  const repo = useInjection(RecipesRepository);

  const { products } = useProductsStore((state) => state);
  const { recipes, filteredRecipes, setRecipes, filter } = useRecipesStore((state) => state);

  useEffect(() => {
    repo.All().then(setRecipes);
  }, [products]);

  return (
    <View style={styles.container}>
      <TextInput
        mode='outlined'
        label={t('product.search.byName')}
        defaultValue=''
        onChange={event => filter(event.nativeEvent.text)}
      />

      <View style={{ flex: 9 }}>
        <FlatList
          data={filteredRecipes}
          renderItem={({ item }) =>
            <View style={styles.item}>
              <SummaryListItem
                item={item}
                itemSelected={() => navigation.navigate(RootViews.RecipeDetails, { recipe: item })}
                deleteRequested={() => repo.Delete(item.id).then(() => setRecipes(recipes.filter(p => p.id !== item.id)))}
                exportRequested={() => clipboardExport.recipe(item)}
              />
            </View>
          }
          keyExtractor={product => product.id}
        />
      </View>

      <Button
        style={styles.button}
        mode='outlined'
        onPress={() => navigation.navigate(RootViews.RecipeDetails, { recipe: repo.Create() })}
      >
        <Text style={{ fontSize: 18 }}>{t('recipe.addNew')}</Text>
      </Button>
    </View>
  );
}
