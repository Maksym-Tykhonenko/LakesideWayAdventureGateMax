import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import LakesideCircleButton from '../components/LakesideCircleButton';
import { fonts } from '../assets/fonts';

interface LakesideAboutWayProps {
    setLakesidePageNY: (screen: string) => void;
}

const LakesideAboutWay: React.FC<LakesideAboutWayProps> = ({ setLakesidePageNY }) => {
    const dimensions = Dimensions.get('window');
    const styles = lakesideStylesOfApp(dimensions);
    const [textHeight, setTextHeight] = useState(0);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <LakesideCircleButton
                    icon={require('../assets/icons/lakesideArrowLeftIcon.png')}
                    onPress={() => setLakesidePageNY('Lakeside Home Way')}
                    size={dimensions.width * 0.21}
                />
                <View style={styles.headerTitle}>
                    <Text style={styles.headerText}>
                        About
                    </Text>
                </View>
            </View>
            <Image
                source={require('../assets/icons/lakeSideAppIcon.png')}
                style={styles.appIcon}
                resizeMode='stretch'
            />
            <View style={styles.container}>
                <View style={styles.infoRow}>
                    <View
                        style={[
                            styles.verticalBar,
                            { height: textHeight }
                        ]}
                    />
                    <View style={styles.textContainer}>
                        <Text
                            style={styles.text}
                            onLayout={(event) => {
                                const { height } = event.nativeEvent.layout;
                                setTextHeight(height);
                            }}
                        >
                            Lakeside Way Adventure Gate helps you plan your walks across Canada in an easy and exciting way: an interactive map, a selection of top locations, detailed descriptions, interesting facts, and the ability to create your own "Lake Memories" — all in one app!
                        </Text>
                    </View>
                </View>
                <Image
                    source={require('../assets/images/lakesideWoman.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
        </SafeAreaView>
    );
};

const lakesideStylesOfApp = (dimensions: { width: number; height: number }) => StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        width: dimensions.width * 0.9341,
        marginBottom: dimensions.height * 0.01923,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        alignItems: 'center',
        backgroundColor: '#001938',
        justifyContent: 'center',
        marginLeft: dimensions.width * 0.04,
        height: dimensions.height * 0.14,
        flex: 1,
        borderRadius: dimensions.width * 0.1,
    },
    headerText: {
        fontFamily: fonts.sfProTextSemibold,
        fontSize: dimensions.width * 0.05,
        color: '#FFFFFF',
        textAlign: 'center',
        alignSelf: 'center',
    },
    appIcon: {
        width: dimensions.height * 0.4,
        height: dimensions.height * 0.4,
        alignSelf: 'center',
        borderRadius: dimensions.width * 0.07,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#001938',
        borderRadius: dimensions.width * 0.1,
        paddingHorizontal: dimensions.width * 0.04,
        marginHorizontal: dimensions.width * 0.03,
        marginTop: dimensions.height * 0.02,
        width: dimensions.width * 0.9,
        alignSelf: 'center',
        overflow: 'hidden',
    },
    infoRow: {
        paddingVertical: dimensions.height * 0.059,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    verticalBar: {
        backgroundColor: '#17498A',
        width: dimensions.width * 0.04,
        alignSelf: 'center',
        marginRight: dimensions.width * 0.0201,
        borderRadius: dimensions.width * 0.05,
    },
    textContainer: {
        flex: 1,
        marginRight: dimensions.width * 0.05,
    },
    text: {
        color: '#FFFFFF',
        fontSize: dimensions.width * 0.03,
        fontFamily: fonts.sfProTextRegular,
        maxWidth: dimensions.width * 0.5,
        zIndex: 555,
    },
    image: {
        width: dimensions.height * 0.25,
        height: dimensions.height * 0.25,
        position: 'absolute',
        right: -dimensions.width * 0.1,
        bottom: -dimensions.height * 0.025,
        zIndex: 10,
    },
});

export default LakesideAboutWay;
