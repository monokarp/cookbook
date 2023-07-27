import { TestIds } from '@cookbook/ui/test-ids';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useState } from 'react';
import { View } from 'react-native';
import { RootViews } from '../root-views.enum';
import { useSession } from './session.store';
import { Environment } from '../env';

GoogleSignin.configure({
  webClientId: '1011563761916-245cqtlrfd9frupq9i7so8n2ul5rc8t7.apps.googleusercontent.com'
});

export function LoginScreen({ navigation }) {
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);

  const { setUser } = useSession();

  async function signIn() {
    setIsSigninInProgress(true);

    if (Environment.Type === 'Test') {
      setUser({ id: 'test_user_id' });

      navigation.navigate(RootViews.Loading);

      return;
    }

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const userInfo = await GoogleSignin.isSignedIn()
        ? await GoogleSignin.signInSilently()
        : await GoogleSignin.signIn();

      console.log('user info', JSON.stringify(userInfo));

      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);

      await auth().signInWithCredential(googleCredential);

      setUser({ id: userInfo.user.id });

      navigation.navigate(RootViews.Loading);
    } catch (error) {
      console.log('error', error);
    }

    setIsSigninInProgress(false);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <GoogleSigninButton
        testID={TestIds.Login.LoginButton}
        size={GoogleSigninButton.Size.Standard}
        color={GoogleSigninButton.Color.Light}
        onPress={signIn}
        disabled={isSigninInProgress}
      />
    </View >
  );
}

