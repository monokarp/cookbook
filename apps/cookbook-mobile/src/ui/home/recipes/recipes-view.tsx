import { RecipesRepository } from 'apps/cookbook-mobile/src/core/repositories/recipes.repository';
import { useInjection } from 'inversify-react-native';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, Text, View } from 'react-native';
import { RootViews } from '../../root-views.enum';
import { styles } from './recipes-view.style';
import { useRecipesStore } from './recipes.store';
import { SummaryListItem } from '../common/list-item';
import Clipboard from '@react-native-clipboard/clipboard';

export function RecipesView({ navigation }) {
  const { t } = useTranslation();
  const repo = useInjection(RecipesRepository);

  const { recipes, setRecipes } = useRecipesStore((state) => state);

  useEffect(() => {
    repo.All().then(setRecipes);
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flex: 9 }}>
        <FlatList
          data={recipes}
          renderItem={({ item }) =>
            <View style={styles.item}>
              <SummaryListItem
                item={item}
                itemSelected={() => navigation.navigate(RootViews.RecipeDetails, { recipe: item })}
                deleteRequested={() => repo.Delete(item.id).then(() => setRecipes(recipes.filter(p => p.id !== item.id)))}
                exportRequested={() => Clipboard.setString(item.ExportAsString())}
              />
            </View>
          }
          keyExtractor={product => product.id}
        />
      </View>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate(RootViews.RecipeDetails, { recipe: repo.Create() })}
      >
        <Text style={styles.buttonText}>{t('recipe.addNew')}</Text>
      </Pressable>
    </View>
  );
}
