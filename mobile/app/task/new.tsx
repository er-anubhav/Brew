import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { TaskPriority, TaskStatus } from '../../types/task';
import { createTask, updateTask, getTaskById } from '../../services/api';

interface TaskFormData {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate?: Date;
}

const PRIORITY_OPTIONS = [
    { label: 'Low', value: TaskPriority.LOW },
    { label: 'Medium', value: TaskPriority.MEDIUM },
    { label: 'High', value: TaskPriority.HIGH },
];

const STATUS_OPTIONS = [
    { label: 'To Do', value: TaskStatus.TODO },
    { label: 'In Progress', value: TaskStatus.INPROGRESS },
    { label: 'Done', value: TaskStatus.DONE },
];

export default function TaskFormScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [fetchingTask, setFetchingTask] = useState(isEditMode);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<TaskFormData>({
        defaultValues: {
            title: '',
            description: '',
            priority: TaskPriority.MEDIUM,
            status: TaskStatus.TODO,
            dueDate: undefined,
        },
    });

    const selectedDate = watch('dueDate');

    useEffect(() => {
        if (isEditMode) {
            fetchTask();
        }
    }, [id]);

    const fetchTask = async () => {
        try {
            setFetchingTask(true);
            const response = await getTaskById(id as string);
            const task = response.data.data.task;

            setValue('title', task.title);
            setValue('description', task.description || '');
            setValue('priority', task.priority);
            setValue('status', task.status);
            if (task.dueDate) {
                setValue('dueDate', new Date(task.dueDate));
            }
        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to load task';
            Toast.show({ type: 'error', text1: 'Error', text2: message });
            router.back();
        } finally {
            setFetchingTask(false);
        }
    };

    const onSubmit = async (data: TaskFormData) => {
        try {
            setLoading(true);

            const payload = {
                title: data.title,
                description: data.description,
                priority: data.priority,
                status: data.status,
                dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
            };

            if (isEditMode) {
                await updateTask(id as string, payload);
                Toast.show({ type: 'success', text1: 'Success', text2: 'Task updated successfully! ✅' });
            } else {
                await createTask(payload);
                Toast.show({ type: 'success', text1: 'Success', text2: 'Task created successfully! 🎉' });
            }

            router.back();
        } catch (error: any) {
            const message = error.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'create'} task`;
            Toast.show({ type: 'error', text1: 'Error', text2: message });
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (event: any, date?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            setValue('dueDate', date);
        }
    };

    const clearDate = () => {
        setValue('dueDate', undefined);
    };

    const formatDate = (date?: Date) => {
        if (!date) return 'No due date';
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (fetchingTask) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#2a2a2a" />
                <Text className="text-secondary mt-4">Loading task...</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-background">
            <View className="px-6 pt-12 pb-6">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-8 border-b border-border/40 pb-6">
                    <Text className="text-3xl font-bold text-primary tracking-tight">
                        {isEditMode ? 'Edit Task' : 'New Task'}
                    </Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text className="text-2xl text-secondary">✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Title Field */}
                <View className="mb-8">
                    <Controller
                        control={control}
                        name="title"
                        rules={{ required: 'Title is required' }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View className="relative">
                                <TextInput
                                    className={`peer w-full border-b-2 ${errors.title ? 'border-red-500' : 'border-border'
                                        } py-2 text-primary placeholder-transparent focus:border-primary bg-transparent text-lg`}
                                    placeholder="Task title"
                                    placeholderTextColor="transparent"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                />
                                <Text className={`absolute left-0 transition-all text-secondary ${value || errors.title
                                        ? '-top-3.5 text-sm'
                                        : 'top-2 text-base'
                                    }`}>
                                    Task Title {errors.title && <Text className="text-red-500">*</Text>}
                                </Text>
                            </View>
                        )}
                    />
                    {errors.title && (
                        <Text className="text-red-500 text-sm mt-1">{errors.title.message}</Text>
                    )}
                </View>

                {/* Description Field */}
                <View className="mb-8">
                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View className="relative">
                                <TextInput
                                    className="peer w-full border-b-2 border-border py-2 text-primary placeholder-transparent focus:border-primary bg-transparent text-lg"
                                    placeholder="Description"
                                    placeholderTextColor="transparent"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                />
                                <Text className={`absolute left-0 transition-all text-secondary ${value
                                        ? '-top-3.5 text-sm'
                                        : 'top-2 text-base'
                                    }`}>
                                    Description (optional)
                                </Text>
                            </View>
                        )}
                    />
                </View>

                {/* Priority Selection */}
                <View className="mb-8">
                    <Text className="text-sm uppercase tracking-widest text-secondary/60 font-bold mb-3">
                        Priority
                    </Text>
                    <Controller
                        control={control}
                        name="priority"
                        render={({ field: { onChange, value } }) => (
                            <View className="flex-row gap-px bg-border/20 p-px">
                                {PRIORITY_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        onPress={() => onChange(option.value)}
                                        className={`flex-1 py-3 ${value === option.value ? 'bg-primary' : 'bg-white'
                                            }`}
                                    >
                                        <Text
                                            className={`text-center text-xs uppercase tracking-widest font-bold ${value === option.value ? 'text-white' : 'text-secondary'
                                                }`}
                                        >
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    />
                </View>

                {/* Status Selection */}
                <View className="mb-8">
                    <Text className="text-sm uppercase tracking-widest text-secondary/60 font-bold mb-3">
                        Status
                    </Text>
                    <Controller
                        control={control}
                        name="status"
                        render={({ field: { onChange, value } }) => (
                            <View className="flex-row gap-px bg-border/20 p-px">
                                {STATUS_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        onPress={() => onChange(option.value)}
                                        className={`flex-1 py-3 ${value === option.value ? 'bg-primary' : 'bg-white'
                                            }`}
                                    >
                                        <Text
                                            className={`text-center text-xs uppercase tracking-widest font-bold ${value === option.value ? 'text-white' : 'text-secondary'
                                                }`}
                                        >
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    />
                </View>

                {/* Due Date Picker */}
                <View className="mb-8">
                    <Text className="text-sm uppercase tracking-widest text-secondary/60 font-bold mb-3">
                        Due Date
                    </Text>
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            className="flex-1 bg-white border border-border px-4 py-3"
                        >
                            <Text className="text-primary">{formatDate(selectedDate)}</Text>
                        </TouchableOpacity>
                        {selectedDate && (
                            <TouchableOpacity
                                onPress={clearDate}
                                className="bg-red-500 px-4 py-3"
                            >
                                <Text className="text-white font-bold uppercase text-xs tracking-widest">Clear</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                        minimumDate={new Date()}
                    />
                )}

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading}
                    className={`bg-primary py-4 items-center shadow-lg ${loading ? 'opacity-50' : ''
                        }`}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white uppercase tracking-widest text-sm font-bold">
                            {isEditMode ? 'Update Task' : 'Create Task'}
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mt-3 py-4 items-center border border-border"
                >
                    <Text className="text-primary uppercase tracking-widest text-sm font-bold">Cancel</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
