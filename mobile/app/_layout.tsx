import { Stack } from 'expo-router';
// RootLayout ensures the navigation stack is set up correctly
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
                <Stack.Screen name="signup" options={{ title: 'Sign Up', headerShown: false }} />
                <Stack.Screen name="tasks/index" options={{ title: 'Tasks', headerShown: false }} />
                <Stack.Screen name="task/[id]" options={{ title: 'Task Details', headerShown: false }} />
                <Stack.Screen name="task/new" options={{ title: 'New Task', headerShown: false }} />
            </Stack>
            <Toast />
        </GestureHandlerRootView>
    );
}
