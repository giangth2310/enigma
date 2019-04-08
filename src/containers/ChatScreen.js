import React, {Component} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import * as actions from '../actions';

class ChatScreen extends Component {
  state = {
    messages: [],
    chatId: null,
    friendId: null
  }

  updateChatUser = snapshot => {
    const {displayName, online, lastSignIn, photoURL} = snapshot.val();
    this.props.updateChatUser({displayName, online, lastSignIn, photoURL});
  }

  receiveMessage = childSnapshot => {
    const message = childSnapshot.val();
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [message]),
    }))
  }

  componentWillMount() {
    const { navigation } = this.props;
    const { uid } = this.props.auth;
    const chatId = navigation.getParam('chatId');
    const friendId = chatId.replace(uid, '');
    firebase.database().ref(`/users/${friendId}`).on('value', this.updateChatUser);
    firebase.database().ref(`/messages/${chatId}`).on('child_added', this.receiveMessage);

    this.setState({
      friendId,
      chatId,
    })
  }

  componentWillUnmount() {
    const { friendId, chatId } = this.state;
    firebase.database().ref(`/users/${friendId}`).off('value', this.updateChatUser);
    firebase.database().ref(`/messages/${chatId}`).off('child_added', this.receiveMessage);
  }

  onSend = (messages = []) => {
    const {chatId } = this.state;
    for (let message of messages) {
      const {_id} = message;
      firebase.database().ref(`/messages/${chatId}/${_id}`).set(message);
    }
  }

  render() {
    const {uid, photoURL, displayName} = this.props.auth;
    console.log(this.state.messages);
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: uid,
          name: displayName,
          avatar: photoURL,
        }}
      />
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default connect(mapStateToProps, actions)(ChatScreen);