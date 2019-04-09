import React, {Component} from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

class CustomView extends Component {
  render() {
    if (this.props.currentMessage.location) {
      const { latitude, longitude } = this.props.currentMessage.location;
      return (
        <TouchableOpacity style={[styles.container, this.props.containerStyle]} onPress={() => {
          this.props.navigate('Location', {
            latitude, longitude
          });
        }}>
          <MapView
            style={[styles.mapView, this.props.mapViewStyle]}
            region={{
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            scrollEnabled={false}
            zoomEnabled={false}>
            <Marker coordinate={{
              latitude,
              longitude,
            }}></Marker>
          </MapView>
        </TouchableOpacity>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 13,
    overflow: 'hidden',
    width: 220,
    height: 200,
    margin: 3
  },
  mapView: {
    flex: 1
  },
})

export default CustomView;
