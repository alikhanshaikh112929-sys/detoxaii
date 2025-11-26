import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    return (
        <SafeAreaView className="flex-1 bg-slate-950 px-6 justify-center">
            <View className="space-y-8">
                <View>
                    <Text className="text-white text-3xl font-bold">Welcome Back</Text>
                    <Text className="text-slate-400 mt-2">Sign in to continue your detox journey</Text>
                </View>

                <View className="space-y-4">
                    <View className="bg-slate-900 rounded-xl px-4 py-3 border border-slate-800 focus:border-green-500">
                        <Text className="text-slate-500 text-xs uppercase font-bold mb-1">Email</Text>
                        <TextInput
                            className="text-white text-base"
                            placeholder="hello@example.com"
                            placeholderTextColor="#64748b"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View className="bg-slate-900 rounded-xl px-4 py-3 border border-slate-800 focus:border-green-500">
                        <Text className="text-slate-500 text-xs uppercase font-bold mb-1">Password</Text>
                        <TextInput
                            className="text-white text-base"
                            placeholder="••••••••"
                            placeholderTextColor="#64748b"
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity className="items-end">
                        <Text className="text-green-500 font-medium">Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => router.replace('/(tabs)/home')}
                    className="bg-green-500 py-4 rounded-xl items-center shadow-lg shadow-green-500/20 active:bg-green-600"
                >
                    <Text className="text-white font-bold text-lg">Sign In</Text>
                </TouchableOpacity>

                <View className="flex-row items-center space-x-4 my-4">
                    <View className="h-[1px] flex-1 bg-slate-800" />
                    <Text className="text-slate-500">Or continue with</Text>
                    <View className="h-[1px] flex-1 bg-slate-800" />
                </View>

                <View className="flex-row space-x-4 justify-center">
                    <TouchableOpacity className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <Ionicons name="logo-google" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <Ionicons name="logo-apple" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-center space-x-1 mt-4">
                    <Text className="text-slate-400">Don't have an account?</Text>
                    <TouchableOpacity>
                        <Text className="text-green-400 font-bold">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
