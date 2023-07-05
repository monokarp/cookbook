import { ProductsRepository } from 'apps/cookbook-mobile/src/core/repositories/products.repository';
import { useInjection } from 'inversify-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, View } from 'react-native';
import { Portal, Snackbar, Text } from 'react-native-paper';
import { RootViews } from '../../root-views.enum';
import { SummaryListItem } from '../common/list-item';
import { styles } from './products-view.style';
import { useProductsStore } from './products.store';
import { ExportToClipboard } from '../common/clipboard-export';
import { Product } from 'apps/cookbook-mobile/src/domain/types/product/product';

export function ProductsView({ navigation }) {
  const { t } = useTranslation();
  const clipboardExport = new ExportToClipboard(t);

  const repo = useInjection(ProductsRepository);

  const { products, setProducts } = useProductsStore((state) => state);
  const [snackbarMessage, setSnackbarMessage] = useState(null);

  async function tryDeleteProduct(item: Product) {
    try {
      await repo.Delete(item.id);

      setProducts(products.filter(p => p.id !== item.id));
    } catch (e) {
      switch (e.code) {
        case 0: setSnackbarMessage('There are recipes that use this product. Please remove them first.'); break;
        default: setSnackbarMessage('Unable to delete this product');
      }

      setTimeout(() => setSnackbarMessage(null), 3000);
    }
  }

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
                deleteRequested={() => tryDeleteProduct(item)}
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

      <Portal>
        <Snackbar
          visible={snackbarMessage}
          onDismiss={() => setSnackbarMessage(null)}
          action={{
            label: 'Ok'
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </View>
  );
}
