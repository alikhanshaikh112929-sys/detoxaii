import { AnalysisResult } from '@/lib/gemini';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResultScreen() {
    const { data, imageUri } = useLocalSearchParams();

    let result: AnalysisResult | null = null;
    try {
        if (typeof data === 'string') {
            result = JSON.parse(data);
        }
    } catch (e) {
        console.error("Failed to parse result data", e);
    }

    // Fallback or Loading state if needed, but we expect data
    if (!result) {
        return (
            <View className="flex-1 bg-slate-950 justify-center items-center">
                <Text className="text-white">No result data found.</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4">
                    <Text className="text-green-500">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return "bg-green-500";
        if (score >= 50) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <View className="flex-1 bg-slate-950">
            <ScrollView className="flex-1">
                {/* Header Image */}
                <View className="relative h-72">
                    <Image
                        source={{ uri: (imageUri as string) || "https://images.unsplash.com/photo-1585232561307-3f83b0ed5778?q=80&w=2000&auto=format&fit=crop" }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950" />

                    <SafeAreaView className="absolute top-0 left-0 right-0 px-6">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-black/50 rounded-full items-center justify-center backdrop-blur-md"
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>

                <View className="-mt-12 px-6 pb-12">
                    {/* Score Card */}
                    <View className="bg-slate-900 rounded-3xl p-6 shadow-xl shadow-black/50 border border-slate-800">
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="flex-1 mr-4">
                                <Text className="text-white text-2xl font-bold mb-1">Analysis Result</Text>
                                <View className={`self-start px-3 py-1 rounded-full ${result.score >= 50 ? 'bg-yellow-500/20' : 'bg-red-500/20'}`}>
                                    <Text className={`${getScoreColor(result.score)} font-bold uppercase text-xs`}>
                                        {result.status}
                                    </Text>
                                </View>
                            </View>
                            <View className={`w-20 h-20 rounded-full items-center justify-center border-4 ${result.score >= 50 ? 'border-yellow-500' : 'border-red-500'}`}>
                                <Text className={`text-2xl font-bold ${getScoreColor(result.score)}`}>{result.score}</Text>
                            </View>
                        </View>

                        <Text className="text-slate-400 leading-relaxed">
                            We found <Text className="text-white font-bold">{result.ingredients.length} ingredients</Text>.
                            {result.status === 'Toxic'
                                ? " Some ingredients are potentially harmful."
                                : " This product looks mostly safe."}
                        </Text>
                    </View>

                    {/* Ingredients Analysis */}
                    <Text className="text-white text-xl font-bold mt-8 mb-4">Ingredient Analysis</Text>
                    <View className="space-y-3">
                        {result.ingredients.map((ing, index) => (
                            <View key={index} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex-row items-start">
                                <View className={`w-2 h-2 rounded-full mt-2 mr-3 ${ing.status === 'safe' ? 'bg-green-500' : (ing.status === 'moderate' ? 'bg-yellow-500' : 'bg-red-500')}`} />
                                <View className="flex-1">
                                    <View className="flex-row justify-between items-center mb-1">
                                        <Text className="text-white font-bold text-lg">{ing.name}</Text>
                                        {ing.status !== 'safe' && (
                                            <Ionicons name="warning" size={16} color={ing.status === 'toxic' ? "#ef4444" : "#eab308"} />
                                        )}
                                    </View>
                                    <Text className="text-slate-400">{ing.description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Alternatives */}
                    {result.alternatives && result.alternatives.length > 0 && (
                        <>
                            <Text className="text-white text-xl font-bold mt-8 mb-4">Cleaner Alternatives</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
                                {result.alternatives.map((alt, index) => (
                                    <TouchableOpacity key={index} className="bg-slate-900 w-48 rounded-2xl mr-4 border border-slate-800 overflow-hidden p-4">
                                        <View className="bg-slate-800 w-full h-24 rounded-xl mb-3 items-center justify-center">
                                            <Ionicons name="leaf" size={32} color="#4ade80" />
                                        </View>
                                        <Text className="text-white font-bold mb-1">{alt.name}</Text>
                                        <Text className="text-slate-500 text-xs">{alt.reason}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
