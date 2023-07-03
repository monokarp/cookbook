import { useTranslation } from 'react-i18next';
import { Button, View } from 'react-native';
import { RootViews } from '../root-views.enum';

export function LoginScreen({ navigation }) {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title={t('common.login')}
        onPress={() =>
          navigation.navigate(RootViews.Home)
        }
      />
    </View>
  );
}

