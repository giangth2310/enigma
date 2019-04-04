import React, {Component} from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import LogoImage from '../assets/logo.png';
import firebase from 'react-native-firebase';

class LoginScreen extends Component {
  state = {
    loading: true
  }

  async componentDidMount() {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      const credential = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken);
      await firebase.auth().signInWithCredential(credential);
      this.props.navigation.navigate('main')
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
        this.setState({loading: false});
      } else {
        // some other error
        console.log(error);
      }
    }
  }

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken);
      await firebase.auth().signInWithCredential(credential);
      this.props.navigation.navigate('main')
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image source={LogoImage}></Image>
          <Text style={styles.welcomeText}>Welcome to enigma</Text>
        </View>
        {this.state.loading ? <ActivityIndicator size="large" color="#0000ff" /> : (
        <GoogleSigninButton
          style={styles.signinBtn}
          onPress={this.signIn}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}/>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  signinBtn: { 
    height: 50, 
    width: 250 
  }, 
  logo: {
    alignItems: 'center'
  },
  welcomeText: {
    fontSize: 35,
    fontWeight: '400'
  }
})

export default LoginScreen;