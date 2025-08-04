import LinearGradient from 'react-native-linear-gradient';
import lakeTopSdataSide from '../assets/lakesideData/lakeTopSdataSide';
import LakesideCircleButton from '../components/LakesideCircleButton';

import {
    Text,
    View,
    ActivityIndicator,
    StyleSheet,
    Image,
    SafeAreaView,
    Dimensions,
    Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fonts } from '../assets/fonts';
import { ScrollView } from 'react-native-gesture-handler';
import React, {useEffect, useState, useRef, useMemo } from 'react';
import MapView, { Marker } from 'react-native-maps';


interface LakesideOverviewMapWayProps {
    setLakesidePageNY: (screen: string) => void;
    lakesidePage: string;
}

const LakesideOverviewMapWay: React.FC<LakesideOverviewMapWayProps> = ({ setLakesidePageNY, lakesidePage }) => {
    const dimensions = Dimensions.get('window');
    const [isPlaceOpened, setIsPlaceOpened] = useState(false);
    const [savedLakesides, setSavedLakesides] = useState<LakeItemType[]>([]);
    const [isLakeOpened, setIsLakeOpened] = useState(false);
    const styles = lakesideStylesOfApp(dimensions);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLake, setSelectedLake] = useState<LakeItemType | null>(null);
    type LakeItemType = typeof lakeTopSdataSide[number];

    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        AsyncStorage.getItem('savedLakesides').then(data => {
            if (data) setSavedLakesides(JSON.parse(data));
            setIsLoading(false);
        }).catch(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if ((isLakeOpened || isPlaceOpened) && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: false });
        }
    }, [isLakeOpened, isPlaceOpened]);

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
                                    setIsLakeOpened(false);

                                } else if (isPlaceOpened) setIsPlaceOpened(false)
                                else setLakesidePageNY('Lakeside Home Way')
                            }}
                            size={dimensions.width * 0.21}
                        />

                        <View style={{
                            backgroundColor: '#001938',
                            flex: 1,
                            alignItems: 'center',


                            justifyContent: 'center',
                            marginLeft: dimensions.width * 0.04,
                            height: dimensions.height * 0.14,

                            flexDirection: 'row',
                            borderRadius: dimensions.width * 0.1,
                        }}>
                            <Image
                                source={require('../assets/icons/lakeSideAppIcon.png')}
                                style={{
                                    marginRight: dimensions.width * 0.04,
                                    height: dimensions.height * 0.086,
                                    width: dimensions.height * 0.086,
                                    alignSelf: 'center',
                                    borderRadius: dimensions.width * 0.07,
                                }}
                                resizeMode='stretch'
                            />
                            <Text style={{
                                alignSelf: 'center',
                                color: '#FFFFFF',
                                textAlign: 'center',
                                fontFamily: fonts.sfProTextSemibold,
                                fontSize: dimensions.width * 0.05,
                            }}>
                                Overview Map
                            </Text>
                        </View>
                    </View>
                    <ScrollView
                        ref={scrollViewRef}
                        style={{
                            flex: 1,
                            alignSelf: 'center',
                            width: dimensions.width * 0.9341,
                        }}
                        contentContainerStyle={{
                            paddingBottom: dimensions.height * 0.31231,
                        }}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={isLakeOpened}
                    >
                        <View style={[styles.container, {
                            paddingHorizontal: dimensions.width * 0.05,
                        }]}>
                            {!isLakeOpened ? (
                                <>
                                    {isPlaceOpened && selectedLake && (
                                        <View style={{
                                            marginBottom: dimensions.height * 0.03,
                                            width: '100%',
                                            borderRadius: dimensions.width * 0.07,
                                            height: dimensions.height * 0.210321,
                                            alignSelf: 'center',
                                        }}>
                                            <LinearGradient
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    borderRadius: dimensions.width * 0.07,
                                                    position: 'absolute',
                                                    top: 0, left: 0, right: 0, bottom: 0,
                                                    zIndex: 5
                                                }}
                                                colors={['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.04)']}
                                                start={{ x: 0.5, y: 1 }}
                                                end={{ x: 0.5, y: 0 }}
                                            />
                                            <Image
                                                source={selectedLake.lakeImage}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    borderRadius: dimensions.width * 0.07,

                                                }}
                                                resizeMode='cover'
                                            />
                                            <View style={{
                                                justifyContent: 'space-between',
                                                position: 'absolute',
                                                zIndex: 12,
                                                alignSelf: 'center',
                                                width: '95%',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                paddingHorizontal: dimensions.width * 0.02,
                                                bottom: dimensions.height * 0.02,
                                            }}>
                                                <Text style={[styles.text, {
                                                    fontSize: dimensions.width * 0.046,
                                                }]}>
                                                    {selectedLake.lakeTitle}
                                                </Text>

                                                <LakesideCircleButton
                                                    icon={require('../assets/icons/lakesideArrowRightIcon.png')}
                                                    onPress={() => {
                                                        setIsLakeOpened(true)
                                                    }}
                                                    size={dimensions.width * 0.14}
                                                />
                                            </View>

                                        </View>
                                    )}
                                    <View style={{
                                        overflow: 'hidden',
                                        height: isPlaceOpened ? dimensions.height * 0.34 : dimensions.height * 0.59,
                                        position: 'relative',
                                        borderRadius: dimensions.width * 0.07,
                                        alignSelf: 'center',
                                        width: '100%',
                                    }}>
                                        <MapView
                                            style={{ width: '100%', height: '100%', borderRadius: dimensions.width * 0.07 }}
                                            initialRegion={{
                                                latitude: lakeTopSdataSide[0]?.lakeCoordinates.latitude ?? 47.7,
                                                longitudeDelta: 0.01,
                                                longitude: lakeTopSdataSide[0]?.lakeCoordinates.longitude ?? -87.5,
                                                latitudeDelta: 0.01,
                                            }}
                                            rotateEnabled={false}
                                        >
                                            {lakeTopSdataSide.map((lake, index) => (
                                                <Marker
                                                    key={index}
                                                    pinColor={isLakeOpened && selectedLake?.id === lake.id ? '#FF0000' : '#17498A'}
                                                    coordinate={{
                                                        latitude: lake.lakeCoordinates.latitude,
                                                        longitude: lake.lakeCoordinates.longitude,
                                                    }}
                                                    onPress={() => {
                                                        setSelectedLake(lake);
                                                        setIsPlaceOpened(true);
                                                    }}
                                                />
                                            ))}
                                        </MapView>
                                    </View>
                                </>
                            ) : (
                                <>
                                    <Image
                                        source={selectedLake?.lakeImage}
                                        style={{
                                            alignSelf: 'center',
                                            height: dimensions.height * 0.1912,
                                            width: '100%',
                                            borderRadius: dimensions.width * 0.07,
                                        }}
                                        resizeMode='stretch'

                                    />
                                    <Text style={[styles.text, {
                                        textAlign: 'left',
                                        marginVertical: dimensions.height * 0.028,
                                        alignSelf: 'flex-start',
                                        fontSize: dimensions.width * 0.059,
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

                    {isLakeOpened && selectedLake && (
                        <View style={{
                            justifyContent: 'center',
                            gap: dimensions.width * 0.05,
                            position: 'absolute',
                            flexDirection: 'row',
                            alignItems: 'center',
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
        paddingVertical: dimensions.height * 0.031,
        justifyContent: 'center',
        backgroundColor: '#001938',
        marginTop: dimensions.height * 0.02,

        overflow: 'hidden',
        paddingHorizontal: dimensions.width * 0.04,
        marginHorizontal: dimensions.width * 0.03,
        alignItems: 'center',
        
        width: dimensions.width * 0.9341,
        alignSelf: 'center',
        borderRadius: dimensions.width * 0.1,
    },
    textContainer: {
        flex: 1,
        marginRight: dimensions.width * 0.05,
    },
    text: {
        zIndex: 555,
        fontSize: dimensions.width * 0.04,
        maxWidth: dimensions.width * 0.88,
        fontFamily: fonts.sfProTextSemibold,
        color: '#FFFFFF',
    },
    image: {
        zIndex: 10,
        height: dimensions.height * 0.25,
        position: 'absolute',
        right: -dimensions.width * 0.1,
        bottom: -dimensions.height * 0.025,
        width: dimensions.height * 0.25,
    },
});

export default LakesideOverviewMapWay;
