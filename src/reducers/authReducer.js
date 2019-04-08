import * as types from '../actions/types';

const INITIAL_STATE = {
  displayName: '',
  email: '',
  photoURL: null,
  friends: {}
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.UPDATE_USER_DATA:
    return {
      ...state,
      ...action.payload
    }
    default:
    return state;
  }
}