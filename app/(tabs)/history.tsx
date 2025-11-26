import { clearHistory, getHistory, HistoryItem } from '@/lib/history';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadHistory = async () => {
        const data = await getHistory();
        setHistory(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadHistory();
        setRefreshing(false);
    };

    const handleClearHistory = async () => {
        await clearHistory();
        setHistory([]);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-950">
            <View className="px-6 py-4 flex-row justify-between items-center border-b border-slate-900">
                <Text className="text-white text-2xl font-bold">Scan History</Text>
                {history.length > 0 && (
                    <TouchableOpacity onPress={handleClearHistory}>
                        <Ionicons name="trash-outline" size={24} color="#ef4444" />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                className="flex-1 px-6 pt-4"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
                }
            >
                {history.length === 0 ? (
                    <View className="items-center justify-center py-20">
                        <View className="bg-slate-900 p-6 rounded-full mb-4">
                            <Ionicons name="time-outline" size={48} color="#64748b" />
                        </View>
                        <Text className="text-slate-400 text-lg font-medium">No history yet</Text>
                        <Text className="text-slate-600 text-center mt-2 px-8">
                            Scans you perform will appear here automatically.
                        </Text>
                    </View>
                ) : (
                    <View className="space-y-4 pb-8">
                        {history.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex-row items-center"
                                onPress={() => router.push({
                                    pathname: '/result/[id]',
                                    params: {
                                        id: item.id,
                                        data: JSON.stringify(item.result),
                                        imageUri: item.imageUri
                                    }
                                })}
                            >
                                <Image
                                    source={{ uri: item.imageUri }}
                                    className="w-16 h-16 rounded-xl bg-slate-800"
                                    resizeMode="cover"
                                />
                                <View className="flex-1 ml-4">
                                    <View className="flex-row justify-between items-start">
                                        <Text className="text-white font-bold text-lg" numberOfLines={1}>
                                            {new Date(item.date).toLocaleDateString()}
                                        </Text>
                                        <Text className={`font-bold ${getScoreColor(item.result.score)}`}>
                                            {item.result.score}/100
                                        </Text>
                                    </View>
                                    <Text className="text-slate-400 text-sm" numberOfLines={1}>
                                        {item.result.ingredients.length} ingredients analyzed
                                    </Text>
                                    <View className="flex-row mt-2">
                                        <View className={`px-2 py-0.5 rounded-full ${item.result.status === 'Clean' ? 'bg-green-500/20' : (item.result.status === 'Toxic' ? 'bg-red-500/20' : 'bg-yellow-500/20')}`}>
                                            <Text className={`text-xs font-bold ${item.result.status === 'Clean' ? 'text-green-500' : (item.result.status === 'Toxic' ? 'text-red-500' : 'text-yellow-500')}`}>
                                                {item.result.status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#475569" />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
