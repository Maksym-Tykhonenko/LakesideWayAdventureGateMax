import React from 'react';
import { TouchableOpacity, View, Dimensions, Image, GestureResponderEvent, ImageSourcePropType, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { fonts } from '../assets/fonts';

type LakesideCircleButtonProps = {
    icon: ImageSourcePropType;
    onPress: (event: GestureResponderEvent) => void;
    disabled?: boolean;
    size?: number;
    bottomOffset?: number;
    btnWidth?: number;
    btnHeight?: number;
    btnText?: string;
};

const LakesideBasicButton: React.FC<LakesideCircleButtonProps> = ({
    icon,
    onPress,
    disabled,
    size,
    bottomOffset,
    btnWidth,
    btnHeight,
    btnText,
}) => {
    const screen = Dimensions.get('window');
    const btnSize = size ?? screen.width * 0.21;
    const dimensions = Dimensions.get('window');
    return (
        <TouchableOpacity
            style={{
                width: btnWidth,
                height: btnHeight,
                borderRadius: btnSize * 0.5,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: screen.width * 0.028, height: screen.height * 0.016 },
                shadowOpacity: 0.7,
                shadowRadius: 3.84,
                elevation: 5,
            }}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled}
        >
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: btnSize * 0.5,
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                }}
            >
                <LinearGradient
                    colors={['#FFFFFF', '#17498A']}
                    style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                    }}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
                <Image
                    source={icon}
                    style={{
                        width: btnSize * 0.37,
                        height: btnSize * 0.37,
                    }}
                    resizeMode="contain"
                />
                <Text style={{
                    fontFamily: fonts.sfProTextSemibold,
                    fontSize: dimensions.width * 0.035,
                    color: '#000000',
                    textAlign: 'center',
                    alignSelf: 'center',
                    marginLeft: dimensions.width * 0.01,
                }}>
                    {btnText}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default LakesideBasicButton;
