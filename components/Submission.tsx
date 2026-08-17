import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { CircleArrowLeft, ClipboardCheck, AlertCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { useAppTheme } from '@/components/ThemeProvider';

interface SubmissionProps {
  onRelease: () => void;
  onSubmit: (message: string) => void;
  isReleasing?: boolean;
  isSubmitting?: boolean;
}

const Submission = ({ onRelease, onSubmit, isReleasing, isSubmitting }: SubmissionProps) => {
  const [message, setMessage] = useState('');
  const { isDark } = useAppTheme();

  return (
    <View className="w-full">
      {/* Header Status Badge */}
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5 rounded-full bg-teal-500/10 px-3 py-1 dark:bg-teal-500/20">
          <AlertCircle size={14} color="#006767" />
          <Text className="text-[11px] font-bold tracking-wider text-primary dark:text-teal-400">
            RESPONSE IN PROGRESS
          </Text>
        </View>
      </View>

      <Text
        className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-on-surface'}`}>
        Incident Resolution
      </Text>
      <Text className={`mt-0.5 text-xs ${isDark ? 'text-gray-400' : 'text-on-surface-variant'}`}>
        Document the outcome or assistance provided below before completing the task.
      </Text>

      {/* Report Notes Input */}
      <View className="my-4">
        <TextInput
          placeholder="Enter incident resolution notes (e.g. assistance provided, individual escorted, services alerted)..."
          placeholderTextColor={isDark ? '#9ca3af' : '#94a3b8'}
          className={`min-h-[90px] rounded-2xl border p-3.5 text-sm leading-5 ${
            isDark
              ? 'border-gray-700/80 bg-gray-800/60 text-white'
              : 'border-slate-200/80 bg-surface-container-low text-on-surface'
          }`}
          onChangeText={setMessage}
          value={message}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Action Buttons */}
      <View className="gap-2.5">
        <TouchableOpacity
          className={`h-[52px] w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-sm shadow-teal-900/30 active:scale-[0.99] ${
            isSubmitting ? 'opacity-70' : 'opacity-100'
          }`}
          onPress={() => onSubmit(message)}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <ClipboardCheck size={18} color="white" strokeWidth={2.2} />
              <Text className="text-[17px] font-semibold text-white">Complete & Submit Report</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className={`h-11 w-full flex-row items-center justify-center gap-2 rounded-xl border ${
            isDark ? 'border-red-900/50 bg-red-950/30' : 'border-red-200 bg-red-50'
          } active:opacity-75`}
          onPress={onRelease}
          disabled={isReleasing}>
          {isReleasing ? (
            <ActivityIndicator color="#dc2626" />
          ) : (
            <>
              <CircleArrowLeft size={16} color="#dc2626" />
              <Text className="text-sm font-semibold text-red-600 dark:text-red-400">
                Return Job to Dispatch
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Submission;
