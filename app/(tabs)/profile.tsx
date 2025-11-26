import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    return (
        <SafeAreaView className="flex-1 bg-slate-950">
            <View className="px-6 pt-4 pb-8 bg-slate-900 rounded-b-[40px] shadow-lg shadow-black/50">
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-white text-xl font-bold">Profile</Text>
                    <TouchableOpacity>
                        <Ionicons name="settings-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center space-x-4">
                    <View className="w-20 h-20 bg-slate-800 rounded-full items-center justify-center border-2 border-green-500">
                        <Text className="text-2xl">👤</Text>
                    </View>
                    <View>
                        <Text className="text-white text-2xl font-bold">Alex Doe</Text>
                        <Text className="text-slate-400">Health Enthusiast</Text>
                    </View>
                </View>

                <View className="flex-row mt-8 justify-between">
                    <View className="items-center flex-1">
                        <Text className="text-white font-bold text-xl">12</Text>
                        <Text className="text-slate-500 text-xs uppercase mt-1">Scans</Text>
                    </View>
                    <View className="w-[1px] bg-slate-800" />
                    <View className="items-center flex-1">
                        <Text className="text-green-400 font-bold text-xl">8.5</Text>
                        <Text className="text-slate-500 text-xs uppercase mt-1">Avg Score</Text>
                    </View>
                    <View className="w-[1px] bg-slate-800" />
                    <View className="items-center flex-1">
                        <Text className="text-white font-bold text-xl">4</Text>
                        <Text className="text-slate-500 text-xs uppercase mt-1">Saved</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-8">
                <Text className="text-slate-500 font-bold uppercase text-xs mb-4">Account</Text>

                <View className="space-y-4 mb-8">
                    <SettingsItem icon="person-outline" label="Personal Details" />
                    <SettingsItem icon="heart-outline" label="Health Preferences" />
                    <SettingsItem icon="shield-checkmark-outline" label="Privacy & Security" />
                </View>

                <Text className="text-slate-500 font-bold uppercase text-xs mb-4">App</Text>

                <View className="space-y-4">
                    <SettingsItem icon="notifications-outline" label="Notifications" />
                    <SettingsItem icon="help-circle-outline" label="Help & Support" />
                    <TouchableOpacity className="flex-row items-center bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
                        <View className="w-10 h-10 bg-red-500/20 rounded-full items-center justify-center mr-4">
                            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                        </View>
                        <Text className="text-red-500 font-medium text-lg">Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function SettingsItem({ icon, label }: { icon: any, label: string }) {
    return (
        <TouchableOpacity className="flex-row items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <View className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center mr-4">
                <Ionicons name={icon} size={20} color="white" />
            </View>
            <Text className="text-white font-medium text-lg flex-1">{label}</Text>
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
        </TouchableOpacity>
    );
}
