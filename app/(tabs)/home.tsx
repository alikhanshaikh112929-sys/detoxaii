import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    return (
        <SafeAreaView className="flex-1 bg-slate-950">
            <ScrollView className="px-6 pt-4">
                <View className="flex-row justify-between items-center mb-8">
                    <View>
                        <Text className="text-slate-400 text-lg">Hello,</Text>
                        <Text className="text-white text-2xl font-bold">Health Seeker</Text>
                    </View>
                    <TouchableOpacity className="bg-slate-900 p-2 rounded-full border border-slate-800">
                        <Ionicons name="notifications-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View className="bg-green-500 rounded-3xl p-6 mb-8 shadow-lg shadow-green-500/20">
                    <View className="flex-row justify-between items-start">
                        <View>
                            <Text className="text-green-900 font-bold text-lg mb-1">Daily Insight</Text>
                            <Text className="text-white font-medium text-3xl">85%</Text>
                            <Text className="text-green-100 mt-1">Clean products scanned</Text>
                        </View>
                        <View className="bg-white/20 p-3 rounded-full">
                            <Ionicons name="leaf" size={32} color="white" />
                        </View>
                    </View>
                </View>

                <View className="mb-8">
                    <Text className="text-white text-xl font-bold mb-4">Recent Scans</Text>
                    {/* Placeholder for empty state or list */}
                    <View className="bg-slate-900 rounded-2xl p-8 items-center border border-slate-800 border-dashed">
                        <View className="bg-slate-800 p-4 rounded-full mb-4">
                            <Ionicons name="scan-outline" size={32} color="#64748b" />
                        </View>
                        <Text className="text-slate-300 font-medium text-lg">No scans yet</Text>
                        <Text className="text-slate-500 text-center mt-2 mb-6">
                            Scan your first product to see detailed analysis and health scores.
                        </Text>
                        <Link href="/(tabs)/scan" asChild>
                            <TouchableOpacity className="bg-slate-800 px-6 py-3 rounded-xl">
                                <Text className="text-white font-medium">Start Scanning</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>

                <View>
                    <Text className="text-white text-xl font-bold mb-4">Trending Alternatives</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
                        {[1, 2, 3].map((item) => (
                            <View key={item} className="bg-slate-900 w-40 h-48 rounded-2xl mr-4 border border-slate-800 p-4">
                                <View className="bg-slate-800 w-full h-24 rounded-xl mb-3" />
                                <Text className="text-white font-medium">Clean Shampoo</Text>
                                <Text className="text-green-400 text-sm">98/100 Score</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
