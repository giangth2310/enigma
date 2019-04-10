import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import {connect} from 'react-redux';
import {ListItem} from 'react-native-elements';
import moment from 'moment';
import {Text} from 'react-native-elements';

class MessageScreen extends Component {
  renderItem = ({item}) => {
    const {chatId, user: {name, avatar}, text, createdAt} = item;
    return (
      <ListItem
        key={chatId}
        title={name}
        titleStyle={{
          color: 'black'
        }}
        subtitle={text}
        leftAvatar={{ source: { uri: avatar } }}
        rightSubtitle={moment(createdAt).calendar(null, {
          sameDay: 'LT',
          lastDay: '[Yesterday]',
          lastWeek: 'dddd',
          sameElse: 'MM DD'
        })}
        onPress={() => this.props.navigation.navigate('Chat', { chatId })}
      ></ListItem>
    )
  }

  render() {
    const {lastMessages} = this.props.auth;
    const chats = [];
    for (let chatId in lastMessages) {
      chats.push({
        chatId,
        ...lastMessages[chatId]
      })
    }

    if (chats.length === 0) {
      return (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text>Search a friend and chat now!!!</Text>
        </View>
      )
    }

    chats.sort((a, b) => {
      if (a.createdAt < b.createdAt) {
        return 1;
      }
      return -1;
    })

    return (
      <FlatList
        keyExtractor={item => item.chatId}
        data={chats}
        renderItem={this.renderItem}></FlatList>
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default connect(mapStateToProps)(MessageScreen);