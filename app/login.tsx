import { Text, View } from 'react-native';
import { Component } from 'react';
import LoginForm from '../components/LoginForm';

export default class login extends Component {
  render() {
    return (
      <View>
        <Text className="mb-4 mt-20 flex items-center justify-center text-center text-2xl font-bold">
          Volunteer App
        </Text>
        <LoginForm className="" />
      </View>
    );
  }
}
