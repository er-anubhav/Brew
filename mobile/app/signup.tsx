import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import api from '../services/api'; // No token set on signup typically, redirect to login
import { StatusBar } from 'expo-status-bar';

export default function SignupScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/signup', { email, password });
            Alert.alert('Success', 'Account created successfully. Please login.');
            router.replace('/login');
        } catch (error: any) {
            const message = error.response?.data?.error || 'Signup failed. Please try again.';
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-background justify-center px-8">
            <StatusBar style="dark" />
            <View className="mb-10">
                <Text className="text-4xl font-bold text-primary mb-2">Create Account</Text>
                <Text className="text-lg text-secondary">Join us to experience the premium.</Text>
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
                    onPress={handleSignup}
                    disabled={loading}
                    className={`w-full bg-primary py-4 mt-6 items-center ${loading ? 'opacity-70' : ''}`}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white text-lg font-bold tracking-wide">SIGN UP</Text>
                    )}
                </TouchableOpacity>

                <View className="flex-row justify-center mt-4">
                    <Text className="text-secondary">Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/login')}>
                        <Text className="text-primary font-bold">Log in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
