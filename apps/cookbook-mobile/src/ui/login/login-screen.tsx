import { TestIds } from '@cookbook/ui/test-ids';
import NetInfo from '@react-native-community/netinfo';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton, User } from '@react-native-google-signin/google-signin';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Environment } from '../env';
import { RootViews } from '../root-views.enum';
import { useSession } from './session.store';

GoogleSignin.configure({ webClientId: Environment.ClientID });

export function LoginScreen({ navigation, doSignOut }) {
  const [isSigninInProgress, setIsSigninInProgress] = useState(true);

  const { setUser } = useSession();

  async function trySilentSignIn() {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      if (await GoogleSignin.isSignedIn()) {
        const userInfo = await GoogleSignin.getCurrentUser();

        authFirebase(userInfo);

        finishLogin(userInfo);
      } else {
        await signIn();
      }
    } catch (e) {
      console.log('silent sign in error', e)
    }
  }

  async function authFirebase(userInfo: User) {
    const { isConnected } = await NetInfo.fetch();

    if (!isConnected) return;

    const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);

    await auth().signInWithCredential(googleCredential);
  }

  function finishLogin(userInfo: User) {
    setUser({ id: userInfo.user.id });

    navigation.navigate(RootViews.Loading);

    setIsSigninInProgress(false);
  }

  async function signIn() {
    setIsSigninInProgress(true);

    if (Environment.Type === 'Test') {
      setUser({ id: 'test_user_id' });

      navigation.navigate(RootViews.Loading);

      setIsSigninInProgress(false);
      return;
    }

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const userInfo = await GoogleSignin.signIn();

      await authFirebase(userInfo);

      finishLogin(userInfo);
    } catch (error) {
      console.log('login error', error);
    }
  };

  async function signOut() {
    if (await GoogleSignin.isSignedIn()) {
      await GoogleSignin.signOut();
    }

    setUser(null);
  }

  useEffect(() => {
    if (doSignOut) {
      signOut();
    } else {
      trySilentSignIn();
    }
  }, [doSignOut]);

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

