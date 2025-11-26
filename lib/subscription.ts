import AsyncStorage from '@react-native-async-storage/async-storage';

const SUBSCRIPTION_KEY = 'detoxai_subscription';
const DAILY_SCANS_KEY = 'detoxai_daily_scans';

export interface SubscriptionState {
    isPro: boolean;
    trialStartDate?: string;
}

export interface DailyScanState {
    date: string; // YYYY-MM-DD
    count: number;
}

export const MAX_FREE_SCANS = 3;

export async function getSubscriptionStatus(): Promise<SubscriptionState> {
    try {
        const data = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
        return data ? JSON.parse(data) : { isPro: false };
    } catch {
        return { isPro: false };
    }
}

export async function startFreeTrial(): Promise<void> {
    const state: SubscriptionState = {
        isPro: true,
        trialStartDate: new Date().toISOString(),
    };
    await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(state));
}

export async function getRemainingScans(): Promise<number> {
    const sub = await getSubscriptionStatus();
    if (sub.isPro) return -1; // Unlimited

    const today = new Date().toISOString().split('T')[0];
    const data = await AsyncStorage.getItem(DAILY_SCANS_KEY);

    let state: DailyScanState = data ? JSON.parse(data) : { date: today, count: 0 };

    if (state.date !== today) {
        return MAX_FREE_SCANS;
    }

    return Math.max(0, MAX_FREE_SCANS - state.count);
}

export async function incrementScanCount(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const data = await AsyncStorage.getItem(DAILY_SCANS_KEY);

    let state: DailyScanState = data ? JSON.parse(data) : { date: today, count: 0 };

    if (state.date !== today) {
        state = { date: today, count: 1 };
    } else {
        state.count += 1;
    }

    await AsyncStorage.setItem(DAILY_SCANS_KEY, JSON.stringify(state));
}
