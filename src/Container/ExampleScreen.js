import React, { Component } from 'react';
import {
  Text,
  View,
  Button
} from 'react-native';

class ExampleScreen extends Component {
  render () {
    return (
      <View >
        <Text>
          Truong Quoc Dat
        </Text>
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    )
  }
}

export default ExampleScreen;