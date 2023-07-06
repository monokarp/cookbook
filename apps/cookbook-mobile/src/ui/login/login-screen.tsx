import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { RootViews } from '../root-views.enum';
import { Button } from 'react-native-paper';

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

