import React, {Component} from 'react';
import {Text, View} from 'react-native';

class ChatScreen extends Component {
  componentDidMount() {
    const {navigation} = this.props;
    console.log(navigation.getParam('chatId'));
  }

  render() {
    return (
      <View>
        <Text>ChatScreen</Text>
      </View>
    )
  }
}

export default ChatScreen;