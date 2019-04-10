import * as types from '../actions/types';

const INITIAL_STATE = {
  value: '',
  loading: false,
  result: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.CHANGE_SEARCH_VALUE:
    return {
      ...state,
      value: action.value
    }
    case types.START_FETCH_SEARCH_DATA:
    return {
      ...state,
      loading: true,
      value: ''
    }
    case types.FINISH_SEARCH:
    return {
      ...state,
      result: action.result,
      loading: false,
    }
    case types.SEND_FRIEND_REQUEST:
    let replaceIndex = state.result.findIndex(item => item.uid === action.friendRequest.to);
    let newResult = [...state.result];
    newResult[replaceIndex] = {
      ...state.result[replaceIndex],
      friends: {
        ...state.result[replaceIndex].friends,
        [action.friendRequest.from]: {
          ...action.friendRequest
        }
      }
    }
    return {
      ...state,
      result: newResult
    }

    case types.ACCEPT_FRIEND_REQUEST:
    replaceIndex = state.result.findIndex(item => item.uid === action.from);
    newResult = [...state.result];
    newResult[replaceIndex] = {
      ...state.result[replaceIndex],
      friends: {
        ...state.result[replaceIndex].friends,
        [action.to]: {
          ...state.result[replaceIndex].friends[action.to],
          status: 'accept'
        }
      }
    }

    return {
      ...state,
      result: newResult
    }
    default:
      return state;
  }
}