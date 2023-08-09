import { Product } from '@cookbook/domain/types/product/product';
import { TestIds } from '@cookbook/ui/test-ids';
import { useInjection } from 'inversify-react-native';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import { Button, Divider, Text, TextInput } from 'react-native-paper';
import { ProductsRepository } from '../../../core/repositories/products.repository';
import { ExportToClipboard } from '../../common/clipboard-export';
import { FormMode } from '../../common/form-mode.enum';
import { ModalsContext } from '../../common/modals/modals.context';
import { SummaryListItem } from '../../common/summary-list-item';
import { RootViews } from '../../root-views.enum';
import { styles } from "../entity-view.style";
import { useProductsStore } from './products.store';


export function ProductsView({ navigation }) {
  const { t } = useTranslation();
  const clipboardExport = new ExportToClipboard(t);

  const repo = useInjection(ProductsRepository);

  const { set: setProducts, filteredItems: filteredProducts, filter, deleteItem } = useProductsStore();

  const { toast } = useContext(ModalsContext);

  async function tryDeleteProduct(item: Product) {
    try {
      await repo.Delete(item.id);

      deleteItem(item.id);
    } catch (e) {
      switch (e.code) {
        case 0: toast(t('errors.product.fkViolation')); break;
        default: toast(t('errors.product.cantDelete'));
      }
    }
  }

  useEffect(() => {
    repo.All().then(setProducts);
  }, []);

  return (
    <View testID={TestIds.ProductsView.Container} style={styles.container}>
      <TextInput
        testID={TestIds.ProductsView.SearchInput}
        mode='flat'
        label={t('product.search.byName')}
        defaultValue=''
        onChange={event => filter(event.nativeEvent.text)}
      />

      <FlatList
        style={styles.list}
        data={filteredProducts}
        renderItem={({ item, index }) =>
          <View>
            <SummaryListItem
              item={item}
              itemTestId={TestIds.ProductsView.ListItem}
              index={index}
              itemSelected={() => navigation.navigate(RootViews.ProductDetails, { product: item, mode: FormMode.Edit })}
              deleteRequested={() => tryDeleteProduct(item)}
              exportRequested={() => clipboardExport.product(item)}
            />
            <Divider />
          </View>
        }
        keyExtractor={product => product.id}
      />

      <Button
        testID={TestIds.ProductsView.AddNewButton}
        style={styles.button}
        mode='contained-tonal'
        onPress={() => navigation.navigate(RootViews.ProductDetails, { product: repo.Create(), mode: FormMode.New })}
      >
        <Text style={{ fontSize: 18 }}>{t('product.addNew')}</Text>
      </Button>
    </View>
  );
}
