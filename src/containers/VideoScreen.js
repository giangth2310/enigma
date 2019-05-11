import React, {Component} from 'react';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  mediaDevices,
} from 'react-native-webrtc';
import {
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import { Icon} from 'react-native-elements';

let isFront = true;
let pc = null;

class VideoScreen extends Component {
  state = {
    localStreamURL: null,
    localStream: null,
    remoteStreamURL: null,
    configuration: {
      "iceServers": [
        { url: 'stun:stunserver.org' }] },
    friendId: null,
  }

  getLocalStream = () => {
    return mediaDevices.enumerateDevices().then((sourceInfos) => {
      console.log('Source Infos:', sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == 'video' && sourceInfo.facing == (isFront ? 'front' : 'back')) {
          videoSourceId = sourceInfo.id;
        }
      }
      return mediaDevices.getUserMedia({
        audio: true,
        video: {
          mandatory: {
            minWidth: 640,
            minHeight: 480,
            minFrameRate: 30
          },
          facingMode: (isFront ? 'user' : 'environment'),
          optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
        }
      })
    })
  }

  onAddStream = (e) => {
    console.info('Remote Stream Added:', e.stream)
    this.setState({
      remoteStreamURL: e.stream.toURL(),
    })
  }

  switchVideoType = () => {
    isFront = !isFront;
    this.state.localStream.getVideoTracks().forEach(track => { track._switchCamera(); });
  };

  componentWillMount() {
    const friendId = this.props.navigation.getParam('friendId');
    this.setState({
      friendId
    })
    const myId = this.props.auth.uid;
    pc = new RTCPeerConnection(this.state.configuration);

    pc.onaddstream = this.onAddStream;
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState == 'disconnected') {
        console.log('Disconnected');
      }
    }

    this.getLocalStream().then((stream) => {
      this.setState({
        localStreamURL: stream.toURL(),
        localStream: stream
      })

      pc.addStream(stream);

      pc.onicecandidate = (event) => {
        if (event && event.candidate) {
          console.log('WebRTC: sending onIceCandidate:', JSON.stringify({ 'candidate': event.candidate }));
          this.sendMessage(myId, { 'candidate': event.candidate })
        }
      }
    })

    firebase.database().ref(`/video/${friendId}`).on('child_added', this.readMessage);
  }

  componentWillUnmount() {
    pc.close();
    this.state.localStream.release();
    const {friendId} = this.state;
    firebase.database().ref(`/video/${friendId}`).off('child_added', this.readMessage);
  }

  sendMessage = (senderId, data) => {
    const msg = firebase.database().ref(`/video/${senderId}`).push(data);
    msg.remove();
  }

  readMessage = (snapshot) => {
    const myId = this.props.auth.uid;
    const msg = snapshot.val();
    if (!msg) return;

    if (msg.candidate) {
      const candidate = new RTCIceCandidate(msg.candidate)
      pc.addIceCandidate(candidate)
        .then(() => {
          console.log('WebRTC: Successfully added iceCandidate to client: iceConnectionState:', pc.iceConnectionState);
        }).catch((error) => {
          console.warn('WebRTC: Error adding iceCandidate:', error);
        });
    } else if (msg.sdp.type == "offer") {
      const description = new RTCSessionDescription(msg.sdp);

      pc.setRemoteDescription(description)
        .then(() => pc.createAnswer())
        .then(answer => pc.setLocalDescription(answer))
        .then(() => this.sendMessage(myId, { 'sdp': pc.localDescription }));
    } else if (msg.sdp.type == "answer") {
      const description = new RTCSessionDescription(msg.sdp);
      pc.setRemoteDescription(description);
    }
  }

  createOffer = () => {
    const myId = this.props.auth.uid;
    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .then(() => this.sendMessage(myId, { 'sdp': pc.localDescription }));
  }

  render() {
    return (
      <View style={styles.container}>
        <RTCView streamURL={this.state.localStreamURL} style={styles.localView} />
        <RTCView streamURL={this.state.remoteStreamURL} style={styles.remoteView} />
        <View style={styles.btnContainer}>
          <TouchableOpacity style={[styles.btn]} onPress={this.createOffer}>
            <Icon name="phone"
              type='material'
              size={40}
              color="green"></Icon>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn]} onPress={this.switchVideoType}>
            <Icon name="loop"
              type='material'
              size={40}
              color="white"></Icon>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.endCallBtn]} onPress={() => this.props.navigation.goBack()}>
            <Icon name="call-end"
              type='material'
              size={40}
              color="white"></Icon>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  btn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  endCallBtn: {
    backgroundColor: 'red'
  },
  btnContainer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  localView: {
    position: 'absolute',
    top: 20,
    right: 10,
    width: 100,
    height: 150,
  },
  remoteView: {
    width: '100%',
    height: '100%',
  }
})

const mapStateToProps = state => ({
  ...state
})

export default connect(mapStateToProps)(VideoScreen);