import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button } from 'react-native-paper';
import { RootViews } from '../root-views.enum';

export function LoginScreen({ navigation }) {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        mode='outlined'
        onPress={() =>
          navigation.navigate(RootViews.Home)
        }
      >
        {t('common.login')}
      </Button>
    </View>
  );
}

