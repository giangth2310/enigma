import React from 'react';
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation';
import SigninScreen from './containers/SigninScreen';
import FriendScreen from './containers/FriendScreen';
import FriendRequestScreen from './containers/FriendRequestScreen';
import MessageScreen from './containers/MessageScreen';

const mainScreen = createBottomTabNavigator({
  MessageScreen,
  FriendScreen,
  FriendRequestScreen
})

export default createStackNavigator({
  auth: {
    screen: SigninScreen
  },
  main: {
    screen: mainScreen
  }
}, {
  initialRouteName: "auth",
  headerMode: 'none'
})