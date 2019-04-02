import React, {Component} from "react";
import { View, Text, Button } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import ExampleScreen from "./ExampleScreen";


class LoginScreen extends Component {
  componentDidMount() {
    GoogleSignin.configure({
      webClientId: '217407860699-qeprm9tf6v0pk37irmlcrr09jbf5vuu3.apps.googleusercontent.com'
    })
  }

  signIn =  () => {
    console.log('goi ham')
    GoogleSignin.signIn()
    .then(user => {
      console.log(user);
    })
    .catch(error => {
      console.log(error);
    })
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Text>asdasdsa</Text>
        <GoogleSigninButton
          style={{height: 50, width: 200}}
          onPress={this.signIn}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}/>
        <Button
          title="Go to Example"
          onPress={() => this.props.navigation.navigate('Example')}
        />
      </View>
    )
  }
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: LoginScreen,
  },
  Example: {
    screen: ExampleScreen,
  }
},
{
    initialRouteName: "Home"
}
);

export default AppNavigator;