import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import api, { setToken } from '../services/api';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token } = response.data.data;

            if (token) {
                await setToken(token);
                router.replace('/tasks');
            } else {
                Alert.alert("Login Failed", "No token received");
            }
        } catch (error: any) {
            const message = error.response?.data?.error || 'Login failed. Please try again.';
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-background justify-center px-8">
            <StatusBar style="dark" />
            <View className="mb-10">
                <Text className="text-4xl font-bold text-primary mb-2">Welcome Back</Text>
                <Text className="text-lg text-secondary">Please enter your details to sign in.</Text>
            </View>

            <View className="space-y-6">
                <View>
                    <Text className="text-secondary mb-2">Email Address</Text>
                    <TextInput
                        className="border-b-2 border-border py-2 text-lg text-primary"
                        placeholder="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View>
                    <Text className="text-secondary mb-2">Password</Text>
                    <TextInput
                        className="border-b-2 border-border py-2 text-lg text-primary"
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    onPress={handleLogin}
                    disabled={loading}
                    className={`w-full bg-primary py-4 mt-6 items-center ${loading ? 'opacity-70' : ''}`}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white text-lg font-bold tracking-wide">SIGN IN</Text>
                    )}
                </TouchableOpacity>

                <View className="flex-row justify-center mt-4">
                    <Text className="text-secondary">Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/signup')}>
                        <Text className="text-primary font-bold">Create one</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
