import React, {useState, useRef, useCallback, useEffect, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const Login = () => {
  // const dispatch = useDispatch();
  const token = "token value";
  const lastInteraction = useRef(new Date());
  const [inactive, setInactive] = useState(null);;
  const inactivityTimer = useRef(false);
  const waitForInactivity = useRef(0);

  const INACTIVITY_CHECK_INTERVAL_MS = 1000;

  const [user, setUser] = useState({});

  useEffect(() => {
    if (token) {
      //  50 secs
      const autologoutTime = 50;
      waitForInactivity.current = autologoutTime * 1000;
    }
  }, [token, waitForInactivity.current]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '832552334832-f366nl16c0dcncuq0271rg10mao2pj8j.apps.googleusercontent.com',
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      iosClientId: '', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
    isSignedIn();
  }, []);

  const checkInactive = useCallback(() => {
    console.log(inactivityTimer);
    if (inactivityTimer.current) {
      return;
    }
    inactivityTimer.current = setInterval(() => {
      if (
        Math.abs(new Date().valueOf() - lastInteraction.current.valueOf()) >=
        waitForInactivity.current
      ) {
        setIsInactive();
      }
    }, INACTIVITY_CHECK_INTERVAL_MS);
  }, []);

  useEffect(() => {
    if (token) {
      checkInactive();
    }
  }, [checkInactive]);

  const setIsActive = useCallback(() => {
    lastInteraction.current = new Date();
    if (inactive) {
      setInactive(null);
    }

    if (token) {
      checkInactive();
    }
  }, []);

  const setIsInactive = () => {
    const a = new Date();
    setInactive(a);
    signOut();
    console.log("successful");
    clearInterval(inactivityTimer.current);
    inactivityTimer.current = false;
  };

  const handleMoveShouldSetPanResponder = useCallback(() => {
    setIsActive();
    return false;
  }, [setIsActive]);

  const handleStartShouldSetPanResponder = useCallback(() => {
    setIsActive();
    return false;
  }, [setIsActive]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: handleStartShouldSetPanResponder,
        onMoveShouldSetPanResponder: handleMoveShouldSetPanResponder,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponderCapture: () => false,
        onPanResponderTerminationRequest: () => true,
        onShouldBlockNativeResponder: () => false,
      }),
    [],
  );

  const GoogleSingUp = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      setUser(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        alert('User cancelled the login flow !');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signin in progress');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Google play services not available or outdated !');
        // play services not available or outdated
      } else {
        console.log(error);
      }
    }
  };

  const isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (!!isSignedIn) {
      getCurrentUserInfo();
    } else {
      console.log('Please Login');
    }
  };

  const getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      setUser(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        alert('User has not signed in yet');
        console.log('User has not signed in yet');
      } else {
        alert("Something went wrong. Unable to get user's info");
        console.log("Something went wrong. Unable to get user's info");
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUser({}); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View {...panResponder.panHandlers}>
        
      {!user.idToken ? (<View>
          <Text style={styles.text1}>Login</Text>
        <GoogleSigninButton
          style={{width: 192, height: 48}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={GoogleSingUp}
        />
      </View>) : (
          <View>
        <Text style={styles.text4}>WELCOME {user.user.givenName} !!</Text>
        <TouchableOpacity onPress={signOut}>
          <Text style={styles.text2}>Logout</Text>
        </TouchableOpacity>
        <Text style={styles.text3}>If a user is inactive, you will automatically logout after 50seconds.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    text1: {
        fontSize: 30,
        color: "black",
        alignContent: "center",
        paddingBottom: 20,
        left: 60,
    },
    text2: {
        fontSize: 30,
        color: "black",
        paddingBottom: 20,
        left: 120,
        border: 1,
        borderColor: "black",
        borderRadius: 10
    },
    text3: {
        fontSize: 20,
        left: 10,
    },
    text4: {
        fontSize: 30,
        color: "black",
        // left: 80
    }
  });
export default Login;
