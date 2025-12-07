import { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    RefreshControl,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Modal,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import TaskCard from '../../components/TaskCard';
import { Task, TaskStatus } from '../../types/task';
import { getTasks } from '../../services/api';
import { logout } from '../../services/api';

const FILTER_OPTIONS = [
    { label: 'All', value: 'all' },
    { label: 'To Do', value: TaskStatus.TODO },
    { label: 'In Progress', value: TaskStatus.INPROGRESS },
    { label: 'Done', value: TaskStatus.DONE },
];

export default function TasksScreen() {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Refs to track current filter/search state for focus refresh
    const statusFilterRef = useRef(statusFilter);
    const searchQueryRef = useRef(searchQuery);

    useEffect(() => {
        statusFilterRef.current = statusFilter;
    }, [statusFilter]);

    useEffect(() => {
        searchQueryRef.current = searchQuery;
    }, [searchQuery]);

    const fetchTasks = async (isRefreshing = false) => {
        try {
            if (!isRefreshing) setLoading(true);
            setError(null);

            const response = await getTasks(
                statusFilterRef.current,
                searchQueryRef.current?.trim() || undefined
            );

            const tasksData = response.data.data.tasks;
            setTasks(tasksData);
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to load tasks';
            setError(message);
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Refresh when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchTasks();
        }, [])
    );

    useEffect(() => {
        fetchTasks();
    }, [statusFilter]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== undefined) {
                fetchTasks();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchTasks(true);
    }, [statusFilter, searchQuery]);

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/login');
                    },
                },
            ]
        );
    };

    const renderEmptyState = () => {
        if (loading) return null;

        return (
            <View className="flex-1 justify-center items-center p-8 border-2 border-dashed border-border/50 bg-black/[0.02]">
                <Text className="text-secondary text-xl italic text-center">
                    {searchQuery || statusFilter !== 'all'
                        ? 'No tasks found. Try adjusting your filters.'
                        : 'No tasks found. Begin by creating one.'}
                </Text>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-background">
            {/* Header Section */}
            <View className="px-6 pt-12 pb-6 border-b border-border/40">
                <View className="mb-6">
                    <Text className="text-4xl font-bold text-primary tracking-tight mb-2">
                        My Tasks
                    </Text>
                    <Text className="text-base text-secondary italic">
                        "Order is the sanity of the mind."
                    </Text>
                </View>

                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="bg-primary px-6 py-3 shadow-lg"
                    >
                        <Text className="text-white uppercase tracking-widest text-xs font-bold">
                            Logout
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/task/new')}
                        className="bg-primary px-6 py-3 shadow-lg flex-1"
                    >
                        <Text className="text-white uppercase tracking-widest text-xs font-bold text-center">
                            New Task
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Controls Section */}
            <View className="px-6 py-6 space-y-6">
                {/* Search Bar with Floating Label */}
                <View className="relative">
                    <TextInput
                        className="peer w-full border-b-2 border-border py-2 text-primary placeholder-transparent focus:border-primary bg-transparent text-lg"
                        placeholder="Search tasks..."
                        placeholderTextColor="transparent"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Text className={`absolute left-0 transition-all text-secondary ${searchQuery
                        ? '-top-3.5 text-sm'
                        : 'top-2 text-base'
                        }`}>
                        Search tasks
                    </Text>
                </View>

                {/* Filter Dropdown */}
                <TouchableOpacity
                    onPress={() => setShowFilterModal(true)}
                    className="bg-white border border-border px-4 py-3 flex-row justify-between items-center"
                >
                    <Text className="text-primary font-medium">
                        {FILTER_OPTIONS.find(opt => opt.value === statusFilter)?.label || 'All Tasks'}
                    </Text>
                    <Text className="text-secondary">▼</Text>
                </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error && (
                <View className="mx-6 mb-4 p-4 bg-red-50 border-l-4 border-red-500">
                    <Text className="text-red-700 text-sm">{error}</Text>
                </View>
            )}

            {/* Tasks List */}
            {loading && !refreshing ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#2a2a2a" />
                    <Text className="text-secondary mt-4">Loading tasks...</Text>
                </View>
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View className="px-6 mb-4">
                            <TaskCard task={item} onDelete={() => fetchTasks(true)} />
                        </View>
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#2a2a2a"
                        />
                    }
                    ListEmptyComponent={
                        <View className="px-6">
                            {renderEmptyState()}
                        </View>
                    }
                    contentContainerStyle={tasks.length === 0 ? { flex: 1, paddingHorizontal: 24 } : { paddingBottom: 24 }}
                />
            )}

            {/* Filter Modal */}
            <Modal
                visible={showFilterModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowFilterModal(false)}
            >
                <TouchableOpacity
                    className="flex-1 bg-black/50 justify-center items-center"
                    activeOpacity={1}
                    onPress={() => setShowFilterModal(false)}
                >
                    <View className="bg-white w-4/5 max-w-sm">
                        <View className="border-b border-border px-6 py-4">
                            <Text className="text-lg font-bold text-primary tracking-tight">Filter by Status</Text>
                        </View>
                        {FILTER_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                onPress={() => {
                                    setStatusFilter(option.value);
                                    setShowFilterModal(false);
                                }}
                                className={`px-6 py-4 border-b border-border/30 ${statusFilter === option.value ? 'bg-black/[0.02]' : ''
                                    }`}
                            >
                                <Text
                                    className={`text-base ${statusFilter === option.value
                                        ? 'text-primary font-bold'
                                        : 'text-secondary'
                                        }`}
                                >
                                    {option.label}
                                    {statusFilter === option.value && ' ✓'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}
