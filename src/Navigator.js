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
import VideoScreen from './containers/VideoScreen';

const BottomTabNavigation = createBottomTabNavigator({
  Message: {
    screen: MessageScreen,
  },
  Friend: {
    screen: FriendScreen,
  }
}, {
  initialRouteName: 'Message',
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
    navigationOptions: ({navigation}) => ({
      headerTitle: props => <ChatHeader {...props} navigation={navigation} />
    })
  },
  Location: {
    screen: LocationScreen,
    navigationOptions: {
      title: 'Location'
    }
  },
  Video: {
    screen: VideoScreen,
    navigationOptions: {
      header: null
    }
  },
})

export default createSwitchNavigator({
  Auth: {
    screen: SigninScreen,
  },
  App
})