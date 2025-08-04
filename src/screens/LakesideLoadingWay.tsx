import LakesideCircleAnimComponent from '../components/LakesideCircleAnimComponent';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import React, { useRef, useLayoutEffect, useCallback, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { loadUserData } from '../redux/userSlice';
import { UserContext } from '../context/UserContext';
import { SafeAreaView, ImageBackground, View, Animated, Dimensions } from 'react-native';

type NavParams = {
  LakesideOnboarding: undefined;
  LakesideHomeWay: undefined;
};

const LS_USER_FLAG = 'ls_user_flag';
const LS_USER_DATA = 'ls_user_data_';

const LakesideLoadingWay: React.FC = () => {
  const navigation = useNavigation<NavigationProp<NavParams>>();
  const { setUser } = useContext(UserContext);
  const dispatch = useDispatch();
  const { width, height } = Dimensions.get('window');
  const anim = useRef(new Animated.Value(0)).current;

  const handleInit = useCallback(async () => {
    let onboarding = false;
    try {
      const id = await DeviceInfo.getUniqueId();
      const userStorageKey = `${LS_USER_DATA}${id}`;
      const flag = await AsyncStorage.getItem(LS_USER_FLAG);
      const user = await AsyncStorage.getItem(userStorageKey);

      if (user) {
        setUser(JSON.parse(user));
      } else if (!flag) {
        onboarding = true;
        await AsyncStorage.setItem(LS_USER_FLAG, '1');
      }
    } catch {}
    
  }, [navigation, setUser]);

  useLayoutEffect(() => {
    handleInit();
    dispatch(loadUserData());
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, [handleInit, dispatch, anim]);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <ImageBackground
        source={require('../assets/images/lakesideAppBackground.png')}
        style={{
          position: 'absolute',
          height,
          flex: 1,
          width,
          bottom: 0, left: 0, top: 0, right: 0,
        }}
        resizeMode="stretch"
      />
      <Animated.Image
        source={require('../assets/icons/lakeSideAppIcon.png')}
        style={{
          width: width * 0.61,
          height: width * 0.61,
          alignSelf: 'center',
          borderRadius: width * 0.07,
          opacity,
        }}
        resizeMode='stretch'
      />
      <View
        style={{
          alignSelf: 'center',
          top: -height * 0.25,
        }}
      >
        <LakesideCircleAnimComponent />
      </View>
    </SafeAreaView>
  );
};

export default LakesideLoadingWay;