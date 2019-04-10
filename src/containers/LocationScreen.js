import React, {Component, Fragment} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {Button} from 'react-native-elements';
import getDirections from 'react-native-google-maps-directions';
import {Alert} from 'react-native';

class Location extends Component {
  onGetDirections = async () => {
    const { navigation } = this.props;
    const latitude = navigation.getParam('latitude');
    const longitude = navigation.getParam('longitude');

    navigator.geolocation.getCurrentPosition(position => {
      const { coords } = position;
      const data = {
        source: coords,
        destination: {
          latitude,
          longitude
        }
      }

      getDirections(data)
    },
    error => Alert.alert('Can not get your location!', 'Make sure you allow location on enigma and location is turned on.'),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 })
  }

  render() {
    const { navigation } = this.props;
    const latitude = navigation.getParam('latitude');
    const longitude = navigation.getParam('longitude');

    return (
      <Fragment>
        <MapView
          style={{flex: 1}}
          showsUserLocation
          showsMyLocationButton
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={{
              latitude, longitude
            }}></Marker>
        </MapView>
        <Button title='Get Directions' onPress={this.onGetDirections}></Button>
      </Fragment>
    )
  }
}

export default Location;