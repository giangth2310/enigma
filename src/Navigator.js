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
import FriendRequestScreen from './containers/FriendRequestScreen';
import MessageScreen from './containers/MessageScreen';
import ChatHeader from './components/ChatHeader';
import LocationScreen from './containers/LocationScreen';

const BottomTabNavigation = createBottomTabNavigator({
  Message: {
    screen: MessageScreen,
  },
  Friend: {
    screen: FriendScreen,
  }
}, {
  initialRouteName: 'Friend',
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let IconComponent = Icon;
      let iconName;
      let type;

      if (routeName === 'Message') {
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
  },
  FriendRequest: {
    screen: FriendRequestScreen,
    navigationOptions: {
      title: 'Friend Requests'
    }
  },
  Chat: {
    screen: ChatScreen,
    navigationOptions: {
      headerTitle: props => <ChatHeader {...props} />
    }
  },
  Location: {
    screen: LocationScreen,
    navigationOptions: {
      title: 'Location'
    }
  }
})

export default createSwitchNavigator({
  Auth: {
    screen: SigninScreen,
  },
  App
})