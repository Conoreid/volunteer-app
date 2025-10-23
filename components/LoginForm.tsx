import React from 'react';
import { View, ViewProps, StyleProp, ViewStyle, TextInput, TouchableOpacity, Text } from 'react-native';
import { useState } from 'react';

interface ComponentNameProps extends ViewProps {
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export default function ComponentName({ className = '', style, ...props }: ComponentNameProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log("Email:", email);
        console.log("Password:", password);
        setPassword('');
        setEmail('');
    };
  
    return (
    <View
      className={`flex flex-col items-center justify-center rounded-lg p-4 ${className}`}
      style={style}
      {...props}>
      <TextInput 
        placeholder="Email" 
        value={email}
        onChangeText={setEmail}
        className="mb-10 pl-4 p-3 text-xl  bg-[#F5F5FA] rounded-lg w-60 h-16" />
      <TextInput 
        placeholder="Password" 
        secureTextEntry={true} 
        value={password}
        onChangeText={setPassword}
        className="mb-10 pl-4 p-3 text-xl bg-[#F5F5FA] rounded-lg w-60 h-16" />
        <TouchableOpacity onPress={handleLogin} className='bg-blue-600 hover:opacity-70 p-3 justify-center items-center rounded-lg w-60 h-16'>
            <Text className='text-center text-white font-semibold text-xl'>Login</Text>
        </TouchableOpacity>
    </View>
  );
}
