import { Product } from '@cookbook/domain/types/product/product';
import { TestIds } from '@cookbook/ui/test-ids.enum';
import { useInjection } from 'inversify-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import { Button, Portal, Snackbar, Text, TextInput } from 'react-native-paper';
import { ProductsRepository } from '../../../core/repositories/products.repository';
import { RootViews } from '../../root-views.enum';
import { ExportToClipboard } from '../common/clipboard-export';
import { FormMode } from '../common/form-mode.enum';
import { SummaryListItem } from '../common/summary-list-item';
import { styles } from './products-view.style';
import { useProductsStore } from './products.store';


export function ProductsView({ navigation }) {
  const { t } = useTranslation();
  const clipboardExport = new ExportToClipboard(t);

  const repo = useInjection(ProductsRepository);

  const { set: setProducts, filteredItems: filteredProducts, filter, deleteItem } = useProductsStore();

  const [snackbarMessage, setSnackbarMessage] = useState(null);

  async function tryDeleteProduct(item: Product) {
    try {
      await repo.Delete(item.id);

      deleteItem(item.id);
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
    <View testID={TestIds.ProductsView.Container} style={styles.container}>
      <TextInput
        testID={TestIds.ProductsView.SearchInput}
        mode='outlined'
        label={t('product.search.byName')}
        defaultValue=''
        onChange={event => filter(event.nativeEvent.text)}
      />

      <View style={{ flex: 9 }}>
        <FlatList
          data={filteredProducts}
          renderItem={({ item, index }) =>
            <View style={styles.item}>
              <SummaryListItem
                item={item}
                index={index}
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
        testID={TestIds.ProductsView.AddNewButton}
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
          <Text style={{ color: 'white' }} testID={TestIds.ProductsView.ToastMessage}>{snackbarMessage}</Text>
        </Snackbar>
      </Portal>
    </View>
  );
}
