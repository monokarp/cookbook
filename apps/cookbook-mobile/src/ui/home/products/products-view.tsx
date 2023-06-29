import { useInjection } from 'inversify-react-native';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ProductsService } from '../../../app/services/products.service';
import { RootViews } from '../../root-views.enum';
import { styles } from './products-view.style';
import { useProductsStore } from './products.store';

export function ProductsView({ navigation }) {
  const { t } = useTranslation();
  const service = useInjection(ProductsService);

  const { products, setProducts } = useProductsStore((state) => state);

  useEffect(() => {
    service.All().then(setProducts);
  }, [service, setProducts]);

  return (
    <View style={styles.container}>
      <View style={{ flex: 9 }}>
        <FlatList
          data={products}
          renderItem={({ item }) =>
            <Pressable
              style={styles.item}
              onPress={() => navigation.navigate(RootViews.ProductDetails, { product: item })}
            >
              <Text style={{ fontWeight: '800' }}>{item.name}</Text>
              <Text>{t('product.pricing.label', { pricePerGram: item.pricePerGram() })}</Text>
            </Pressable>
          }
          keyExtractor={product => product.id}
        />
      </View>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate(RootViews.ProductDetails, { product: service.Create() })}
      >
        <Text style={styles.buttonText}>{t('product.addNew')}</Text>
      </Pressable>
    </View>
  );
}
