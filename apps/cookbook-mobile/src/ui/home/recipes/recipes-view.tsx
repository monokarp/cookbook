import { RecipesRepository } from 'apps/cookbook-mobile/src/core/repositories/recipes.repository';
import { useInjection } from 'inversify-react-native';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, Text, View } from 'react-native';
import { RootViews } from '../../root-views.enum';
import { styles } from './recipes-view.style';
import { useRecipesStore } from './recipes.store';

export function RecipesView({ navigation }) {
  const { t } = useTranslation();
  const repo = useInjection(RecipesRepository);

  const { recipes, setRecipes } = useRecipesStore((state) => state);

  useEffect(() => {
    repo.All().then(setRecipes);
}, [repo, setRecipes]);

return (
  <View style={styles.container}>
    <View style={{ flex: 9 }}>
      <FlatList
        data={recipes}
        renderItem={({ item }) =>
          <Pressable
            style={styles.item}
            onPress={() => navigation.navigate(RootViews.RecipeDetails, { recipe: item })}
          >
            <Text style={{ fontWeight: '800' }}>{item.name}</Text>
            <Text>{`Number of ingridients: ${item.positions.length}`}</Text>
          </Pressable>
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
