import LakesideMemoriesWay from './LakesideMemoriesWay';
import {
  Image,
  View,
  InteractionManager,
  Platform,
  Text,
  Animated,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  StyleSheet,
} from 'react-native';
import LakesideAboutWay from './LakesideAboutWay';
import LakesideOverviewMapWay from './LakesideOverviewMapWay';
import { fonts } from '../assets/fonts';
import LakesideFactsWay from './LakesideFactsWay';
import LakesideTopLocationsWay from './LakesideTopLocationsWay';
import React, { useEffect, useState, useRef } from 'react';
import LakesideCircleButton from '../components/LakesideCircleButton';

type LakesideScreen =
  | 'Lakeside Home Way'
  | 'Overview map'
  | 'Saved Place'
  | 'Top locations'
  | 'Memories'
  | 'Facts'
  | 'About';

interface LakesideButtonConfig {
  lakesideTouchButtonTitle: string;
  lakesideIconForCircleComponent: any;
}

const lakesideButtons: LakesideButtonConfig[] = [
  {
    lakesideTouchButtonTitle: 'Top locations',
    lakesideIconForCircleComponent: require('../assets/icons/iconsOfTheHomeLakeButtons/topLocations.png'),
  },
  {
    lakesideTouchButtonTitle: 'Overview map',
    lakesideIconForCircleComponent: require('../assets/icons/iconsOfTheHomeLakeButtons/lakesideMapIcon.png'),
  },
  {
    lakesideTouchButtonTitle: 'Memories',
    lakesideIconForCircleComponent: require('../assets/icons/iconsOfTheHomeLakeButtons/lakesidememoirs.png'),
  },
  {
    lakesideTouchButtonTitle: 'Saved Place',
    lakesideIconForCircleComponent: require('../assets/icons/iconsOfTheHomeLakeButtons/lakesideSavedPlaces.png'),
  },
  {
    lakesideTouchButtonTitle: 'Facts',
    lakesideIconForCircleComponent: require('../assets/icons/iconsOfTheHomeLakeButtons/lakesideFacts.png'),
  },
  {
    lakesideTouchButtonTitle: 'About',
    lakesideIconForCircleComponent: require('../assets/icons/iconsOfTheHomeLakeButtons/lakesideAbout.png'),
  },
];

const getStyles = (dimensions: { width: number; height: number }) =>
  StyleSheet.create({
    root: {
      backgroundColor: 'black',
      flex: 1,
      width: '100%',
      height: dimensions.height,
    },
    background: {
      position: 'absolute',
      height: dimensions.height,
      flex: 1,
      width: dimensions.width,
      bottom: 0,
      left: 0,
      top: 0,
      right: 0,
    },
    safeArea: {
      alignItems: 'center',
      marginTop: Platform.OS === 'android' ? dimensions.height * 0.03 : 0,
      alignSelf: 'center',
      width: dimensions.width * 0.93,
      flex: 1,
    },
    card: {
      alignSelf: 'center',
      width: dimensions.width * 0.93414,
      backgroundColor: '#001938',
      borderRadius: dimensions.width * 0.1,
      padding: dimensions.width * 0.02,
      marginTop: dimensions.height * 0.12,
      paddingTop: dimensions.height * 0.16,
    },
    appIcon: {
      width: dimensions.height * 0.21,
      height: dimensions.height * 0.21,
      alignSelf: 'center',
      borderRadius: dimensions.width * 0.07,
      position: 'absolute',
      top: -dimensions.width * 0.21,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: dimensions.width * 0.023,
      marginBottom: dimensions.width * 0.08,
    },
    buttonText: {
      fontFamily: fonts.sfProTextSemibold,
      fontSize: dimensions.width * 0.03,
      color: '#FFFFFF',
      textAlign: 'center',
      marginTop: dimensions.width * 0.025,
      alignSelf: 'center',
    },
    greetingImage: {
      width: dimensions.width * 0.93414,
      height: dimensions.height * 0.23,
      alignSelf: 'center',
      marginTop: dimensions.height * 0.021,
    },
    slidingScreens: {
      flex: 1,
      flexDirection: 'row',
      width: dimensions.width * 2,
    },
    slidingScreen: {
      width: dimensions.width,
    },
    slidingScreenAbsolute: {
      width: dimensions.width,
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
    },
    animatedView: {
      flex: 1,
    },
  });

