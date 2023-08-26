import { Product } from '@cookbook/domain/types/product/product';
import { TestIds } from '@cookbook/ui/test-ids';
import { useInjection } from 'inversify-react-native';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { ProductsRepository } from '../../../core/repositories/products.repository';
import { ExportToClipboard } from '../../common/clipboard-export';
import { EntityList } from '../../common/entity-list/entity-list';
import { FormMode } from '../../common/form-mode.enum';
import { useAppModals } from '../../common/modals/modals.context';
import { RootViews } from '../../root-views.enum';
import { useProductsStore } from './products.store';


export function ProductsView({ navigation }) {
  const { t } = useTranslation();
  const clipboardExport = new ExportToClipboard(t);

  const repo = useInjection(ProductsRepository);

  const { set: setProducts, filteredItems: filteredProducts, filter, deleteItem } = useProductsStore();

  const { toast } = useAppModals();

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
    <View testID={TestIds.ProductsView.Container} style={{ flexGrow: 1 }}>
      <TextInput
        testID={TestIds.ProductsView.SearchInput}
        mode='flat'
        label={t('product.search.byName')}
        defaultValue=''
        onChange={event => filter(event.nativeEvent.text)}
      />

      <EntityList<Product>
        items={filteredProducts}
        itemTestId={TestIds.ProductsView.ListItem}
        addNewButtonTestId={TestIds.ProductsView.AddNewButton}
        addNewButtonText={t('product.addNew')}
        select={item => navigation.navigate(RootViews.ProductDetails, { product: item, mode: FormMode.Edit })}
        addNew={() => navigation.navigate(RootViews.ProductDetails, { product: repo.Create(), mode: FormMode.New })}
        remove={item => tryDeleteProduct(item)}
        exportToClipboard={item => clipboardExport.product(item)}
      />
    </View>
  );
}
