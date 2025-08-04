import {
    Animated,
    View,
    Dimensions,
    StyleSheet,
    Image,
    SafeAreaView,
    Text,
    Share,
    Platform,
} from 'react-native';
import { fonts } from '../assets/fonts';
import React, { useState, useRef, useEffect } from 'react';
import LakesideBasicButton from '../components/LakesideBasicButton';
import LakesideCircleButton from '../components/LakesideCircleButton';
import TypingText from '../components/TypingText';
import lakesideFactsData from '../assets/lakesideData/lakesideFactsData';

interface LakesideAboutWayProps {
    setLakesidePageNY: (screen: string) => void;
}

const LakesideFactsWay: React.FC<LakesideAboutWayProps> = ({ setLakesidePageNY }) => {
    const dimensions = Dimensions.get('window');
    const [textHeight, setTextHeight] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const [currentFact, setCurrentFact] = useState('');
    const [facts, setFacts] = useState([...lakesideFactsData]);
    const styles = lakesideStylesOfApp(dimensions);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * facts.length);
        setCurrentFact(facts[randomIndex]);
        setFacts(facts.filter((_, index) => index !== randomIndex));
    }, []);

    const generateNewFact = () => {
        if (facts.length === 0) {
            setFacts([...lakesideFactsData]);
        } else {
            const remainingFacts = facts.filter((fact) => fact !== currentFact);
            const randomIndex = Math.floor(Math.random() * remainingFacts.length);
            const newFact = remainingFacts[randomIndex];

            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setCurrentFact(newFact);
                setFacts(remainingFacts);
            });
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <LakesideCircleButton
                    icon={require('../assets/icons/lakesideArrowLeftIcon.png')}
                    onPress={() => setLakesidePageNY('Lakeside Home Way')}
                    size={dimensions.width * 0.21}
                />
                <View style={styles.headerTitle}>
                    <Image
                        source={require('../assets/icons/lakeSideAppIcon.png')}
                        style={styles.headerIcon}
                        resizeMode='stretch'
                    />
                    <Text style={styles.headerText}>
                        Facts
                    </Text>
                </View>
            </View>
            <Image
                source={require('../assets/images/factsImage.png')}
                style={styles.topImage}
                resizeMode='stretch'
            />

            <View style={styles.container}>
                <View style={styles.infoRow}>
                    <View
                        style={[
                            styles.verticalBar,
                            { height: textHeight > 0 ? textHeight : dimensions.width * 0.08 }
                        ]}
                    />
                    <View style={styles.textContainer}>
                        <TypingText
                            text={currentFact}
                            speed={50}
                            style={styles.text}
                            onLayout={(event) => {
                                const { height } = event.nativeEvent.layout;
                                setTextHeight(height);
                            }}
                        />
                    </View>
                </View>

                <View style={styles.buttonRow}>
                    <LakesideBasicButton
                        icon={require('../assets/icons/lakesideArrowRightIcon.png')}
                        // onPress={generateNewFact}
                        onPress={() => {
                            generateNewFact();
                        }}
                        btnWidth={dimensions.width * 0.4}
                        btnHeight={dimensions.height * 0.07}
                        btnText="Continue read"
                    />
                </View>
            </View>

            <View style={styles.shareRow}>
                <LakesideCircleButton
                    icon={require('../assets/icons/lakesideShareIcon.png')}
                    onPress={() => {
                        Share.share({
                            message: `Check out this amazing fact: ${currentFact}`,
                        });
                    }}
                    size={dimensions.width * 0.21}
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
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: dimensions.height * 0.01923,
    },
    headerTitle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: dimensions.width * 0.04,
        height: dimensions.height * 0.14,
        backgroundColor: '#001938',
        borderRadius: dimensions.width * 0.1,
        flexDirection: 'row',
    },
    headerIcon: {
        width: dimensions.height * 0.086,
        height: dimensions.height * 0.086,
        alignSelf: 'center',
        borderRadius: dimensions.width * 0.07,
        marginRight: dimensions.width * 0.04,
    },
    headerText: {
        fontFamily: fonts.sfProTextSemibold,
        fontSize: dimensions.width * 0.05,
        color: '#FFFFFF',
        textAlign: 'center',
        alignSelf: 'center',
    },
    topImage: {
        width: dimensions.width * 0.9341,
        height: dimensions.height * 0.3,
        alignSelf: 'center',
        borderRadius: dimensions.width * 0.07,
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#001938',
        borderRadius: dimensions.width * 0.1,
        paddingHorizontal: dimensions.width * 0.04,
        marginHorizontal: dimensions.width * 0.03,
        marginTop: dimensions.height * 0.02,
        width: dimensions.width * 0.9,
        alignSelf: 'center',
        overflow: 'hidden',
        paddingVertical: dimensions.height * 0.031,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    verticalBar: {
        backgroundColor: '#17498A',
        width: dimensions.width * 0.031,
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
        fontSize: dimensions.width * 0.04,
        fontFamily: fonts.sfProTextSemibold,
        maxWidth: dimensions.width * 0.88,
        zIndex: 555,
    },
    buttonRow: {
        alignSelf: 'flex-start',
        marginTop: dimensions.height * 0.04,
    },
    shareRow: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: dimensions.height * 0.05,
        alignItems: 'center',
        justifyContent: 'center',
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

export default LakesideFactsWay;
