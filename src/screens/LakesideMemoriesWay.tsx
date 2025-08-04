import React, { useEffect, useState } from 'react';
import {
    View,
    Dimensions,
    StyleSheet,
    Image,
    SafeAreaView,
    Text,
    TouchableOpacity,
    Share,
} from 'react-native';
import { fonts } from '../assets/fonts';
import LakesideCircleButton from '../components/LakesideCircleButton';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LakesideMemoriesWayProps {
    setLakesidePageNY: (screen: string) => void;
}

const LakesideMemoriesWay: React.FC<LakesideMemoriesWayProps> = ({ setLakesidePageNY }) => {
    const dimensions = Dimensions.get('window');
    const styles = lakesideStylesOfApp(dimensions);
    const [textHeight, setTextHeight] = useState(0);
    const [isCreateMemories, setIsCreateMemories] = useState(false);
    const [myMemories, setMyMemories] = useState<string[]>([]);
    const [memoryName, setMemoryName] = useState('');
    const [geoTag, setGeoTag] = useState('');
    const [description, setDescription] = useState('');
    const [lakeImage, setLakeImage] = useState<string | null>(null);



    useEffect(() => {
        const loadMemories = async () => {
            try {
                const memories = await AsyncStorage.getItem('lakeside_memories');
                setMyMemories(memories ? JSON.parse(memories) : []);
            } catch (e) {
                console.log('Load error:', e);
            }
        };

        loadMemories();
    }, []);

    const handlePickImage = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 0.8,
            },
            (response) => {
                if (response.assets && response.assets.length > 0) {
                    setLakeImage(response.assets[0].uri || null);
                }
            }
        );
    };

    const isLakeCompletedToSave = memoryName.replace(/\s/g, '').length > 0 &&
        geoTag.replace(/\s/g, '').length > 0 && description.replace(/\s/g, '').length > 0;

    const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 5);

    const handleSaveMemory = async () => {
    const newMemory = {
        id: generateId(),
        name: memoryName,
        geoTag,
        description,
        image: lakeImage,
        date: new Date().toISOString(),
    };

    try {
        const memories = await AsyncStorage.getItem('lakeside_memories');
        const parsed = memories ? JSON.parse(memories) : [];
        parsed.unshift(newMemory);
        await AsyncStorage.setItem('lakeside_memories', JSON.stringify(parsed));
        setMyMemories(parsed); // <-- ADD THIS LINE
        setIsCreateMemories(false);
        setMemoryName('');
        setGeoTag('');
        setDescription('');
        setLakeImage(null);
    } catch (e) {
        console.log('Save error:', e);
    }
};

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{
                width: dimensions.width * 0.9341,
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: dimensions.height * 0.01923,
            }}>
                <LakesideCircleButton
                    icon={require('../assets/icons/lakesideArrowLeftIcon.png')}
                    onPress={() => {
                        if (isCreateMemories) {
                            setIsCreateMemories(false);
                            setLakeImage(null);
                            setMemoryName('');
                            setGeoTag('');
                            setDescription('');
                        } else setLakesidePageNY('Lakeside Home Way')
                    }}
                    size={dimensions.width * 0.21}
                />

                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: dimensions.width * 0.04,
                    height: dimensions.height * 0.14,
                    backgroundColor: '#001938',
                    borderRadius: dimensions.width * 0.1,
                    flexDirection: 'row',
                }}>
                    <Image
                        source={require('../assets/icons/lakeSideAppIcon.png')}
                        style={{
                            width: dimensions.height * 0.086,
                            height: dimensions.height * 0.086,
                            alignSelf: 'center',
                            borderRadius: dimensions.width * 0.07,
                            marginRight: dimensions.width * 0.04,
                        }}
                        resizeMode='stretch'
                    />
                    <Text style={{
                        fontFamily: fonts.sfProTextSemibold,
                        fontSize: dimensions.width * 0.05,
                        color: '#FFFFFF',
                        textAlign: 'center',
                        alignSelf: 'center',
                    }}>
                        Memories
                    </Text>
                </View>
            </View>

            {!isCreateMemories ? (
                myMemories.length > 0 ? (
                    <ScrollView
                        style={{
                            flex: 1,
                            alignSelf: 'center',
                            width: dimensions.width * 0.9341,
                        }}
                        contentContainerStyle={{
                            paddingBottom: dimensions.height * 0.31231,
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        {myMemories.map((memory) => (
                            <View style={[styles.container, {
                                flexDirection: undefined,
                                paddingVertical: dimensions.height * 0.025,
                            }]} key={memory.id}>
                                <Image
                                    source={{ uri: memory.image }}
                                    style={{
                                        width: '100%',
                                        height: dimensions.height * 0.1912,
                                        borderRadius: dimensions.width * 0.07,
                                        alignSelf: 'center',
                                    }}
                                    resizeMode='stretch'

                                />
                                <Text style={[styles.text, {
                                    fontSize: dimensions.width * 0.053,
                                    alignSelf: 'flex-start',
                                    marginTop: dimensions.height * 0.014,
                                    textAlign: 'left',
                                    fontFamily: fonts.sfProTextSemibold,
                                }]}>
                                    {memory?.name}
                                </Text>
                                <Text style={[styles.text, {
                                    fontSize: dimensions.width * 0.03,
                                    fontWeight: '400',
                                    alignSelf: 'flex-start',
                                    fontFamily: fonts.sfProTextSemibold,
                                    marginVertical: dimensions.height * 0.016,
                                }]} >
                                    {memory?.geoTag}
                                </Text>
                                <Text style={[styles.text, {
                                    fontSize: dimensions.width * 0.028,
                                    fontWeight: '400',
                                    alignSelf: 'flex-start',
                                    fontFamily: fonts.sfProTextSemibold,
                                    width: dimensions.width * 0.8,
                                    maxWidth: dimensions.width * 0.8,
                                }]} >
                                    {memory?.description}
                                </Text>

                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    alignSelf: 'flex-start',
                                    gap: dimensions.width * 0.03,
                                    marginTop: dimensions.height * 0.0210123,
                                }}>
                                    <LakesideCircleButton
                                        icon={require('../assets/icons/lakesideShareIcon.png')}
                                        onPress={() => {
                                            Share.share({
                                                message: `I have an amazing memory of: ${memory?.name}`,
                                            });
                                        }}
                                        size={dimensions.width * 0.17}
                                    />
                                    <LakesideCircleButton
                                        icon={require('../assets/icons/trashIcon.png')}
                                        onPress={async () => {
                                            try {
                                                const memories = await AsyncStorage.getItem('lakeside_memories');
                                                const parsed = memories ? JSON.parse(memories) : [];
                                                const updated = parsed.filter((m) => m.id !== memory.id);
                                                await AsyncStorage.setItem('lakeside_memories', JSON.stringify(updated));
                                                setMyMemories(updated); // Оновити локальний state
                                            } catch (e) {
                                                console.log('Delete error:', e);
                                            }
                                        }}
                                        size={dimensions.width * 0.17}
                                    />
                                </View>
                            </View>
                        ))}

                    </ScrollView>
                ) : (
                    <View style={styles.container}>
                        <View style={{
                            width: dimensions.width * 0.7,
                            paddingBottom: dimensions.height * 0.111,
                            paddingTop: dimensions.height * 0.03,
                        }}>
                            <Text style={[styles.text, {
                                marginBottom: dimensions.height * 0.02,
                                fontFamily: fonts.sfProTextSemibold,
                                fontSize: dimensions.width * 0.055,
                                textTransform: 'uppercase',
                            }]}>
                                Do you have {'\n'}memories?
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <View
                                    style={{
                                        backgroundColor: '#17498A',
                                        width: dimensions.width * 0.04,
                                        height: textHeight + dimensions.height * 0.04, // Встановлюємо висоту риски динамічно
                                        alignSelf: 'center',
                                        marginRight: dimensions.width * 0.0201,
                                        borderRadius: dimensions.width * 0.05,
                                    }}
                                />
                                <View style={styles.textContainer}>
                                    <Text
                                        style={[styles.text, {
                                            fontSize: dimensions.width * 0.031,
                                            zIndex: 50
                                        }]}
                                        onLayout={(event) => {
                                            const { height } = event.nativeEvent.layout;
                                            setTextHeight(height); // Отримуємо висоту тексту
                                        }}
                                    >
                                        Let's remember them forever, shall we?
                                    </Text>
                                </View>
                            </View>
                            <View style={{
                                position: 'absolute',
                                bottom: dimensions.height * 0.02,
                                left: dimensions.width * 0.04,
                            }}>
                                <LakesideCircleButton
                                    icon={require('../assets/icons/addImageIcon.png')}
                                    onPress={() => {
                                        setIsCreateMemories(true)
                                    }}
                                    size={dimensions.width * 0.19}
                                />
                            </View>
                        </View>
                        <Image
                            source={require('../assets/images/lakesideWoman.png')}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>
                )
            ) : (
                <>
                    <Text
                        style={[{
                            fontSize: dimensions.width * 0.059,
                            color: 'white',
                            zIndex: 50,
                            textTransform: 'uppercase',
                            fontFamily: fonts.sfProTextSemibold,
                            alignSelf: 'center',
                            marginTop: dimensions.height * 0.03
                        }]}
                    >
                        Create memories
                    </Text>

                    <TouchableOpacity style={[styles.container, {
                        height: dimensions.height * 0.15,
                        borderRadius: dimensions.width * 0.07,
                        justifyContent: 'center',
                    }]} disabled={!lakeImage} onPress={handlePickImage}>
                        {lakeImage ? (
                            <Image
                                source={{ uri: lakeImage }}
                                style={{
                                    width: dimensions.width * 0.9,
                                    height: '100%',
                                    borderRadius: dimensions.width * 0.07,
                                }}
                                resizeMode="cover"
                            />
                        ) : (
                            <TouchableOpacity
                                style={{
                                    width: dimensions.width * 0.5,
                                    height: dimensions.height * 0.08,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    borderRadius: dimensions.width * 0.061,
                                    overflow: 'hidden',
                                }}
                                onPress={handlePickImage}
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
                                    source={require('../assets/icons/plusCircleIcon.png')}
                                    style={{
                                        width: dimensions.width * 0.08,
                                        height: dimensions.width * 0.08,
                                        marginRight: dimensions.width * 0.02,
                                    }}
                                    resizeMode="contain"
                                />

                                <Text
                                    style={[{
                                        fontSize: dimensions.width * 0.044,
                                        color: 'black',
                                        zIndex: 50,
                                        textTransform: 'uppercase',
                                        fontFamily: fonts.sfProTextMedium,
                                        alignSelf: 'center',
                                    }]}
                                >
                                    ADD PHOTO
                                </Text>
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>

                    <View style={{
                        width: dimensions.width * 0.9341,
                        alignSelf: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <View style={styles.blueViewContainer}>
                            <Text style={[styles.text, {
                                fontSize: dimensions.width * 0.031,
                                alignSelf: 'flex-start',
                                marginLeft: dimensions.width * 0.02,
                                textAlign: 'left',
                                opacity: 0.64
                            }]}>
                                Name of the memory:
                            </Text>

                            <View style={styles.lightBlueContainer}>
                                <TextInput
                                    style={styles.textInputStyles}
                                    placeholder="Type..."
                                    placeholderTextColor="rgba(255, 255, 255, 0.64)"
                                    value={memoryName}
                                    onChangeText={setMemoryName}
                                    maxLength={40}
                                />

                            </View>
                        </View>

                        <View style={styles.blueViewContainer}>
                            <Text style={[styles.text, {
                                fontSize: dimensions.width * 0.031,
                                alignSelf: 'flex-start',
                                marginLeft: dimensions.width * 0.02,
                                textAlign: 'left',
                                opacity: 0.64
                            }]}>
                                Geo tag:
                            </Text>

                            <View style={styles.lightBlueContainer}>
                                <TextInput
                                    style={styles.textInputStyles}
                                    placeholder="Coordinates"
                                    placeholderTextColor="rgba(255, 255, 255, 0.64)"
                                    value={geoTag}
                                    onChangeText={setGeoTag}
                                    maxLength={30}
                                />

                            </View>
                        </View>
                    </View>

                    <View style={[styles.blueViewContainer, {
                        alignSelf: 'center',
                        width: dimensions.width * 0.9341,
                        height: dimensions.height * 0.21,
                        justifyContent: 'flex-start',
                        paddingVertical: dimensions.height * 0.025,
                    }]}>
                        <Text style={[styles.text, {
                            fontSize: dimensions.width * 0.031,
                            alignSelf: 'flex-start',
                            marginLeft: dimensions.width * 0.02,
                            textAlign: 'left',
                            opacity: 0.64
                        }]}>
                            Describe what you felt:
                        </Text>

                        <View style={[styles.lightBlueContainer, {
                            justifyContent: 'flex-start',
                            flex: 1,
                        }]}>
                            <TextInput
                                style={[styles.textInputStyles, { textAlignVertical: 'top', textAlign: 'left' }]}
                                placeholder="Type..."
                                placeholderTextColor="rgba(255, 255, 255, 0.64)"
                                multiline={true}
                                value={description}
                                onChangeText={setDescription}
                                maxLength={160}
                            />

                        </View>
                    </View>

                    {isLakeCompletedToSave && (
                        <View style={{
                            position: 'absolute',
                            bottom: dimensions.height * 0.025,
                            alignSelf: 'center',
                        }}>
                            <LakesideCircleButton
                                icon={require('../assets/icons/saveIcon.png')}
                                onPress={handleSaveMemory}
                                size={dimensions.width * 0.21}
                            />
                        </View>
                    )}
                </>
            )}

            {!isCreateMemories && myMemories.length > 0 && (
                <View style={{
                    position: 'absolute',
                    bottom: dimensions.height * 0.04,
                    alignSelf: 'center',
                }}>
                    <LakesideCircleButton
                        icon={require('../assets/icons/addImageIcon.png')}
                        onPress={() => {
                            setIsCreateMemories(true)
                        }}
                        size={dimensions.width * 0.19}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

const lakesideStylesOfApp = (dimensions: { width: number; height: number }) => StyleSheet.create({
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
    textContainer: {
        flex: 1,
        marginRight: dimensions.width * 0.05,
    },
    text: {
        color: '#FFFFFF',
        fontSize: dimensions.width * 0.03,
        fontFamily: fonts.sfProTextRegular,
        maxWidth: dimensions.width * 0.5,
        zIndex: 555
    },
    image: {
        width: dimensions.height * 0.25,
        height: dimensions.height * 0.25,
        position: 'absolute',
        right: -dimensions.width * 0.1,
        bottom: -dimensions.height * 0.025,
        zIndex: 10
    },
    blueViewContainer: {
        height: dimensions.height * 0.15,
        borderRadius: dimensions.width * 0.07,
        justifyContent: 'center',
        width: dimensions.width * 0.45,

        alignItems: 'center',
        backgroundColor: '#001938',
        paddingHorizontal: dimensions.width * 0.016,
        marginTop: dimensions.height * 0.02,
    },
    lightBlueContainer: {
        width: '95%',
        height: dimensions.height * 0.07,
        paddingVertical: dimensions.height * 0.01,
        marginTop: dimensions.height * 0.01,
        borderRadius: dimensions.width * 0.04,
        backgroundColor: '#002859',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInputStyles: {
        width: '100%',
        color: '#FFFFFF',
        fontSize: dimensions.width * 0.034,
        fontFamily: fonts.sfProTextRegular,
        paddingHorizontal: dimensions.width * 0.02,
    }
});

export default LakesideMemoriesWay;
