import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {Input, Icon} from 'react-native-elements';
import * as actions from '../actions';
import {Header} from 'react-navigation';

class SearchBarHeader extends Component {
  updateSearch = value => {
    this.props.changeSearchValue(value);
  }

  clearSearch = () => {
    this.props.changeSearchValue('');
  }

  onBlur = () => {
    this.props.fetchSearchData(this.props.search.value);
  }

  render() {
    const {search} = this.props;

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: Header.HEIGHT,
        flex: 1
      }}>
        <Input 
          containerStyle={{
            flex: 1,
          }}
          inputContainerStyle={{
            borderBottomWidth: 0
          }}
          onBlur={this.onBlur}
          placeholder='Search'
          value={search.value}
          onChangeText={this.updateSearch}></Input>
        <TouchableOpacity
          style={{
            marginRight: 10
          }}
          onPress={this.clearSearch}>
          <Icon
            color='black'
            size={32}
            name='close'
            type='material'
          ></Icon>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default connect(mapStateToProps, actions)(SearchBarHeader);