import React, { Component } from 'react';
import { View } from 'react-native';
import { Avatar, Text, Button, Icon } from 'react-native-elements';
import {connect} from 'react-redux';
import { GoogleSignin } from 'react-native-google-signin';
import firebase from 'react-native-firebase';

class ProfileScreen extends Component {
  signOut = async () => {
    const {uid} = this.props.auth;
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      firebase.database().ref(`/users/${uid}`).update({
        lastSignIn: Date.now(),
        online: false
      })
      this.props.navigation.navigate('Auth');
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const {photoURL, displayName, email} = this.props.auth;

    return (
      <View style={{
        flex: 1
      }}>
        <View style={{
            flex: 1,
            alignItems: 'center',
            marginBottom: 10
          }}>
          <Avatar
            containerStyle={{
              marginVertical: 20
            }}
            rounded
            size='xlarge'
            source={{
              uri: photoURL,
            }}
          ></Avatar>
          <Text h3 style={{ color: 'black' }}>
            {displayName}
          </Text>
          <Text style={{
            fontSize: 18,
            marginTop: 10
          }}>
            {email}
          </Text>
        </View>
        <View style={{
          flex: 1
        }}>
          <Text style={{fontSize: 16, fontWeight: '500', marginTop: 20,marginBottom: 5, marginHorizontal: 30}}>Account</Text>
          <Button
            icon={(
              <Icon
                name='logout'
                type='antdesign'
                iconStyle={{
                  color: 'red',
                  marginRight: 20,
                  marginLeft: 30
                }}
                size={28}
                ></Icon>
            )}
            buttonStyle={{
              justifyContent: 'flex-start',
            }}
            titleStyle={{
              color: '#000',
              fontWeight: '300'
            }}
            type='clear'
            title='Sign out'
            onPress={this.signOut} />
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default connect(mapStateToProps)(ProfileScreen);