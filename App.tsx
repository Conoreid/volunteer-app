import LoginForm from './components/LoginForm';
import { Text } from 'react-native';
import "./FirebaseConfig";

import './global.css';

export default function App() {
  return (
    <>
      <Text className='text-2xl font-bold mb-4 items-center justify-center flex text-center mt-20'>Volunteer App</Text>
      <LoginForm className='h-[60vh]' />
    </>
  );
}
