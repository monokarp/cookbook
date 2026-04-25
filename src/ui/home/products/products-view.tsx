import { Product } from '@cookbook/domain/types/product/product';
import { TestIds } from '@cookbook/ui/test-ids';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { ExportToClipboard } from '../../common/clipboard-export';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useServices } from '../../services-context';
import { EntityList } from '../../common/entity-list/entity-list';
import { FormMode } from '../../common/form-mode.enum';
import { useAppModals } from '../../common/modals/use-modals.hook';
import { RootStackParamList } from '../../navigation.types';
import { RootViews } from '../../root-views.enum';
import { useProductsStore } from './products.store';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList> };

export function ProductsView({ navigation }: Props) {
  const { t } = useTranslation();
  const clipboardExport = new ExportToClipboard(t);

  const { products: repo } = useServices();

  const { set: setProducts, filteredItems: filteredProducts, filter, deleteItem } = useProductsStore();

  const { toast } = useAppModals();

  async function tryDeleteProduct(item: Product) {
    try {
      await repo.Delete(item.id);

      deleteItem(item.id);
    } catch (e) {
      switch ((e as { code?: number }).code) {
        case 0: toast.show({ message: 'errors.product.fkViolation' }); break;
        default: toast.show({ message: 'errors.product.cantDelete' });
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
