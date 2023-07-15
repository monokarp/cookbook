import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { RootViews } from '../root-views.enum';
import { TestIds } from '../test-ids.enum';

export function LoginScreen({ navigation }) {
  const { t } = useTranslation();

  return (
    <View testID={TestIds.LoginView} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        testID={TestIds.LoginButton}
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

