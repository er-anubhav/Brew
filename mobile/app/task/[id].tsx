import { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Task, TaskPriority, TaskStatus } from '../../types/task';
import { getTaskById, deleteTask } from '../../services/api';

const getStatusBadgeStyle = (status: TaskStatus): string => {
    switch (status) {
        case TaskStatus.TODO:
            return 'border-amber-200 text-amber-700 bg-amber-50';
        case TaskStatus.INPROGRESS:
            return 'border-blue-200 text-blue-700 bg-blue-50';
        case TaskStatus.DONE:
            return 'border-emerald-200 text-emerald-700 bg-emerald-50';
        default:
            return 'border-gray-200 text-gray-700 bg-gray-50';
    }
};

const getStatusText = (status: TaskStatus): string => {
    switch (status) {
        case TaskStatus.TODO:
            return 'To Do';
        case TaskStatus.INPROGRESS:
            return 'In Progress';
        case TaskStatus.DONE:
            return 'Done';
        default:
            return status;
    }
};

const formatDate = (dateString?: string): string => {
    if (!dateString) return 'No due date';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
};

const PriorityIndicator = ({ priority }: { priority: TaskPriority }) => {
    const dots = priority === TaskPriority.HIGH ? 3 : priority === TaskPriority.MEDIUM ? 2 : 1;

    return (
        <View className="flex-row gap-1">
            {[1, 2, 3].map((dot) => (
                <View
                    key={dot}
                    className={`w-1.5 h-1.5 transform rotate-45 ${dot <= dots ? 'bg-primary' : 'bg-gray-200'
                        }`}
                />
            ))}
        </View>
    );
};

export default function TaskDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchTask();
    }, [id]);

    const fetchTask = async () => {
        try {
            setLoading(true);
            const response = await getTaskById(id as string);
            setTask(response.data.data.task);
        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to load task';
            Toast.show({ type: 'error', text1: 'Error', text2: message });
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: confirmDelete,
                },
            ]
        );
    };

    const confirmDelete = async () => {
        try {
            setDeleting(true);
            await deleteTask(id as string);
            Toast.show({ type: 'success', text1: 'Success', text2: 'Task deleted successfully! 🗑️' });
            router.back();
        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to delete task';
            Toast.show({ type: 'error', text1: 'Error', text2: message });
        } finally {
            setDeleting(false);
        }
    };

    const handleEdit = () => {
        router.push(`/task/new?id=${id}`);
    };

    if (loading) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#2a2a2a" />
                <Text className="text-secondary mt-4">Loading task...</Text>
            </View>
        );
    }

    if (!task) {
        return (
            <View className="flex-1 bg-background justify-center items-center p-8">
                <Text className="text-xl font-semibold text-primary mb-2">Task not found</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4">
                    <Text className="text-primary font-bold">Go back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            <ScrollView className="flex-1">
                <View className="px-6 pt-12 pb-6">
                    {/* Header */}
                    <View className="flex-row justify-between items-start mb-6 border-b border-border/40 pb-6">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text className="text-2xl text-primary">←</Text>
                        </TouchableOpacity>
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={handleEdit}
                                className="bg-primary px-6 py-2"
                            >
                                <Text className="text-white uppercase tracking-widest text-xs font-bold">
                                    Edit
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleDelete}
                                disabled={deleting}
                                className="bg-red-500 px-6 py-2"
                            >
                                {deleting ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text className="text-white uppercase tracking-widest text-xs font-bold">
                                        Delete
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Status Badge */}
                    <View className="mb-6">
                        <View className={`px-3 py-1 border self-start ${getStatusBadgeStyle(task.status)}`}>
                            <Text className="text-[10px] font-bold uppercase tracking-widest">
                                {getStatusText(task.status)}
                            </Text>
                        </View>
                    </View>

                    {/* Title */}
                    <Text className="text-3xl font-bold text-primary mb-6 tracking-tight">
                        {task.title}
                    </Text>

                    {/* Due Date & Priority */}
                    <View className="bg-white border border-border/50 p-6 mb-6">
                        <View className="flex-row justify-between items-end">
                            <View>
                                <Text className="text-[10px] uppercase tracking-widest text-secondary/60 font-bold mb-2">
                                    Due Date
                                </Text>
                                <Text className="text-base text-primary font-medium">
                                    {formatDate(task.dueDate)}
                                </Text>
                            </View>
                            <View>
                                <Text className="text-[10px] uppercase tracking-widest text-secondary/60 font-bold mb-2 text-right">
                                    Priority
                                </Text>
                                <PriorityIndicator priority={task.priority} />
                            </View>
                        </View>
                    </View>

                    {/* Description */}
                    {task.description && (
                        <View className="bg-white border border-border/50 p-6 mb-6">
                            <Text className="text-[10px] uppercase tracking-widest text-secondary/60 font-bold mb-3">
                                Description
                            </Text>
                            <Text className="text-base text-primary leading-relaxed">
                                {task.description}
                            </Text>
                        </View>
                    )}

                    {/* Metadata */}
                    <View className="bg-black/[0.02] border border-border/50 p-6">
                        <View className="mb-4">
                            <Text className="text-[10px] uppercase tracking-widest text-secondary/60 font-bold mb-2">
                                Created
                            </Text>
                            <Text className="text-sm text-primary">
                                {new Date(task.createdAt).toLocaleString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                })}
                            </Text>
                        </View>
                        <View>
                            <Text className="text-[10px] uppercase tracking-widest text-secondary/60 font-bold mb-2">
                                Last Updated
                            </Text>
                            <Text className="text-sm text-primary">
                                {new Date(task.updatedAt).toLocaleString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                })}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
