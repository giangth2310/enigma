import * as types from './types';
import firebase from 'react-native-firebase';

export const updateUserData = (payload) => {
  return {
    type: types.UPDATE_USER_DATA,
    payload
  }
}

export const changeSearchValue = (value) => {
  return {
    type: types.CHANGE_SEARCH_VALUE,
    value
  }
}

export const fetchSearchData = (value) => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.START_FETCH_SEARCH_DATA
    })

    const {email} = getState().auth;
    const snapshot = await firebase.database().ref('/users').once('value');
    const result = [];
    snapshot.forEach(childSnapshot => {
      const childData = childSnapshot.val();
      if (childData.email.toLowerCase().includes(value.toLowerCase()) && childData.email !== email) {
        result.push({...childData, id: childSnapshot.key});
      }
    })

    dispatch({
      type: types.FINISH_SEARCH,
      result
    })
  }
}

export const sendFriendRequest = (friendRequest) => {
  const {from, to} = friendRequest
  firebase.database().ref(`/users/${from}/friends/${to}`).set(friendRequest);
  firebase.database().ref(`/users/${to}/friends/${from}`).set(friendRequest);
  return {
    type: types.SEND_FRIEND_REQUEST,
    friendRequest
  }
}

export const acceptFriendRequest = (from, to) => {
  const updateData = {
    lastUpdate: Date.now(),
    status: 'accept'
  }
  firebase.database().ref(`/users/${from}/friends/${to}`).update(updateData);
  firebase.database().ref(`/users/${to}/friends/${from}`).update(updateData);

  return {
    type: types.ACCEPT_FRIEND_REQUEST,
    from, to
  }
}

export const updateChatUser = (user) => {
  return {
    type: types.UPDATE_CHAT_USER,
    user
  }
}