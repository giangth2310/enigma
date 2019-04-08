import React, {Component} from 'react';
import {View, FlatList} from 'react-native';
import {connect} from 'react-redux';
import firebase from 'react-native-firebase';
import * as actions from '../actions';
import {Button, Icon, ListItem, Text} from 'react-native-elements';
import StatusAvatar from '../components/StatusAvatar';

class FriendRequestScreen extends Component {
  state = {
    friendRequest: []
  }

  async componentDidMount() {
    const { friends, uid } = this.props.auth;
    const friendRequest = [];
    for (let id in friends) {
      const {status, from, to} = friends[id];
      if (status === 'pending' && to === uid) {
        const snapshot = await firebase.database().ref(`/users/${from}`).once('value');        
        const {displayName, email, photoURL, online, uid} = snapshot.val();
        friendRequest.push({displayName, email, photoURL, online, id: uid, accept: false});
      }
    }

    this.setState({friendRequest});
  }

  acceptFriendRequest = (index) => {
    const { uid } = this.props.auth;
    const fromId = this.state.friendRequest[index].id;

    const updateData = {
      lastUpdate: Date.now(),
      status: 'accept'
    }
    firebase.database().ref(`/users/${fromId}/friends/${uid}`).update(updateData);
    firebase.database().ref(`/users/${uid}/friends/${fromId}`).update(updateData);

    const friendRequest = [...this.state.friendRequest];
    friendRequest[index] = {
      ...friendRequest[index],
      accept: true
    }
    this.setState({friendRequest});
  }

  renderItem = ({ item, index }) => {
    const { id, photoURL, online, displayName, email, accept } = item;

    let friendStatus = (
      <Button
        title='Accept'
        type='outline'
        buttonStyle={{
          width: 80
        }}
        onPress={() => this.acceptFriendRequest(index)}
      ></Button>
    )

    if (accept) {
      friendStatus = (
        <View style={{
          width: 80
        }}>
          <Icon color='#5cb85c'
            name='done'
            size={32}></Icon>
        </View>
      )
    }

    return (
      <ListItem
        key={id}
        title={displayName}
        titleStyle={{
          color: 'black'
        }}
        subtitle={email}
        subtitleStyle={{
          fontSize: 10
        }}
        leftElement={(
          <StatusAvatar online={online}
            source={{
              uri: photoURL,
            }} />
        )}
        rightElement={friendStatus}
      ></ListItem>
    )
  }

  render() {
    if (this.state.friendRequest.length === 0) {
      return (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text>You have 0 friend request!</Text>
        </View>
      )
    }

    return (
      <FlatList
        keyExtractor={item => item.id}
        data={this.state.friendRequest}
        renderItem={this.renderItem}
      ></FlatList>
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default connect(mapStateToProps, actions)(FriendRequestScreen);