import React from 'react';
import {View} from 'react-native';
import {Avatar, Badge} from 'react-native-elements';

const StatusAvatar = ({online, ...props}) => (
  <View>
    <Avatar
      rounded
      {...props}
    />

    {online ? (
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          position: 'absolute',
          right: -1,
          bottom: -1,
          backgroundColor: 'green',
          borderColor: 'white',
          borderWidth: 2
        }}
        ></View>
    ) : null}
  </View>
)

export default StatusAvatar;