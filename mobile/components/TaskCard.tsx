import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Toast from 'react-native-toast-message';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import { deleteTask } from '../services/api';

interface TaskCardProps {
    task: Task;
    onDelete?: () => void;
}

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
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

// Priority indicator using diamond dots like web
const PriorityIndicator = ({ priority }: { priority: TaskPriority }) => {
    const dots = priority === TaskPriority.HIGH ? 3 : priority === TaskPriority.MEDIUM ? 2 : 1;

    return (
        <View className="flex-row gap-1">
            {[1, 2, 3].map((dot) => (
                <View
                    key={dot}
                    className={`w-1 h-1 transform rotate-45 ${dot <= dots ? 'bg-primary' : 'bg-gray-200'
                        }`}
                />
            ))}
        </View>
    );
};

export default function TaskCard({ task, onDelete }: TaskCardProps) {
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);
    const [pressed, setPressed] = useState(false);

    const handleDelete = () => {
        Alert.alert(
            'Delete Task',
            `Are you sure you want to delete "${task.title}"?`,
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
            await deleteTask(task._id);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Task deleted successfully! 🗑️'
            });
            onDelete?.();
        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to delete task';
            Toast.show({ type: 'error', text1: 'Error', text2: message });
        } finally {
            setDeleting(false);
        }
    };

    const renderRightActions = () => (
        <TouchableOpacity
            onPress={handleDelete}
            disabled={deleting}
            className="bg-red-500 justify-center items-center px-6"
            style={{ width: 100 }}
        >
            {deleting ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <>
                    <Text className="text-white text-2xl mb-1">🗑️</Text>
                    <Text className="text-white font-semibold uppercase text-xs tracking-widest">Delete</Text>
                </>
            )}
        </TouchableOpacity>
    );

    return (
        <Swipeable
            renderRightActions={renderRightActions}
            overshootRight={false}
            friction={2}
        >
            <TouchableOpacity
                onPress={() => router.push(`/task/${task._id}`)}
                onPressIn={() => setPressed(true)}
                onPressOut={() => setPressed(false)}
                className="bg-white border border-border/50 p-6 relative"
                disabled={deleting}
                activeOpacity={0.9}
            >
                {/* Top accent line - shows on press */}
                <View
                    className={`absolute top-0 left-0 right-0 h-0.5 bg-primary transition-all ${pressed ? 'opacity-100' : 'opacity-0'
                        }`}
                />

                {/* Status Badge */}
                <View className="mb-4">
                    <View className={`px-3 py-1 border self-start ${getStatusBadgeStyle(task.status)}`}>
                        <Text className="text-[10px] font-bold uppercase tracking-widest">
                            {getStatusText(task.status)}
                        </Text>
                    </View>
                </View>

                {/* Title */}
                <Text className="text-xl font-bold text-primary mb-3" numberOfLines={2}>
                    {task.title}
                </Text>

                {/* Description */}
                {task.description && (
                    <Text className="text-sm text-secondary mb-4 leading-relaxed" numberOfLines={3}>
                        {task.description}
                    </Text>
                )}

                {/* Footer: Due Date & Priority */}
                <View className="mt-4 pt-4 border-t border-border/20 flex-row justify-between items-end">
                    <View>
                        <Text className="text-[10px] uppercase tracking-widest text-secondary/60 font-bold mb-1">
                            Due Date
                        </Text>
                        <Text className="text-sm text-primary font-medium">
                            {formatDate(task.dueDate)}
                        </Text>
                    </View>

                    <PriorityIndicator priority={task.priority} />
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
}
