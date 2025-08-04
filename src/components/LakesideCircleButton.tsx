import React from 'react';
import { TouchableOpacity, View, Dimensions, Image, GestureResponderEvent, ImageSourcePropType } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type LakesideCircleButtonProps = {
    icon: ImageSourcePropType;
    onPress: (event: GestureResponderEvent) => void;
    disabled?: boolean;
    size?: number;
    bottomOffset?: number;
    tintIconColor?: string;      // Додаємо tintIconColor
    tintButtonColor?: string;    // Додаємо tintButtonColor
};

const LakesideCircleButton: React.FC<LakesideCircleButtonProps> = ({
    icon,
    onPress,
    disabled,
    size,
    bottomOffset,
    tintIconColor,
    tintButtonColor,
}) => {
    const screen = Dimensions.get('window');
    const btnSize = size ?? screen.width * 0.21;
    const btnBottom = bottomOffset ?? screen.height * 0.08;
    return (
        <TouchableOpacity
            style={{
                width: btnSize,
                height: btnSize,
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
                }}
            >
                <LinearGradient
                    colors={tintButtonColor ? ['#17498A', '#17498A'] : ['#FFFFFF', '#17498A']}
                    style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                    }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                <Image
                    source={icon}
                    style={{
                        width: btnSize * 0.48,
                        height: btnSize * 0.48,
                        tintColor: tintIconColor ? tintIconColor : 'null', // Додаємо tintColor
                    }}
                    resizeMode="contain"
                />
            </View>
        </TouchableOpacity>
    );
};

export default LakesideCircleButton;
