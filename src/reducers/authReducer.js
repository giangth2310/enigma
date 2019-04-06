import * as types from '../actions/types';

const INITIAL_STATE = {
  displayName: '',
  email: '',
  photoURL: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SIGN_IN_SUCCESS:
    return {
      ...action.payload
    }
    default:
    return state;
  }
}