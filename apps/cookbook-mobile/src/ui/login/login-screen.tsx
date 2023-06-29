import { useTranslation } from 'react-i18next';
import { Button, Text, View } from 'react-native';

export function LoginScreen({ navigation }) {
  const {t} = useTranslation();
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title={t('common.login')}
        onPress={() =>
          navigation.navigate('home')
        }
      />
    </View>
  );
}

