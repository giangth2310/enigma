import React from 'react';
import {createBottomTabNavigator, createSwitchNavigator, createStackNavigator} from 'react-navigation';
import SigninScreen from './containers/SigninScreen';
import FriendScreen from './containers/FriendScreen';
import ChatScreen from './containers/ChatScreen';
import {Icon} from 'react-native-elements';
import Header from './components/Header';
import SearchScreen from './containers/SearchScreen';
import SearchBarHeader from './components/SearchBarHeader';
import ProfileScreen from './containers/ProfileScreen';

const BottomTabNavigation = createBottomTabNavigator({
  Chat: {
    screen: ChatScreen,
  },
  Friend: {
    screen: FriendScreen,
  }
}, {
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let IconComponent = Icon;
      let iconName;
      let type;

      if (routeName === 'Chat') {
        iconName = 'message1';
        type = 'antdesign';
      } else if (routeName === 'Friend') {
        iconName = 'people';
        type = 'simple-line-icon';
      }

      return <IconComponent name={iconName} type={type} size={32} color={tintColor} />;
    },
    tabBarOptions: {
      activeTintColor: 'black',
      inactiveTintColor: 'gray',
      showLabel: false,
    }
  }),
})

const App = createStackNavigator({
  BottomTabNavigation: {
    screen: BottomTabNavigation,
    navigationOptions: {
      header: props => <Header {...props} />
    }
  },
  Search: {
    screen: SearchScreen,
    navigationOptions: {
      headerTitle: props => <SearchBarHeader {...props}  />
    }
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      title: 'Profile'
    }
  }
})

export default createSwitchNavigator({
  Auth: {
    screen: SigninScreen,
  },
  App
})