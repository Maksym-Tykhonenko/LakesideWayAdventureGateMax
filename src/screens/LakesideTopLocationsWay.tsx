import MapView, { Marker } from 'react-native-maps';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    Animated,
    Dimensions,
    ActivityIndicator,
    Image,
    SafeAreaView,
    Text,
    StyleSheet,
    Share,
    View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import lakeTopSdataSide from '../assets/lakesideData/lakeTopSdataSide';
import lakesideFactsData from '../assets/lakesideData/lakesideFactsData';
import LakesideCircleButton from '../components/LakesideCircleButton';

import { fonts } from '../assets/fonts';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface LakesideTopLocationsWayProps {
    setLakesidePageNY: (screen: string) => void;
    lakesidePage: string;
}

const LakesideTopLocationsWay: React.FC<LakesideTopLocationsWayProps> = ({ setLakesidePageNY, lakesidePage }) => {
    const dimensions = Dimensions.get('window');
    const [isLoading, setIsLoading] = useState(true);
    const [textHeight, setTextHeight] = useState(0);
    type LakeItemType = typeof lakeTopSdataSide[number];
    const [savedLakesides, setSavedLakesides] = useState<LakeItemType[]>([]);
    const [selectedLake, setSelectedLake] = useState<LakeItemType | null>(null);
    const styles = lakesideStylesOfApp(dimensions);
    const [showMap, setShowMap] = useState(false);
    const [isLakeOpened, setIsLakeOpened] = useState(false);
    const [slideDirection, setSlideDirection] = useState<'in' | 'out'>('in');

    const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
    useEffect(() => {
        if (isLakeOpened) {
            setSlideDirection('in');
            slideAnim.setValue(Dimensions.get('window').width);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 350,
                useNativeDriver: true,
            }).start();
        } else {
            setSlideDirection('out');
            slideAnim.setValue(0);
            Animated.timing(slideAnim, {
                toValue: Dimensions.get('window').width,
                duration: 350,
                useNativeDriver: true,
            }).start();
        }
    }, [isLakeOpened]);

    const mapFadeAnim = useRef(new Animated.Value(0)).current;
    const mapTranslateAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        if (showMap) {
            Animated.parallel([
                Animated.timing(mapFadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(mapTranslateAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(mapFadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(mapTranslateAnim, {
                    toValue: 50,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [showMap]);

    useEffect(() => {
        AsyncStorage.getItem('savedLakesides').then(data => {
            if (data) setSavedLakesides(JSON.parse(data));
            setIsLoading(false);
        }).catch(() => setIsLoading(false));
    }, []);

    const isLakeSaved = useMemo(() =>
        selectedLake ? savedLakesides.some(lake => lake.id === selectedLake.id) : false,
        [selectedLake, savedLakesides]
    );

    const handleSaveLake = async () => {
        if (!selectedLake) return;
        let updated;
        if (isLakeSaved) {
            updated = savedLakesides.filter(lake => lake.id !== selectedLake.id);
        } else {
            updated = [...savedLakesides, selectedLake];
        }
        setSavedLakesides(updated);
        await AsyncStorage.setItem('savedLakesides', JSON.stringify(updated));
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#17498A" />
                </View>
            ) : (
                <>
                    <View style={{
                        marginBottom: dimensions.height * 0.01923,
                        alignSelf: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: dimensions.width * 0.9341,
                    }}>
                        <LakesideCircleButton
                            icon={require('../assets/icons/lakesideArrowLeftIcon.png')}
                            onPress={() => {
                                if (isLakeOpened) {
                                    setSlideDirection('out');
                                    Animated.timing(slideAnim, {
                                        toValue: Dimensions.get('window').width,
                                        duration: 350,
                                        useNativeDriver: true,
                                    }).start(() => {
                                        setIsLakeOpened(false);
                                        setShowMap(false);
                                        setSelectedLake(null);
                                    });
                                } else setLakesidePageNY('Lakeside Home Way')
                            }}
                            size={dimensions.width * 0.21}
                        />

                        <View style={{
                            borderRadius: dimensions.width * 0.1,
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginLeft: dimensions.width * 0.04,
                            height: dimensions.height * 0.14,
                            backgroundColor: '#001938',
                            flex: 1,
                            justifyContent: 'center',
                        }}>
                            <Image
                                source={require('../assets/icons/lakeSideAppIcon.png')}
                                style={{
                                    marginRight: dimensions.width * 0.04,
                                    borderRadius: dimensions.width * 0.07,
                                    height: dimensions.height * 0.086,
                                    alignSelf: 'center',
                                    width: dimensions.height * 0.086,
                                }}
                                resizeMode='stretch'
                            />
                            <Text style={{
                                textAlign: 'center',
                                fontSize: dimensions.width * 0.05,
                                alignSelf: 'center',
                                color: '#FFFFFF',
                                fontFamily: fonts.sfProTextSemibold,
                            }}>
                                {lakesidePage === 'Top locations' ? 'Top locations' : 'Saved Place'}
                            </Text>
                        </View>
                    </View>

                    {lakesidePage === 'Saved Place' && !isLakeOpened && savedLakesides.length === 0 && (
                        <Text style={[styles.text, {
                            alignSelf: 'center',
                            marginTop: dimensions.height * 0.1021321,
                            textAlign: 'center',
                            fontSize: dimensions.width * 0.046,
                        }]}>
                            Unfortunately, you haven't {'\n'} added anything yet.
                        </Text>
                    )}

                    {!isLakeOpened ? (
                        <ScrollView style={{
                            flex: 1,
                        }}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: dimensions.height * 0.31231,
                            }}
                        >
                            {(lakesidePage === 'Top locations'
                                ? lakeTopSdataSide
                                : savedLakesides.length > 0
                                    ? savedLakesides
                                    : []
                            ).map((lakeItem, index) => (
                                <View key={lakeItem.id} style={styles.container}>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                        <View style={{
                                            width: dimensions.width * 0.64,
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            flexDirection: 'row',
                                        }}>
                                            <View
                                                style={{
                                                    borderRadius: dimensions.width * 0.05,
                                                    height: textHeight > 0 ? textHeight : dimensions.width * 0.12,
                                                    alignSelf: 'center',
                                                    marginRight: dimensions.width * 0.0201,
                                                    width: dimensions.width * 0.031,
                                                    backgroundColor: '#17498A',
                                                }}
                                            />
                                            <View
                                                style={styles.textContainer}
                                                onLayout={(event) => {
                                                    const { height } = event.nativeEvent.layout;
                                                    setTextHeight(height);
                                                }}
                                            >
                                                <Text style={[styles.text, {
                                                    fontSize: dimensions.width * 0.046,
                                                }]}>
                                                    {lakeItem.lakeTitle}
                                                </Text>
                                                <Text style={[styles.text, {
                                                    fontSize: dimensions.width * 0.031,
                                                    fontWeight: '400',
                                                    opacity: 0.53,
                                                    marginTop: dimensions.height * 0.01,
                                                }]} ellipsizeMode='tail' numberOfLines={2}>
                                                    {lakeItem.lakeDescription}
                                                </Text>
                                            </View>
                                        </View>

                                        <LakesideCircleButton
                                            icon={require('../assets/icons/lakesideArrowRightIcon.png')}
                                            onPress={() => {
                                                setSelectedLake(lakeItem);
                                                setIsLakeOpened(true)
                                            }}
                                            size={dimensions.width * 0.14}
                                        />
                                    </View>

                                    <Image
                                        source={lakeItem.lakeImage}
                                        style={{
                                            marginTop: dimensions.height * 0.021432,
                                            width: '100%',
                                            height: dimensions.height * 0.113413,
                                            borderRadius: dimensions.width * 0.07,
                                            alignSelf: 'center',
                                        }}
                                        resizeMode='stretch'

                                    />
                                </View>
                            ))}
                        </ScrollView>
                    ) : (
                        <Animated.View
                            style={{
                                flex: 1,
                                transform: [{ translateX: slideAnim }],
                            }}
                        >
                            <ScrollView style={{ flex: 1 }}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingBottom: dimensions.height * 0.31231,
                                }}
                            >
                                <View style={styles.container}>
                                    <View style={{
                                        width: '100%',
                                        height: dimensions.height * 0.25,
                                        borderRadius: dimensions.width * 0.07,
                                        alignSelf: 'center',
                                        position: 'relative',
                                    }}>
                                        <Image
                                            source={selectedLake?.lakeImage}
                                            style={{
                                                width: '100%',
                                                height: dimensions.height * 0.25,
                                                borderRadius: dimensions.width * 0.07,
                                                alignSelf: 'center',
                                            }}
                                            resizeMode='stretch'
                                        />
                                        <View style={{
                                            borderRadius: dimensions.width * 0.1,
                                            alignSelf: 'center',
                                            position: 'absolute',
                                            top: dimensions.height * 0.014,
                                            paddingVertical: dimensions.height * 0.008,
                                            backgroundColor: '#001938',
                                            paddingHorizontal: dimensions.width * 0.04623,
                                        }}>
                                            <Text style={[styles.text, {
                                                fontSize: dimensions.width * 0.031,
                                            }]}>
                                                {selectedLake
                                                    ? `${Math.abs(selectedLake.lakeCoordinates.latitude)}° ${selectedLake.lakeCoordinates.latitude >= 0 ? 'N' : 'S'}, ${Math.abs(selectedLake.lakeCoordinates.longitude)}° ${selectedLake.lakeCoordinates.longitude >= 0 ? 'E' : 'W'}`
                                                    : ''}
                                            </Text>
                                        </View>
                                    </View>

                                    {showMap ? (
                                        <Animated.View
                                            style={{
                                                transform: [{ translateY: mapTranslateAnim }],
                                                height: dimensions.height * 0.25,
                                                position: 'relative',
                                                borderRadius: dimensions.width * 0.07,
                                                width: '100%',
                                                marginTop: dimensions.height * 0.028,
                                                overflow: 'hidden',
                                                alignSelf: 'center',
                                                opacity: mapFadeAnim,
                                            }}
                                            pointerEvents={showMap ? 'auto' : 'none'}
                                        >
                                            <MapView
                                                style={{ width: '100%', height: '100%' }}
                                                initialRegion={{
                                                    latitude: selectedLake?.lakeCoordinates.latitude ?? 0,
                                                    longitude: selectedLake?.lakeCoordinates.longitude ?? 0,
                                                    latitudeDelta: 2,
                                                    longitudeDelta: 2,
                                                }}
                                                scrollEnabled={false}
                                                zoomEnabled={false}
                                                pitchEnabled={false}
                                                rotateEnabled={false}
                                            >
                                                <Marker
                                                    pinColor='#17498A'
                                                    coordinate={{
                                                        latitude: selectedLake?.lakeCoordinates.latitude ?? 0,
                                                        longitude: selectedLake?.lakeCoordinates.longitude ?? 0,
                                                    }}
                                                />
                                            </MapView>
                                            <View style={{
                                                position: 'absolute',
                                                left: dimensions.width * 0.04,
                                                top: dimensions.height * 0.04,
                                                zIndex: 10,
                                            }}>
                                                <LakesideCircleButton
                                                    icon={require('../assets/icons/lakesideArrowLeftIcon.png')}
                                                    onPress={() => setShowMap(false)}
                                                    size={dimensions.width * 0.13}
                                                />
                                            </View>
                                        </Animated.View>
                                    ) : (
                                        <>
                                            <Text style={[styles.text, {
                                                fontSize: dimensions.width * 0.059,
                                                alignSelf: 'flex-start',
                                                marginVertical: dimensions.height * 0.028,
                                                textAlign: 'left',
                                            }]}>
                                                {selectedLake?.lakeTitle}
                                            </Text>
                                            <Text style={[styles.text, {
                                                fontSize: dimensions.width * 0.028,
                                                fontWeight: '400',
                                                opacity: 0.53,
                                            }]} >
                                                {selectedLake?.lakeDescription}
                                            </Text>
                                        </>
                                    )}
                                </View>
                            </ScrollView>
                        </Animated.View>
                    )}


                    {isLakeOpened && selectedLake && (
                        <View style={{
                            gap: dimensions.width * 0.05,
                            position: 'absolute',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bottom: dimensions.height * 0.05,
                            alignSelf: 'center',
                        }}>
                            <LakesideCircleButton
                                icon={require('../assets/icons/iconsOfTheHomeLakeButtons/lakesideSavedPlaces.png')}
                                onPress={handleSaveLake}
                                size={dimensions.width * 0.21}
                                {...(isLakeSaved
                                    ? { tintIconColor: "#fff", tintButtonColor: "#17498A" }
                                    : {})}
                            />
                            <LakesideCircleButton
                                icon={require('../assets/icons/iconsOfTheHomeLakeButtons/lakesideMapIcon.png')}
                                onPress={() => setShowMap(true)}
                                size={dimensions.width * 0.21}
                            />
                            <LakesideCircleButton
                                icon={require('../assets/icons/lakesideShareIcon.png')}
                                onPress={() => {
                                    Share.share({
                                        message: `Check out this amazing lake: ${selectedLake?.lakeTitle}`,
                                    });
                                }}
                                size={dimensions.width * 0.21}
                            />
                        </View>
                    )}
                </>
            )}
        </SafeAreaView>
    );
};

const lakesideStylesOfApp = (dimensions: { width: number; height: number }) => StyleSheet.create({
    container: {
        borderRadius: dimensions.width * 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: dimensions.width * 0.04,
        overflow: 'hidden',
        paddingVertical: dimensions.height * 0.031,
        marginHorizontal: dimensions.width * 0.03,
        backgroundColor: '#001938',
        marginTop: dimensions.height * 0.02,
        width: dimensions.width * 0.9341,
        alignSelf: 'center',
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
    image: {
        zIndex: 10,
        bottom: -dimensions.height * 0.025,
        position: 'absolute',
        height: dimensions.height * 0.25,
        right: -dimensions.width * 0.1,
        width: dimensions.height * 0.25,
    },
});

export default LakesideTopLocationsWay;
