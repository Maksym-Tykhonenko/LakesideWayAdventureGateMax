import { View, Dimensions, Animated, TouchableOpacity, Image, GestureResponderEvent, ImageSourcePropType } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import LakesideCircleButton from '../components/LakesideCircleButton';

type LakesideNextButtonProps = {
    icon: ImageSourcePropType;
    onPress: (event: GestureResponderEvent) => void;
    disabled?: boolean;
    size?: number;
    bottomOffset?: number;
};

const LakesideOnboarding = () => {
    const [lakesideScreen] = useState(Dimensions.get('window'));
    const navigation = useNavigation();

    const [lakesideIsMoving, setLakesideIsMoving] = useState(false);
    const [lakesideActiveIndex, setLakesideActiveIndex] = useState(0);

    const lakesideImages = [
        require('../assets/images/lakesideOnboardings/lakesideOnboarding2.png'),
        require('../assets/images/lakesideOnboardings/lakesideOnboarding3.png'),
        require('../assets/images/lakesideOnboardings/lakesideOnboarding4.png'),
    ];

    const lakesideAnimCurrent = useRef(new Animated.Value(0)).current;
    const lakesideAnimNext = useRef(new Animated.Value(0)).current;

    const lakesidePress = () => {
        if (lakesideIsMoving) return;
        if (lakesideActiveIndex < lakesideImages.length - 1) {
            setLakesideIsMoving(true);
            lakesideAnimCurrent.setValue(0);
            lakesideAnimNext.setValue(0);
            Animated.parallel([
                Animated.timing(lakesideAnimCurrent, {
                    toValue: 1,
                    duration: 340,
                    useNativeDriver: true,
                }),
                Animated.timing(lakesideAnimNext, {
                    toValue: 1,
                    duration: 340,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setLakesideActiveIndex(lakesideActiveIndex + 1);
                lakesideAnimCurrent.setValue(0);
                lakesideAnimNext.setValue(0);
                setLakesideIsMoving(false);
            });
        } else {
            // @ts-expect-error (for TS, safe for JS)
            navigation.replace && navigation.replace('LakesideHomeWay');
        }
    };

    const lakesideCurrentImg = lakesideImages[lakesideActiveIndex];
    const lakesideNextImg = lakesideImages[lakesideActiveIndex + 1];

    return (
        <View style={{
            backgroundColor: 'black',
            flex: 1,
            overflow: 'hidden',
        }}>
            <Animated.Image
                source={lakesideCurrentImg}
                style={{
                    position: 'absolute',
                    width: lakesideScreen.width,
                    height: lakesideScreen.height,
                    top: 0,
                    left: 0,
                    opacity: lakesideAnimCurrent.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0],
                    }),
                    transform: [{
                        translateY: lakesideAnimCurrent.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -40],
                        }),
                    }],
                }}
                resizeMode="cover"
            />
            {lakesideNextImg && (
                <Animated.Image
                    source={lakesideNextImg}
                    style={{
                        position: 'absolute',
                        width: lakesideScreen.width,
                        height: lakesideScreen.height,
                        top: 0,
                        left: 0,
                        opacity: lakesideAnimNext,
                        transform: [{
                            translateY: lakesideAnimNext.interpolate({
                                inputRange: [0, 1],
                                outputRange: [40, 0],
                            }),
                        }],
                    }}
                    resizeMode="cover"
                />
            )}

            <View style={{
                position: 'absolute',
                alignSelf: 'center',
                bottom: lakesideScreen.height * 0.08,
            }}>
                <LakesideCircleButton
                    icon={require('../assets/icons/lakesideArrowRightIcon.png')}
                    onPress={lakesidePress}
                    disabled={lakesideIsMoving}
                    size={lakesideScreen.width * 0.21}
                    bottomOffset={lakesideScreen.height * 0.08}
                />
            </View>
        </View>
    );
};

export default LakesideOnboarding;