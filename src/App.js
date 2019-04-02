import React, {Component} from 'react';
import {View, Text} from 'react-native';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { createAppContainer } from "react-navigation";
import AppNavigator from './Container/LoginScreen';

const AppContainer = createAppContainer(AppNavigator);

class App extends Component {
  render() {
    return <AppContainer />;
  }
}

export default App;