import React, {Component} from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import LogoImage from '../assets/logo.png';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import * as actions from '../actions';

class LoginScreen extends Component {
  state = {
    loading: true
  }

  async componentDidMount() {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      const credential = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken);
      const {user} = await firebase.auth().signInWithCredential(credential);

      const payload = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastSignIn: Date.now(),
      }
      this.props.signInSuccess(payload);

      const userRef = firebase.database().ref(`/users/${user.uid}`);
      userRef.update({
        lastSignIn: payload.lastSignIn,
        online: true
      })
      userRef.onDisconnect().update({
        lastSignIn: Date.now(),
        online: false
      })

      this.props.navigation.navigate('App');
    } catch (error) {
      if (error.code != statusCodes.SIGN_IN_REQUIRED) {
        console.log(error);
      }
      this.setState({loading: false});
    }
  }

  signIn = async () => {
    this.setState({loading: true});
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken);
      const {user} = await firebase.auth().signInWithCredential(credential);

      const payload = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastSignIn: Date.now(),
        online: true
      }
      this.props.signInSuccess(payload);
      firebase.database().ref(`/users/${user.uid}`).set(payload);
      this.props.navigation.navigate('App')
    } catch (error) {
      console.log(error)
      this.setState({ loading: false });
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

export default connect(null, actions)(LoginScreen);