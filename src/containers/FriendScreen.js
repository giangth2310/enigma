import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import {Text, ListItem} from 'react-native-elements';
import {connect} from 'react-redux';
import firebase from 'react-native-firebase';
import StatusAvatar from '../components/StatusAvatar';

class FriendScreen extends Component {
  state = {
    friendList: []
  }

  componentDidMount() {
    firebase.database().ref('/users').on('value', snapshot => {
      const {friends} = this.props.auth;
      const friendList = [];
      const users = snapshot.val();
      for (let id in friends) {
        if (friends[id].status === 'accept') {
          const {displayName, photoURL, online} = users[id];
          if (online) {
            friendList.unshift({ displayName, photoURL, online, id })
          } else {
            friendList.push({displayName, photoURL, online, id})
          }
        }
      }

      this.setState({friendList});
    })
  }

  renderItem = ({ item, index }) => {
    const { id, photoURL, online, displayName } = item;

    return (
      <ListItem
        key={id}
        title={displayName}
        titleStyle={{
          color: 'black'
        }}
        leftElement={(
          <StatusAvatar online={online}
            source={{
              uri: photoURL,
            }} />
        )}
        rightTitle={online ? 'Online' : 'Offline'}
        rightTitleStyle={online ? { color: '#5cb85c', fontWeight: '500'} : {fontStyle: 'italic'}}
      ></ListItem>
    )
  }
  
  render() {
    const {friendList} = this.state;
    if (friendList.length === 0) {
      return (
        <View style={{alignItems: 'center', marginTop: 20}}>
          <Text>You don't have any friends</Text>
          <Text>Let search and add a friend</Text>
        </View>
      )
    }

    return (
      <FlatList
        keyExtractor={item => item.id}
        data={this.state.friendList}
        renderItem={this.renderItem}
      ></FlatList>
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default connect(mapStateToProps)(FriendScreen);