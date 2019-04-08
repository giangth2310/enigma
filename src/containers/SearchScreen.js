import React, { Component } from 'react';
import { View, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import {connect} from 'react-redux';
import { ListItem, Icon, Text, Button } from 'react-native-elements';
import StatusAvatar from '../components/StatusAvatar';
import * as actions from '../actions';

class SearchScreen extends Component {
  sendFriendRequest = (toId) => {
    const {uid} = this.props.auth;

    const friendRequest = {
      status: 'pending',
      lastUpdate: Date.now(),
      from: uid,
      to: toId
    }

    this.props.sendFriendRequest(friendRequest);
  }

  acceptFriendRequest = (fromId) => {
    const { uid } = this.props.auth;

    this.props.acceptFriendRequest(fromId, uid);
  }

  renderItem = ({item}) => {
    const { id, photoURL, online, displayName, email, friends } = item;
    const {uid} = this.props.auth;

    let friendStatus = (
      <TouchableOpacity 
        style={{
          width: 80
        }}
        onPress={() => this.sendFriendRequest(id)}>
        <Icon color='#4388D6'
          name='account-plus'
          size={32}
          type='material-community'></Icon>
      </TouchableOpacity>
    )

    if (friends && friends[uid]) {
      if (friends[uid].status === 'accept') {
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

      if (friends[uid].status === 'pending') {
        if (friends[uid].from === uid) {
          friendStatus = (
            <Button
              title='Sent'
              disabled
              type='outline'
              buttonStyle={{
                width: 80
              }}
            ></Button>
          )
        }
        if (friends[uid].to === uid) {
          friendStatus = (
            <Button
              title='Accept'
              type='outline'
              buttonStyle={{
                width: 80
              }}
              onPress={() => this.acceptFriendRequest(friends[uid].from)}
            ></Button>
          )
        }
      }
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
    const {loading, result} = this.props.search;

    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />
    }

    if (result.length === 0) {
      return (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text>No result!</Text>
        </View>
      )
    }

    return (
      <FlatList
        keyExtractor={item => item.id}
        data={result}
        renderItem={this.renderItem}
        ></FlatList>
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default connect(mapStateToProps, actions)(SearchScreen);