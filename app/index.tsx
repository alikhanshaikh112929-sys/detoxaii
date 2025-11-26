import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';

export default function OnboardingScreen() {
    return (
        <View className="flex-1 bg-slate-900">
            <StatusBar style="light" />
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop' }}
                className="flex-1 justify-end pb-12 px-6"
                imageStyle={{ opacity: 0.4 }}
            >
                <View className="space-y-4">
                    <Text className="text-white text-5xl font-bold leading-tight">
                        Detox<Text className="text-green-400">AI</Text>
                    </Text>
                    <Text className="text-slate-300 text-xl font-medium">
                        Scan ingredients. Uncover toxins. Live cleaner.
                    </Text>

                    <View className="pt-8 space-y-4">
                        <TouchableOpacity
                            onPress={() => router.push('/(auth)/login')}
                            className="bg-green-500 py-4 rounded-2xl items-center shadow-lg shadow-green-500/20 active:bg-green-600"
                        >
                            <Text className="text-white font-bold text-lg">Get Started</Text>
                        </TouchableOpacity>

                        <View className="flex-row justify-center space-x-1">
                            <Text className="text-slate-400">Already have an account?</Text>
                            <Link href="/(auth)/login" asChild>
                                <TouchableOpacity>
                                    <Text className="text-green-400 font-bold">Log In</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}
