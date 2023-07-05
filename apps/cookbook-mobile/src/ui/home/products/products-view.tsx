import { ProductsRepository } from 'apps/cookbook-mobile/src/core/repositories/products.repository';
import { useInjection } from 'inversify-react-native';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import { RootViews } from '../../root-views.enum';
import { SummaryListItem } from '../common/list-item';
import { styles } from './products-view.style';
import { useProductsStore } from './products.store';
import { ExportToClipboard } from '../common/clipboard-export';

export function ProductsView({ navigation }) {
  const { t } = useTranslation();
  const clipboardExport = new ExportToClipboard(t);

  const repo = useInjection(ProductsRepository);

  const { products, setProducts } = useProductsStore((state) => state);

  useEffect(() => {
    repo.All().then(setProducts);
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flex: 9 }}>
        <FlatList
          data={products}
          renderItem={({ item }) =>
            <View style={styles.item}>
              <SummaryListItem
                item={item}
                itemSelected={() => navigation.navigate(RootViews.ProductDetails, { product: item })}
                deleteRequested={() => repo.Delete(item.id).then(() => setProducts(products.filter(p => p.id !== item.id)))}
                exportRequested={() => clipboardExport.product(item)}
              />
            </View>
          }
          keyExtractor={product => product.id}
        />
      </View>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate(RootViews.ProductDetails, { product: repo.Create() })}
      >
        <Text style={styles.buttonText}>{t('product.addNew')}</Text>
      </Pressable>
    </View>
  );
}
