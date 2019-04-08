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

  updateUserData = (user) => {
    const userRef = firebase.database().ref(`/users/${user.uid}`);
    userRef.on('value', snapshot => {
      const userData = snapshot.val();
      this.props.updateUserData(userData);
    })
    userRef.update({
      lastSignIn: Date.now(),
      online: true
    })
    userRef.onDisconnect().update({
      lastSignIn: Date.now(),
      online: false
    })
  }

  createUser = (user) => {
    const payload = {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid
    }
    firebase.database().ref(`/users/${user.uid}`).set(payload);
  } 

  async componentDidMount() {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      const credential = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken);
      const {user} = await firebase.auth().signInWithCredential(credential);
      this.updateUserData(user);
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

      const userData = await firebase.database().ref(`/users/${user.uid}`).once('value');
      console.log(userData.val());
      if (!userData.val()) {
        this.createUser(user);
      }

      this.updateUserData(user);
      this.props.navigation.navigate('App');
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