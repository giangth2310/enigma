import * as types from '../actions/types';

const INITIAL_STATE = {
  displayName: '',
  photoURL: null,
  online: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.UPDATE_CHAT_USER:
      return {
        ...state,
        ...action.user
      }
    default:
      return state;
  }
}