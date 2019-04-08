import React, {Component} from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { SearchBar, Image, Badge } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import {connect} from 'react-redux';
import * as actions from '../actions';
import {Header} from 'react-navigation';

class SearchBarHeader extends Component {
  updateSearch = value => {
    this.props.changeSearchValue(value);
  }

  onBlur = () => {
    this.props.navigation.navigate('Search');
    this.props.fetchSearchData(this.props.search.value);
  }

  onAvatarPress = () => {
    this.props.navigation.navigate('Profile');
  }

  onFriendRequestPress = () => {
    this.props.navigation.navigate('FriendRequest');
  }

  render() {
    const {auth, search} = this.props;

    let friendRequestNumber = 0;
    Object.keys(auth.friends).forEach(id => {
      const friendRequest = auth.friends[id];
      if (friendRequest.status === 'pending' && friendRequest.to === auth.uid) {
        friendRequestNumber += 1;
      }
    })

    return (
      <View style={{
        flexDirection: 'row', 
        alignItems: 'center',
        height: Header.HEIGHT
      }}>
        <SearchBar
          round
          onBlur={this.onBlur}
          containerStyle={{ backgroundColor: 'white', borderBottomColor: 'white', borderTopColor: 'white', flex: 1}}
          inputStyle={{ backgroundColor: '#e3e3e3' }}
          inputContainerStyle={{ backgroundColor: '#e3e3e3' }}
          placeholder="Search"
          onChangeText={this.updateSearch}
          value={search.value}
        />
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            backgroundColor: '#eeeeee',
            borderRadius: 20,
            marginRight: 10
          }}
          onPress={this.onFriendRequestPress}
        >
          <Icon color='black' 
            name='account-plus' 
            size={32}
            type='material-community'></Icon>
          {friendRequestNumber > 0 ? (<Badge
            status='error'
            value={friendRequestNumber}
            containerStyle={{ position: 'absolute', top: -5, right: -5 }}
          />) : null}
        </TouchableOpacity>
        <TouchableOpacity style={{marginRight: 10}} onPress={this.onAvatarPress}>
          <Image source={{uri: auth.photoURL}}
            style={{width: 40, height: 40, borderRadius: 20}}
            PlaceholderContent={<ActivityIndicator></ActivityIndicator>}
          ></Image>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default connect(mapStateToProps, actions)(SearchBarHeader);