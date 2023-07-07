import { useInjection } from 'inversify-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import { Button, Portal, Snackbar, Text } from 'react-native-paper';
import { ProductsRepository } from '../../../core/repositories/products.repository';
import { Product } from '../../../domain/types/product/product';
import { RootViews } from '../../root-views.enum';
import { ExportToClipboard } from '../common/clipboard-export';
import { SummaryListItem } from '../common/list-item';
import { styles } from './products-view.style';
import { useProductsStore } from './products.store';
import { FormMode } from '../common/form-mode.enum';


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
        case 0: setSnackbarMessage(t('errors.product.fkViolation')); break;
        default: setSnackbarMessage(t('errors.product.cantDelete'));
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
                itemSelected={() => navigation.navigate(RootViews.ProductDetails, { product: item, mode: FormMode.Edit })}
                deleteRequested={() => tryDeleteProduct(item)}
                exportRequested={() => clipboardExport.product(item)}
              />
            </View>
          }
          keyExtractor={product => product.id}
        />
      </View>

      <Button
        style={styles.button}
        mode='outlined'
        onPress={() => navigation.navigate(RootViews.ProductDetails, { product: repo.Create(), mode: FormMode.New })}
      >
        <Text style={{ fontSize: 18 }}>{t('product.addNew')}</Text>
      </Button>

      <Portal>
        <Snackbar
          visible={snackbarMessage}
          onDismiss={() => setSnackbarMessage(null)}
          action={{
            label: t('common.ok')
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </View>
  );
}
