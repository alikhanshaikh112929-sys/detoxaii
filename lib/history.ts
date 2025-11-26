import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalysisResult } from './gemini';

export interface HistoryItem {
    id: string;
    date: string;
    imageUri: string;
    result: AnalysisResult;
}

const HISTORY_KEY = 'scan_history';

export async function saveScan(result: AnalysisResult, imageUri: string): Promise<void> {
    try {
        const newItem: HistoryItem = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            imageUri,
            result,
        };

        const existingData = await AsyncStorage.getItem(HISTORY_KEY);
        const history: HistoryItem[] = existingData ? JSON.parse(existingData) : [];

        // Add new item to the beginning
        history.unshift(newItem);

        // Limit to last 50 items
        if (history.length > 50) {
            history.pop();
        }

        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('Failed to save scan history:', error);
    }
}

export async function getHistory(): Promise<HistoryItem[]> {
    try {
        const data = await AsyncStorage.getItem(HISTORY_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Failed to fetch scan history:', error);
        return [];
    }
}

export async function clearHistory(): Promise<void> {
    try {
        await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        console.error('Failed to clear history:', error);
    }
}
