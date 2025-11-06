import { Text, View } from 'react-native'
import React, { Component } from 'react'
import LoginForm from '../components/LoginForm';
import "../FirebaseConfig";
import '../global.css';


export default class index extends Component {
  render() {
    return (
      <View>
        <Text className='text-2xl font-bold mb-4 items-center justify-center flex text-center mt-20'>Volunteer App</Text>
        <LoginForm className='' />
      </View>
    )
  }
}