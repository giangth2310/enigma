import * as types from './types';
import firebase from 'react-native-firebase';

export const signInSuccess = (payload) => {
  return {
    type: types.SIGN_IN_SUCCESS,
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
        result.push(childData);
      }
    })

    dispatch({
      type: types.FINISH_SEARCH,
      result
    })
  }
}