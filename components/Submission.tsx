import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { CircleArrowLeft, ClipboardCheck } from 'lucide-react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';

interface SubmissionProps {
  onAccept: () => void;
}

const Submission = ({ onAccept }: SubmissionProps) => {
    const [value, onChangeText] = React.useState('How did it go...');
  return (
    <View className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4">
      <TouchableOpacity className="flex w-[21rem] flex-row items-center justify-center gap-3 rounded-lg bg-red-500 py-5 drop-shadow-lg">
        <CircleArrowLeft size="25" color="white" strokeWidth="3" />
        <Text className="text-2xl font-bold text-white">Return Job</Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex w-[21rem] flex-row items-center justify-center gap-3 rounded-lg border-[1px] border-slate-300 py-5 drop-shadow-lg">
        <Text className="text-2xl font-bold text-slate-800">Get Directions</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="How did it go..."
        className="w-[21rem] py-5 rounded-lg border-[1px] border-slate-300 pl-3 text-xl"
      />
      <TouchableOpacity
        className="flex w-[21rem] flex-row items-center justify-center gap-3 rounded-lg bg-green-500 py-5 drop-shadow-lg"
        onPress={onAccept}>
        <Text className="text-2xl font-bold text-white">Submit Job</Text>
        <ClipboardCheck size="25" color="white" strokeWidth="3" />
      </TouchableOpacity>
    </View>
  );
};

export default Submission;
