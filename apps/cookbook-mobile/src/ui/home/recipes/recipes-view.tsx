import { RecipesService } from 'apps/cookbook-mobile/src/app/services/recipes.service';
import { useInjection } from 'inversify-react-native';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, Text, View } from 'react-native';
import { RootViews } from '../../root-views.enum';
import { styles } from './recipes-view.style';
import { useRecipesStore } from './recipes.store';
import { useEffect } from 'react';

export function RecipesView({ navigation }) {
  const {t} = useTranslation();
  const service = useInjection(RecipesService);

  const { recipes, setRecipes } = useRecipesStore((state) => state);

  useEffect(() => {
    service.All().then(setRecipes);
  }, [service, setRecipes]);

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
        onPress={() => navigation.navigate(RootViews.RecipeDetails, { recipe: service.Create() })}
      >
        <Text style={styles.buttonText}>{t('recipe.addNew')}</Text>
      </Pressable>
    </View>
  );
}

