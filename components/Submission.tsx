import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { CircleArrowLeft, ClipboardCheck } from 'lucide-react-native';
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
    <View className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4">
      <TouchableOpacity
        className="flex w-[21rem] flex-row items-center justify-center gap-3 rounded-lg bg-red-500 py-5 drop-shadow-lg"
        onPress={onRelease}
        disabled={isReleasing}>
        <CircleArrowLeft size="25" color="white" strokeWidth="3" />
        <Text className="text-2xl font-bold text-white">
          {isReleasing ? 'Returning...' : 'Return Job'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex w-[21rem] flex-row items-center justify-center gap-3 rounded-lg border-[1px] py-5 drop-shadow-lg ${isDark ? 'border-gray-600 bg-gray-700' : 'border-slate-300 bg-white'}`}>
        <Text className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
          Get Directions
        </Text>
      </TouchableOpacity>
      <TextInput
        placeholder="How did it go..."
        placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
        className={`w-[21rem] rounded-lg border-[1px] py-5 pl-3 text-xl ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-slate-300 bg-white'}`}
        onChangeText={setMessage}
        value={message}
        multiline
      />
      <TouchableOpacity
        className="flex w-[21rem] flex-row items-center justify-center gap-3 rounded-lg bg-green-500 py-5 drop-shadow-lg"
        onPress={() => onSubmit(message)}
        disabled={isSubmitting}>
        <Text className="text-2xl font-bold text-white">
          {isSubmitting ? 'Submitting...' : 'Submit Job'}
        </Text>
        <ClipboardCheck size="25" color="white" strokeWidth="3" />
      </TouchableOpacity>
    </View>
  );
};

export default Submission;
