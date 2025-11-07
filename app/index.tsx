import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react'
import LoginForm from '../components/LoginForm';

import "../FirebaseConfig";
import '../global.css';


const Index: React.FC = () => {
  

  return (
    <SafeAreaView>
      <View>
        <Text className='text-2xl font-bold mb-4 items-center justify-center flex text-center mt-20'>Volunteer App</Text>
        <LoginForm className='' />
      </View>
    </SafeAreaView>
  )
}

export default Index;