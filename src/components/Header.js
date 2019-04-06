import React, {Component} from "react";
import { View, TouchableOpacity } from "react-native";
import { SearchBar } from 'react-native-elements';
import { Avatar } from 'react-native-elements';
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

  render() {
    const {auth, search} = this.props;
    console.log(Header.HEIGHT);

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
            width: 50,
            height: 50,
            backgroundColor: '#eeeeee',
            borderRadius: 25,
            marginRight: 10
          }}
        >
        <Icon color='black' 
          name='account-plus' 
          size={32}
          type='material-community'></Icon>
        </TouchableOpacity>
        <Avatar
          rounded
          size='medium'
          source={{
            uri: auth.photoURL,
          }}
          onPress={this.onAvatarPress}
          containerStyle={{marginRight: 10}}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default connect(mapStateToProps, actions)(SearchBarHeader);