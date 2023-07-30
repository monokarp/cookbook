import { TestIds } from '@cookbook/ui/test-ids';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton, User } from '@react-native-google-signin/google-signin';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { RootViews } from '../root-views.enum';
import { useSession } from './session.store';
import { Environment } from '../env';

GoogleSignin.configure({
  webClientId: '1011563761916-245cqtlrfd9frupq9i7so8n2ul5rc8t7.apps.googleusercontent.com'
});

export function LoginScreen({ navigation }) {
  const [isSigninInProgress, setIsSigninInProgress] = useState(true);

  const { setUser } = useSession();

  async function trySilentSignIn() {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    if (await GoogleSignin.isSignedIn()) {
      const userInfo = await GoogleSignin.signInSilently();

      await authFirebase(userInfo);
    }

    setIsSigninInProgress(false);
  }

  async function authFirebase(userInfo: User) {
    console.log('user info', JSON.stringify(userInfo));

    const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);

    await auth().signInWithCredential(googleCredential);

    setUser({ id: userInfo.user.id });

    navigation.navigate(RootViews.Loading);
  }

  async function signIn() {
    setIsSigninInProgress(true);

    if (Environment.Type === 'Test') {
      setUser({ id: 'test_user_id' });

      navigation.navigate(RootViews.Loading);

      return;
    }

    try {
      const userInfo = await GoogleSignin.signIn();

      await authFirebase(userInfo);
    } catch (error) {
      console.log('login error', error);
    }

    setIsSigninInProgress(false);
  };

  useEffect(() => {
    trySilentSignIn().catch(e => console.log('silent sign in', e));
  }, []);

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

