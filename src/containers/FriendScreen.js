import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import {Text, ListItem} from 'react-native-elements';
import {connect} from 'react-redux';

class FriendScreen extends Component {
  componentDidMount() {
    console.log('mount');
  }
  
  render() {
    const {friends} = this.props.auth;
    if (Object.keys(friends).length === 0) {
      return (
        <View style={{alignItems: 'center', marginTop: 20}}>
          <Text>You don't have any friends</Text>
          <Text>Let search and add a friend</Text>
        </View>
      )
    }

    return (
      <View>
        <Text>FriendScreen</Text>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default connect(mapStateToProps)(FriendScreen);