const LakesideHomeWay: React.FC = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  const [pendingScreen, setPendingScreen] = useState<LakesideScreen | null>(null);
  const [hasPendingUpdate, setHasPendingUpdate] = useState(false);
  const [lakesidePrevScreen, setLakesidePrevScreen] = useState<LakesideScreen | null>(null);
  // Slide animation for screen transitions
  const lakesideSlideAnim = useRef(new Animated.Value(0)).current;
  const activeScreenOpacity = useRef(new Animated.Value(1)).current; // Прозорість активної сторінки
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lakesideNextScreen, setLakesideNextScreen] = useState<LakesideScreen | null>(null);
  const [lakesidePageNY, setLakesidePageNY] = useState<LakesideScreen>('Lakeside Home Way');

  const lakesideTransitionToScreen = (screen: LakesideScreen) => {
    setLakesidePrevScreen(lakesidePageNY);
    setLakesideNextScreen(screen);
    setPendingScreen(screen);
    setIsTransitioning(true);
    lakesideSlideAnim.setValue(0);
    activeScreenOpacity.setValue(1);

    Animated.parallel([
      Animated.spring(lakesideSlideAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(activeScreenOpacity, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setLakesidePageNY(screen);
      setLakesidePrevScreen(null);
      setLakesideNextScreen(null);
      setPendingScreen(null);
      setIsTransitioning(false);
      activeScreenOpacity.setValue(1);
    });
  };

  useEffect(() => {
    if (!isTransitioning && pendingScreen && hasPendingUpdate) {
      InteractionManager.runAfterInteractions(() => {
        setLakesidePageNY(pendingScreen);
        setLakesidePrevScreen(null);
        setLakesideNextScreen(null);
        setPendingScreen(null);
        setHasPendingUpdate(false);
        lakesideSlideAnim.setValue(0);
      });
    }
  }, [isTransitioning, pendingScreen, hasPendingUpdate]);

  const styles = getStyles(dimensions);

  const renderLakesideSlidingScreens = () => {
    if (!lakesideNextScreen || !lakesidePrevScreen) {
      return (
        <Animated.View style={[styles.animatedView, { opacity: activeScreenOpacity }]}>
          {renderLakesideScreen(lakesidePageNY)}
        </Animated.View>
      );
    }
    const width = dimensions.width;
    const translateXPrev = lakesideSlideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -width],
    });
    const translateXNext = lakesideSlideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [width, 0],
    });
    return (
      <View style={styles.slidingScreens}>
        <Animated.View style={[styles.slidingScreen, { transform: [{ translateX: translateXPrev }] }]}>
          {renderLakesideScreen(lakesidePrevScreen)}
        </Animated.View>
        <Animated.View style={[styles.slidingScreenAbsolute, { transform: [{ translateX: translateXNext }] }]}>
          {renderLakesideScreen(lakesideNextScreen)}
        </Animated.View>
      </View>
    );
  };

  function renderLakesideScreen(screen: LakesideScreen | null) {
    if (!screen) return null;
    switch (screen) {
      case 'Lakeside Home Way':
        return (
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.card}>
              <Image
                source={require('../assets/icons/lakeSideAppIcon.png')}
                style={styles.appIcon}
                resizeMode='stretch'
              />
              <View style={styles.buttonRow}>
                {lakesideButtons.map((button, index) => (
                  <View key={index} style={styles.buttonContainer}>
                    <LakesideCircleButton
                      icon={button.lakesideIconForCircleComponent}
                      onPress={() => lakesideTransitionToScreen(button.lakesideTouchButtonTitle as LakesideScreen)}
                      size={dimensions.width * 0.21}
                    />
                    <Text style={styles.buttonText}>
                      {button.lakesideTouchButtonTitle}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <Image
              source={require('../assets/images/lakesideHomeImageGreating.png')}
              style={styles.greetingImage}
              resizeMode='stretch'
            />
          </SafeAreaView>
        );
      case 'Saved Place':
        return (
          <LakesideTopLocationsWay setLakesidePageNY={lakesideTransitionToScreen} lakesidePage={lakesidePageNY} mainStyles={{}} />
        );
      case 'Top locations':
        return (
          <LakesideTopLocationsWay setLakesidePageNY={lakesideTransitionToScreen} lakesidePage={lakesidePageNY} mainStyles={{}} />
        );
      case 'Overview map':
        return (
          <LakesideOverviewMapWay setLakesidePageNY={lakesideTransitionToScreen} lakesidePage={lakesidePageNY} mainStyles={{}} />
        );
      case 'Facts':
        return (
          <LakesideFactsWay setLakesidePageNY={lakesideTransitionToScreen} mainStyles={{}} />
        );
      case 'Memories':
        return (
          <LakesideMemoriesWay setLakesidePageNY={lakesideTransitionToScreen} mainStyles={{}} />
        );
      case 'About':
        return (
          <LakesideAboutWay
            setLakesidePageNY={lakesideTransitionToScreen}
            mainStyles={{}} // Provide an empty or appropriate style object
          />
        );
      default:
        return null;
    }
  }

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../assets/images/lakesideAppBackground.png')}
        style={styles.background}
        resizeMode="stretch"
      />
      {lakesidePageNY !== 'Lakeside Home Way' && (
        <View style={{
          alignItems: 'center',
          marginTop: Platform.OS === 'android' ? dimensions.height * 0.03 : 0,
          alignSelf: 'center',
          width: dimensions.width * 0.93,
        }} />
      )}
      {isTransitioning && lakesidePrevScreen && lakesideNextScreen
        ? renderLakesideSlidingScreens()
        : renderLakesideScreen(lakesidePageNY)}
    </View>
  );
};

export default LakesideHomeWay;
