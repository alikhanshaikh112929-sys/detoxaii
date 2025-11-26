import { analyzeImage } from '@/lib/gemini';
import { saveScan } from '@/lib/history';
import { getRemainingScans, incrementScanCount, startFreeTrial } from '@/lib/subscription';
import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system/legacy';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SCAN_FRAME_SIZE = 280; // Slightly larger than w-64 (256)

export default function ScanScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraType, setCameraType] = useState<CameraType>('back');
    const [flashMode, setFlashMode] = useState<FlashMode>('off');
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const cameraRef = useRef<CameraView>(null);

    // Animation
    const scanLineTop = useSharedValue(0);

    useEffect(() => {
        scanLineTop.value = withRepeat(
            withTiming(SCAN_FRAME_SIZE, { duration: 2000, easing: Easing.linear }),
            -1,
            false // Do not reverse, just loop top to bottom
        );
    }, []);

    const animatedScanStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: scanLineTop.value }],
    }));

    if (!permission) {
        return <View className="flex-1 bg-slate-950" />;
    }

    if (!permission.granted) {
        return (
            <SafeAreaView className="flex-1 bg-slate-950 justify-center items-center px-8">
                <View className="bg-slate-900 p-8 rounded-full mb-6 border border-slate-800 shadow-lg shadow-green-500/10">
                    <Ionicons name="camera" size={64} color="#ef4444" />
                </View>
                <Text className="text-white text-2xl font-bold mb-2 text-center">Camera Access Required</Text>
                <Text className="text-slate-400 text-center mb-8 leading-relaxed">
                    We need permission to access your camera to scan ingredients. Please enable it in your settings.
                </Text>
                <TouchableOpacity
                    onPress={requestPermission}
                    className="bg-green-500 px-8 py-4 rounded-2xl shadow-lg shadow-green-500/20 active:bg-green-600 w-full"
                >
                    <Text className="text-white font-bold text-lg text-center">Grant Permission</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const toggleCameraType = () => {
        setCameraType(current => (current === 'back' ? 'front' : 'back'));
    };

    const toggleFlash = () => {
        setFlashMode(current => (current === 'off' ? 'on' : 'off'));
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                // 1. Take full picture
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    skipProcessing: true,
                });

                if (photo) {
                    // 2. Crop to center square
                    // Calculate crop region
                    const imgWidth = photo.width;
                    const imgHeight = photo.height;

                    // We want a square crop from the center
                    // The frame on screen is SCAN_FRAME_SIZE
                    // We need to map screen coordinates to image coordinates
                    // Assuming aspect fill, the image is scaled to cover the screen.

                    // Simplification: Crop the center square of the image.
                    // This might not be pixel-perfect with the UI frame if aspect ratios differ significantly,
                    // but it's usually "good enough" for ingredient lists which are centered.

                    const minDim = Math.min(imgWidth, imgHeight);
                    const cropSize = minDim * 0.7; // Crop 70% of the center

                    const originX = (imgWidth - cropSize) / 2;
                    const originY = (imgHeight - cropSize) / 2;

                    const cropped = await manipulateAsync(
                        photo.uri,
                        [{ crop: { originX, originY, width: cropSize, height: cropSize } }],
                        { compress: 0.8, format: SaveFormat.JPEG }
                    );

                    setCapturedImage(cropped.uri);
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to take picture');
                console.error(error);
            }
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // This allows user to crop in the native picker
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setCapturedImage(result.assets[0].uri);
        }
    };

    const handleAnalyze = async () => {
        if (!capturedImage) return;

        // Check limits
        const remaining = await getRemainingScans();
        if (remaining === 0) {
            setShowUpgradeModal(true);
            return;
        }

        setIsAnalyzing(true);
        try {
            // Read file as base64
            const base64 = await FileSystem.readAsStringAsync(capturedImage, {
                encoding: 'base64',
            });

            const result = await analyzeImage(base64);

            // Save to history & increment count
            await saveScan(result, capturedImage);
            await incrementScanCount();

            setIsAnalyzing(false);

            // Navigate to result screen with data
            router.push({
                pathname: '/result/[id]',
                params: {
                    id: 'new',
                    data: JSON.stringify(result),
                    imageUri: capturedImage
                }
            });

        } catch (error: any) {
            console.error(error);
            Alert.alert("Analysis Failed", error.message);
            setIsAnalyzing(false);
        }
    };

    const handleStartTrial = async () => {
        await startFreeTrial();
        setShowUpgradeModal(false);
        handleAnalyze(); // Retry analysis
    };

    const handleRetake = () => {
        setCapturedImage(null);
    };

    if (capturedImage) {
        return (
            <View className="flex-1 bg-slate-950">
                <Image source={{ uri: capturedImage }} className="flex-1" resizeMode="contain" />

                <View className="absolute bottom-0 left-0 right-0 p-8 bg-slate-950/80 backdrop-blur-md rounded-t-3xl border-t border-slate-800">
                    <Text className="text-white text-xl font-bold mb-6 text-center">Analyze this product?</Text>

                    <View className="flex-row space-x-4">
                        <TouchableOpacity
                            onPress={handleRetake}
                            className="flex-1 bg-slate-800 py-4 rounded-2xl border border-slate-700 items-center"
                        >
                            <Text className="text-slate-300 font-bold text-lg">Retake</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleAnalyze}
                            disabled={isAnalyzing}
                            className="flex-1 bg-green-500 py-4 rounded-2xl shadow-lg shadow-green-500/20 active:bg-green-600 items-center flex-row justify-center space-x-2"
                        >
                            {isAnalyzing ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Ionicons name="scan" size={20} color="white" />
                                    <Text className="text-white font-bold text-lg">Analyze</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleRetake}
                    className="absolute top-12 left-6 bg-black/50 p-2 rounded-full"
                >
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>

                {/* Upgrade Modal */}
                {showUpgradeModal && (
                    <View className="absolute inset-0 bg-black/80 justify-center items-center px-6 z-50">
                        <View className="bg-slate-900 w-full p-6 rounded-3xl border border-slate-800">
                            <View className="items-center mb-6">
                                <View className="bg-yellow-500/20 p-4 rounded-full mb-4">
                                    <Ionicons name="star" size={48} color="#eab308" />
                                </View>
                                <Text className="text-white text-2xl font-bold text-center mb-2">Daily Limit Reached</Text>
                                <Text className="text-slate-400 text-center">
                                    You've used your 3 free scans for today. Unlock unlimited scans with a free trial.
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={handleStartTrial}
                                className="bg-green-500 py-4 rounded-xl mb-3 shadow-lg shadow-green-500/20"
                            >
                                <Text className="text-white font-bold text-center text-lg">Start 3-Day Free Trial</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setShowUpgradeModal(false)}
                                className="py-4"
                            >
                                <Text className="text-slate-500 font-bold text-center">Maybe Later</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black">
            <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing={cameraType}
                flash={flashMode}
            >
                <SafeAreaView className="flex-1 justify-between p-6">
                    {/* Top Controls */}
                    <View className="flex-row justify-between items-start">
                        <TouchableOpacity
                            onPress={toggleFlash}
                            className="bg-black/40 p-3 rounded-full backdrop-blur-sm"
                        >
                            <Ionicons
                                name={flashMode === 'on' ? 'flash' : 'flash-off'}
                                size={24}
                                color={flashMode === 'on' ? '#fbbf24' : 'white'}
                            />
                        </TouchableOpacity>

                        <View className="bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                            <Text className="text-white font-medium text-xs uppercase tracking-widest">Scan Product</Text>
                        </View>

                        <TouchableOpacity
                            onPress={toggleCameraType}
                            className="bg-black/40 p-3 rounded-full backdrop-blur-sm"
                        >
                            <Ionicons name="camera-reverse" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Scanner Overlay Guide */}
                    <View className="flex-1 justify-center items-center">
                        <View className="relative">
                            {/* The Frame */}
                            <View
                                style={{ width: SCAN_FRAME_SIZE, height: SCAN_FRAME_SIZE }}
                                className="border-2 border-white/30 rounded-3xl overflow-hidden relative"
                            >
                                {/* Corner Markers */}
                                <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-2xl -mt-0.5 -ml-0.5" />
                                <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-2xl -mt-0.5 -mr-0.5" />
                                <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-2xl -mb-0.5 -ml-0.5" />
                                <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-2xl -mb-0.5 -mr-0.5" />

                                {/* Scanning Animation */}
                                <Animated.View
                                    style={[
                                        {
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                            height: 2,
                                            backgroundColor: '#4ade80', // green-400
                                            shadowColor: '#4ade80',
                                            shadowOffset: { width: 0, height: 0 },
                                            shadowOpacity: 1,
                                            shadowRadius: 10,
                                            elevation: 5
                                        },
                                        animatedScanStyle
                                    ]}
                                >
                                    <View className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-t from-green-500/20 to-transparent -mt-20" />
                                </Animated.View>
                            </View>
                        </View>

                        <Text className="text-white/70 mt-8 text-center bg-black/40 px-4 py-2 rounded-xl overflow-hidden">
                            Position ingredients within the frame
                        </Text>
                    </View>

                    {/* Bottom Controls */}
                    <View className="flex-row justify-between items-center mt-8">
                        <TouchableOpacity
                            onPress={pickImage}
                            className="bg-black/40 p-4 rounded-full backdrop-blur-sm"
                        >
                            <Ionicons name="images" size={24} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={takePicture}
                            className="w-20 h-20 rounded-full border-4 border-white/30 items-center justify-center"
                        >
                            <View className="w-16 h-16 bg-white rounded-full shadow-lg shadow-white/50" />
                        </TouchableOpacity>

                        <View className="w-14" />
                    </View>
                </SafeAreaView>
            </CameraView>
        </View>
    );
}
