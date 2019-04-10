import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Header} from 'react-navigation';
import {connect} from 'react-redux';
import StatusAvatar from './StatusAvatar';
import {Text, Icon} from 'react-native-elements';

class ChatHeader extends Component {
  render() {
    const {displayName, photoURL, online} = this.props.chat;

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: Header.HEIGHT,
        flex: 1,
        justifyContent: 'space-between'
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <StatusAvatar online={online} 
            source={{
              uri: photoURL,
            }}></StatusAvatar>
          <Text style={{
            fontSize: 16,
            color: 'black',
            fontWeight: '400',
            marginLeft: 20
          }}>{displayName}</Text>
        </View>
        <TouchableOpacity style={{
          marginRight: 20
        }}>
          <Icon
            name='ios-videocam'
            type='ionicon'
            size={32}
            color='#4388D6' />
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default connect(mapStateToProps)(ChatHeader);