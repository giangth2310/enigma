import React, { Component, Fragment } from 'react';
import { GiftedChat, Actions } from 'react-native-gifted-chat';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Icon } from 'react-native-elements';
import { Alert, Keyboard, View } from 'react-native';
import CustomView from '../components/CustomView';
import { ModalPicker } from 'emoji-mart-native';
import data from 'emoji-mart-native/data/facebook.json';
import dataRequires from 'emoji-mart-native/data/local-images/facebook';
import ImagePicker from 'react-native-image-picker';

const { emojis: localEmojis } = dataRequires

const LIMIT_MESSAGE = 20;

class ChatScreen extends Component {
  state = {
    messages: [],
    chatId: null,
    friendId: null,
    isLoadingEarlier: false,
    loadEarlier: true,
    text: '',
    openEmojiPicker: false
  }

  updateChatUser = snapshot => {
    const { displayName, online, lastSignIn, photoURL } = snapshot.val();
    this.props.updateChatUser({ displayName, online, lastSignIn, photoURL });
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
    firebase.database().ref(`/messages/${chatId}`)
      .orderByChild('createdAt').limitToLast(LIMIT_MESSAGE).on('child_added', this.receiveMessage);

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

  onLoadEarlier = () => {
    this.setState({
      isLoadingEarlier: true
    }, () => {
      const { chatId, messages } = this.state;
      const lastMessage = messages[messages.length - 1];
      firebase.database().ref(`/messages/${chatId}`)
        .orderByChild('createdAt').endAt(lastMessage.createdAt)
        .limitToLast(LIMIT_MESSAGE + 1).once('value', snapshot => {
          const response = snapshot.val();
          delete response[lastMessage._id];

          const olderMessages = [];
          for (let message in response) {
            olderMessages.push(response[message]);
          }

          const loadEarlier = olderMessages.length === LIMIT_MESSAGE;

          this.setState(previousState => ({
            messages: GiftedChat.append(olderMessages, previousState.messages),
            isLoadingEarlier: false,
            loadEarlier
          }))
        })
    })
  }

  onSend = (messages = []) => {
    const { chatId } = this.state;
    for (let message of messages) {
      const { _id } = message;
      firebase.database().ref(`/messages/${chatId}/${_id}`).set(message);
    }
  }

  onInputTextChanged = text => {
    this.setState({ text });
  }

  renderActions = props => {
    return (
      <Fragment>
        <Actions icon={() => (
          <Icon
            name='smileo'
            type='antdesign'
            color='#4388D6' />
        )}
          onPressActionButton={this.openEmojiPicker}
        ></Actions>
        <Actions icon={() => (
          <Icon
            name='location'
            type='entypo'
            color='#4388D6' />
        )}
          onPressActionButton={() => this.sendLocation(props)}
        ></Actions>
        <Actions icon={() => (
          <Icon
            name='image'
            type='font-awesome'
            color='#4388D6' />
        )}
          onPressActionButton={() => this.sendImage(props)}
        ></Actions>
        <Actions icon={() => (
          <Icon
            name='camera'
            type='feather'
            color='#4388D6' />
        )}
          onPressActionButton={() => this.takePhoto(props)}
        ></Actions>
      </Fragment>
    )
  }

  sendLocation = (props) => {
    navigator.geolocation.getCurrentPosition(position => {
      const { coords: { latitude, longitude } } = position;
      const messages = [{
        user: props.user,
        createdAt: new Date(),
        _id: props.messageIdGenerator(),
        location: {
          latitude,
          longitude
        }
      }]
      this.onSend(messages);
    },
      error => Alert.alert('Can not get your location!', 'Make sure you allow location on enigma and location is turned on.'),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 })
  }

  sendImage = (props) => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled video picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert('Cops!!!', "Something went wrong :(");
      } else {
        const image = 'data:image/jpeg;base64,' + response.data;
        const messages = [{
          user: props.user,
          createdAt: new Date(),
          _id: props.messageIdGenerator(),
          image
        }]
        this.onSend(messages);
      }
    })
  }

  takePhoto = (props) => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled video picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert('Cops!!!', "Something went wrong :(");
      } else {
        const image = 'data:image/jpeg;base64,' + response.data;
        const messages = [{
          user: props.user,
          createdAt: new Date(),
          _id: props.messageIdGenerator(),
          image
        }]
        this.onSend(messages);
      }
    })
  }

  openEmojiPicker = () => {
    Keyboard.dismiss();
    this.setState({ openEmojiPicker: true });
  }

  onFocusTextInput = () => {
    this.setState({ openEmojiPicker: false });
  }

  addEmoji = (emoji) => {
    this.setState(previousState => {
      return {
        text: previousState.text + emoji
      }
    })
  }

  renderCustomView = (props) => {
    return (
      <CustomView
        navigate={this.props.navigation.navigate}
        {...props}
      />
    );
  }

  render() {
    const { uid, photoURL, displayName } = this.props.auth;
    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          loadEarlier={this.state.loadEarlier}
          onLoadEarlier={this.onLoadEarlier}
          isLoadingEarlier={this.state.isLoadingEarlier}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          placeholder='Type a message...'
          text={this.state.text}
          onInputTextChanged={this.onInputTextChanged}
          renderActions={this.renderActions}
          textInputProps={{
            onFocus: this.onFocusTextInput,
          }}
          renderCustomView={this.renderCustomView}
          user={{
            _id: uid,
            name: displayName,
            avatar: photoURL,
          }}
        />
        <ModalPicker isVisible={this.state.openEmojiPicker} showCloseButton
          onPressClose={() => {
            this.setState({ openEmojiPicker: false })
          }}
          set='facebook' data={data} useLocalImages={localEmojis}
          onSelect={emoji => {
            this.addEmoji(emoji.native);
          }} />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default connect(mapStateToProps, actions)(ChatScreen);