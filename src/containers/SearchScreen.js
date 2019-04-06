import React, { Component } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import {connect} from 'react-redux';

class SearchScreen extends Component {
  render() {
    let content = <ActivityIndicator size="large" color="#0000ff" />;
    const {loading, result} = this.props.search;

    if (!loading) {
      content = (
        <Text>
          {result.toString()}
        </Text>
      )
    }

    return (
      <View>
        {content}
      </View>
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default connect(mapStateToProps)(SearchScreen);